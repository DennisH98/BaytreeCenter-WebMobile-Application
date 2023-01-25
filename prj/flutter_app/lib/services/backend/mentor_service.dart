import 'package:flutter_app/models/login_response.dart';
import 'package:flutter_app/models/goal.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/services/backend/api_services.dart';
import 'package:flutter_app/services/backend/endpoints.dart';
import 'package:flutter_app/services/backend/notification.dart';
import 'package:flutter_app/utils/storage_keys.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_app/services/backend/platform.dart';

import 'dart:convert';
import 'dart:io';

import "package:http/http.dart" as http;

import 'api_services.dart';

class MentorService {
  static Future<http.Response> getDashboardData() async {
    late String viewsID;
    await SecureStorage.getValue(StorageKeys.viewsMentorId).then((value) {
      viewsID = value!;
    });
    http.Response schedulesResponse = await BackendAPIRequester.getRequest(
        endpoint: Endpoints.MENTOR_ACCOUNT, parameters: viewsID);
    return schedulesResponse;
  }

  static Future<http.Response> updateGoal(Goal goal) async {
    // todo: query backend
    await Future.delayed(Duration(seconds: 2));
    http.Response response = http.Response("", 200); // mock

    return response;
  }

  static Future<List<MentorAccountResponse>> getMentorAccounts(
      {List<String>? ids}) async {
    String filterParam = "?";
    if (ids != null) {
      for (var id in ids) {
        filterParam += "id[]=" + id + "&";
      }

      filterParam = filterParam.substring(0, filterParam.length - 1);
    }

    var response = await BackendAPIRequester.getRequest(
        endpoint: Endpoints.MENTOR_ACCOUNT, parameters: filterParam);

    var responseObjects = json.decode(response.body)["data"] as List<dynamic>;

    return responseObjects
        .map((responseObj) => MentorAccountResponse.fromJson(responseObj))
        .toList();
  }

  static Future<void> putMentorAccounts(
      List<MentorAccountRequest> mentorAccounts) async {
    List<Map<String, dynamic>> mentorAccountRequestObjects = mentorAccounts
        .map((mentorAccount) => MentorAccountRequest.toJson(mentorAccount))
        .toList();

    await BackendAPIRequester.putRequest(
        endpoint: Endpoints.MENTOR_ACCOUNT,
        objDataList: mentorAccountRequestObjects);
  }

  static Future<http.Response> newGoal(Goal goal) async {
    // todo: query backend
    await Future.delayed(Duration(seconds: 2));
    http.Response response = http.Response("", 200); // mock

    return response;
  }

  static Future<bool> login(String username, String password) async {
    try {
      LoginResponse? loginResponse =
          await _sendLoginRequest(username, password);
      if (loginResponse == null) {
        return false;
      } else {
        await SecureStorage.setValue(
            StorageKeys.authToken, loginResponse.token);
        await SecureStorage.setValue(
            StorageKeys.viewsMentorId, loginResponse.viewsId);

        String mentorAccountId = loginResponse.mentorAccountId;
        SecureStorage.setValue(StorageKeys.mentorAccountId, mentorAccountId);
        NotificationService.instance
            .registerFCMTokenForMentorAccount(mentorAccountId: mentorAccountId);

        return true;
      }
    } on SocketException {
      return false;
    } catch (e) {
      return false;
    }
  }

  static Future<LoginResponse?> _sendLoginRequest(
      String username, String password) async {
    var res =
        await http.post(Uri.parse(determinePlatform() + Endpoints.MENTOR_LOGIN),
            headers: {"Content-Type": "application/json"},
            body: jsonEncode(<String, String>{
              "identifier": username,
              "password": password,
            }));

    if (res.statusCode == 200) {
      LoginResponse loginResponse =
          LoginResponse.fromJson(jsonDecode(res.body));
      return loginResponse;
    } else {
      return null;
    }
  }

  static Future<bool> resetPassword(String email) async {
    try {
      bool loginResponse = await _sendResetPasswordRequest(email);
      return loginResponse;
    } on SocketException {
      return false;
    } catch (e) {
      return false;
    }
  }

  static Future<bool> _sendResetPasswordRequest(String email) async {
    var res = await http.post(
      Uri.parse(
          determinePlatform() + Endpoints.MENTOR_PASSWORD_RESET + "/email"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(<String, String>{
        "email": email,
      }),
    );

    return (res.statusCode == 200);
  }

  static Future logout() async => await SecureStorage.deleteAll();
}

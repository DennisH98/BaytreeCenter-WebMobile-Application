import 'dart:convert';
import 'package:flutter_app/services/backend/platform.dart';
import 'package:http/http.dart' as http;

class BackendAPIRequester {
  static final String baseURL = determinePlatform();

  static final Map<String, String> headers = {
    "Content-Type": "application/json"
  };

  static Future<http.Response> getRequest(
      {required String endpoint, String parameters = ""}) async {
    final response = await http.get(Uri.parse(baseURL + endpoint + parameters));
    if (response.statusCode == 200) {
      return response;
    } else {
      throw Exception(
          'Unable to access backend API. Returned with status code ${response.statusCode}');
    }
  }

  // only supports one "or" query parameter for now
  static String getUrlQueryString({Map<String, dynamic>? queryParams}) {
    String queryString = "?";
    if (queryParams != null) {
      for (var filter in queryParams.keys) {
        if (filter == "or") {
          String orQueryString = "or=";
          for (var orFilter in queryParams[filter]) {
            for (var key in orFilter.keys) {
              if (orFilter[key]!.isNotEmpty) {
                if (orFilter[key]!.length > 1) {
                  for (var filterVal in orFilter[key]!) {
                    orQueryString += "$key[]=$filterVal@@@";
                  }
                } else {
                  for (var filterVal in orFilter[key]!) {
                    orQueryString += "$key=$filterVal@@@";
                  }
                }
              }
            }
          }
          queryString +=
              orQueryString.substring(0, orQueryString.length - 3) + "&";
        } else {
          if (queryParams[filter]!.length > 1) {
          } else if (queryParams[filter]!.isNotEmpty) {
            queryString += "$filter=${(queryParams[filter]![0])}&";
          }
        }
      }
    }

    queryString = queryString.substring(0, queryString.length - 1);

    return queryString;
  }

  // The objDataMap represents json encoded data of your object. For reference, look at toJson() of session_schedule model
  static Future<http.Response> postRequest(
      {required String endpoint,
      String parameters = "",
      required Map<String, dynamic> objDataMap}) async {
    final response = await http.post(Uri.parse(baseURL + endpoint + parameters),
        body: jsonEncode(objDataMap), headers: headers);
    if (response.statusCode == 200 || response.statusCode == 201) {
      return response;
    } else {
      throw Exception(
          'Bad response from backend API. Returned with status code ${response.statusCode}');
    }
  }

  // The objDataMap represents json encoded data of your object. For reference, look at toJson() of session_schedule model
  static Future<http.Response> putRequest(
      {required String endpoint,
      String parameters = "",
      Map<String, dynamic>? objDataMap,
      List<Map<String, dynamic>>? objDataList}) async {
    final response = await http.put(Uri.parse(baseURL + endpoint + parameters),
        body: jsonEncode(objDataMap ?? objDataList), headers: headers);
    if (response.statusCode == 200 || response.statusCode == 201) {
      return response;
    } else {
      throw Exception(
          'Bad response from backend API. Returned with status code ${response.statusCode}');
    }
  }

  static Future<http.Response> deleteRequest(
      {required String endpoint, String parameters = ""}) async {
    final response =
        await http.delete(Uri.parse(baseURL + endpoint + parameters));
    if (response.statusCode == 200) {
      return response;
    } else {
      throw Exception(
          'Unable to delete from backend API. Returned with status code ${response.statusCode}');
    }
  }

  // TODO: Refactor POST and PATCH methods to reduce code duplication
  static Future<http.Response> patchRequest(
      {required String endpoint,
      String parameters = "",
      required Map<String, dynamic> objDataMap}) async {
    final response = await http.patch(
        Uri.parse(baseURL + endpoint + parameters),
        body: jsonEncode(objDataMap),
        headers: headers);
    if (response.statusCode == 200 || response.statusCode == 201) {
      return response;
    } else {
      throw Exception(
          'Bad response from backend API. Returned with status code ${response.statusCode}');
    }
  }
}

import 'package:flutter_app/models/goal.dart';
import 'package:flutter_app/models/questionnaire.dart';
import 'package:flutter_app/models/session_schedule.dart';

import 'mentee.dart';
import 'mentor.dart';

class MentorAccountResponse {
  final String id;
  final String firstName;
  final String lastName;
  final String viewsId;
  final String email;
  final String username;
  final List<String> mentorTypes;
  final List<String> mentees;
  final List<String> schedules;
  final List<String> fcmRegistrationTokens;

  MentorAccountResponse(
      {required this.id,
      required this.firstName,
      required this.lastName,
      required this.viewsId,
      required this.email,
      required this.username,
      required this.mentorTypes,
      required this.mentees,
      required this.schedules,
      required this.fcmRegistrationTokens});

  factory MentorAccountResponse.fromJson(Map<String, dynamic> json) {
    return MentorAccountResponse(
        id: json["id"],
        firstName: json["firstName"],
        lastName: json["lastName"],
        viewsId: json["viewsId"],
        email: json["email"],
        username: json["username"],
        mentorTypes: json["mentorTypes"].cast<String>(),
        mentees: json["mentees"].cast<String>(),
        schedules: json["schedules"].cast<String>(),
        fcmRegistrationTokens: json["fcmRegistrationTokens"].cast<String>());
  }

  static Map<String, dynamic> toJson(
      MentorAccountResponse mentorAccountResponse) {
    return {
      "id": mentorAccountResponse.id,
      "firstName": mentorAccountResponse.firstName,
      "lastName": mentorAccountResponse.lastName,
      "viewsId": mentorAccountResponse.viewsId,
      "email": mentorAccountResponse.email,
      "username": mentorAccountResponse.username,
      "mentorTypes:": mentorAccountResponse.mentorTypes,
      "mentees": mentorAccountResponse.mentees,
      "schedules": mentorAccountResponse.schedules,
      "fcmRegistrationTokens": mentorAccountResponse.fcmRegistrationTokens
    };
  }
}

class MentorAccountRequest {
  String? id;
  String? firstName;
  String? lastName;
  String? viewsId;
  String? email;
  String? username;
  List<String>? mentorTypes;
  List<String>? mentees;
  List<String>? schedules;
  List<String>? fcmRegistrationTokens;

  MentorAccountRequest(
      {this.id,
      this.firstName,
      this.lastName,
      this.viewsId,
      this.email,
      this.username,
      this.mentorTypes,
      this.mentees,
      this.schedules,
      this.fcmRegistrationTokens});

  factory MentorAccountRequest.fromJson(Map<String, dynamic> json) {
    return MentorAccountRequest(
        id: json["id"],
        firstName: json["firstName"],
        lastName: json["lastName"],
        viewsId: json["viewsId"],
        email: json["email"],
        username: json["username"],
        mentorTypes: json["mentorTypes"].cast<String>(),
        mentees: json["mentees"].cast<String>(),
        schedules: json["schedules"].cast<String>(),
        fcmRegistrationTokens: json["fcmRegistrationTokens"].cast<String>());
  }

  static Map<String, dynamic> toJson(
      MentorAccountRequest mentorAccountRequest) {
    Map<String, dynamic> json;
    json = {
      "id": mentorAccountRequest.id,
      "firstName": mentorAccountRequest.firstName,
      "lastName": mentorAccountRequest.lastName,
      "viewsId": mentorAccountRequest.viewsId,
      "email": mentorAccountRequest.email,
      "username": mentorAccountRequest.username,
      "mentorTypes:": mentorAccountRequest.mentorTypes,
      "mentees": mentorAccountRequest.mentees,
      "schedules": mentorAccountRequest.schedules,
      "fcmRegistrationTokens": mentorAccountRequest.fcmRegistrationTokens
    };

    json.removeWhere((key, value) => value == null);

    return json;
  }
}

class MentorAccount {
  late Mentor mentor;
  late int viewedMenteeIndex;
  late List<Mentee> menteeList = [];
  late List<Goal> goalsList;
  late List<SessionsSchedule> schedules = [];
  late List<Questionnaire> questionnaires;
  late List<int> assignedQuestionnairesIds = [];

  late void Function() refreshDashboard;

  static final MentorAccount _inst = MentorAccount._internal();

  static get instance {
    return _inst;
  }

  MentorAccount._internal();

  factory MentorAccount() {
    return _inst;
  }
}

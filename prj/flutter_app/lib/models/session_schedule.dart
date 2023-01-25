import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentee.dart';
import 'package:flutter_app/utils/general.dart';
import 'package:flutter_app/utils/response_parser.dart';
import 'package:intl/intl.dart';

class SessionsSchedule implements Comparable<SessionsSchedule> {
  final String? scheduleID;
  final DateTime startDate;
  final Mentee mentee;

  SessionsSchedule(
      {this.scheduleID, required this.startDate, required this.mentee});

  Map<String, String> toJson() => {
        "scheduleID": scheduleID == null ? "" : scheduleID.toString(),
        "startDate": startDate.toUtc().toString(),
        "menteeDocumentID": mentee.documentID.toString()
      };

  SessionsSchedule.fromJson({required Map<String, dynamic> jsonObj})
      : scheduleID = jsonObj["_id"].toString(),
        startDate = DateTime.parse(jsonObj["startDate"]).toLocal(),
        mentee = Mentee(
            documentID: jsonObj["menteeDocumentID"]["_id"],
            fName: jsonObj["menteeDocumentID"]["firstName"],
            lName: jsonObj["menteeDocumentID"]["lastName"],
            viewsID: int.parse(jsonObj["menteeDocumentID"]["viewsId"]));

  static List<SessionsSchedule> jsonToSchedulesList(
      {required String jsonResponseBody}) {
    try {
      List<dynamic> jsonSchedules = jsonDecode(jsonResponseBody);
      return listDynamicObjectsToSchedulesList(dynamicSchedules: jsonSchedules);
    } on Exception {
      throw Exception("Bad data format");
    }
  }

  static List<SessionsSchedule> listDynamicObjectsToSchedulesList(
      {required List<dynamic> dynamicSchedules}) {
    List<SessionsSchedule> schedules = [];

    dynamicSchedules.forEach((mapElement) {
      schedules.add(SessionsSchedule.fromJson(jsonObj: mapElement));
    });

    return schedules;
  }

  /// An object is smaller than the other if the object is closer to
  /// today's day of the week than the other's day of the week
  @override
  int compareTo(SessionsSchedule other) {
    DateTime now = DateTime.now();
    int weekdayCompareToResult = compareToWeekdays(
        startDate.weekday, other.startDate.weekday, now.weekday);

    if (weekdayCompareToResult < 0) {
      return -1;
    } else if (weekdayCompareToResult > 0) {
      return 1;
    } else {
      int timeCompareToResult = compareToTime(startDate, other.startDate, now);
      if (timeCompareToResult < 0) {
        return -1;
      } else if (timeCompareToResult > 0) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}

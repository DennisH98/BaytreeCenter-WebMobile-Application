import 'package:flutter/material.dart';
import "package:flutter_app/utils/response_parser.dart";

class Session {
  final int? sessionID;
  final int? sessionGroupID;
  final String? sessionType;
  final String? name;
  DateTime? startDate;
  TimeOfDay? startTime;
  Duration? duration;
  bool? cancelled;
  List<String>? activities;
  final int? leadStaff;
  final int? venueID;
  final DateTime? created;
  final String? createdBy;
  DateTime? updated;
  String? updatedBy;
  final int? restrictedRecord;
  final String? contactType;
  final String? sessionKey;
  final String? venueName;

  Session(
      {this.sessionID,
      this.sessionGroupID,
      this.sessionType,
      this.name,
      this.startDate,
      this.startTime,
      this.duration,
      this.cancelled,
      this.activities,
      this.leadStaff,
      this.venueID,
      this.created,
      this.createdBy,
      this.updated,
      this.updatedBy,
      this.restrictedRecord,
      this.contactType,
      this.sessionKey,
      this.venueName});

  factory Session.fromJson(Map<String, dynamic> json) {
    return Session(
        sessionID: ResponseParser.toInt(json["SessionID"]),
        sessionGroupID: ResponseParser.toInt(json["SessionGroupID"]),
        sessionType: ResponseParser.toStringNullSafe(json["SessionType"]),
        name: ResponseParser.toStringNullSafe(json["Name"]),
        startDate: ResponseParser.toDateTime(json["StartDate"]),
        startTime: ResponseParser.toTimeOfDay(json["StartTime"]),
        duration: ResponseParser.toDuration(json["Duration"]),
        cancelled: ResponseParser.toBool(json["Cancelled"]),
        activities: ResponseParser.toStringList(json["Activities"]),
        leadStaff: ResponseParser.toInt(json["LeadStaff"]),
        venueID: ResponseParser.toInt(json["VenueID"]),
        created: ResponseParser.toDateTime(json["Created"]),
        createdBy: ResponseParser.toStringNullSafe(json["CreatedBy"]),
        updated: ResponseParser.toDateTime(json["Updated"]),
        updatedBy: ResponseParser.toStringNullSafe(json["UpdatedBy"]),
        restrictedRecord: ResponseParser.toInt(json["RestrictedRecord"]),
        contactType: ResponseParser.toStringNullSafe(json["ContactType"]),
        sessionKey: ResponseParser.toStringNullSafe(json["SessionKey"]),
        venueName: ResponseParser.toStringNullSafe(json["VenueName"]));
  }
}

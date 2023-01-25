import 'package:flutter_app/utils/response_parser.dart';

class Participant {
  final int? sessionId;
  final String? contactType;
  final int? contactId;
  final int? attended;
  final String? volunteering;
  final String? name;
  final int? sessionGroupId;

  Participant(
      {this.sessionId,
      this.contactType,
      this.contactId,
      this.attended,
      this.volunteering,
      this.name,
      this.sessionGroupId});

  factory Participant.fromJson(Map<String, dynamic> json) {
    return Participant(
        sessionId: ResponseParser.toInt(json["SessionID"]),
        contactType: ResponseParser.toStringNullSafe(json["ContactType"]),
        contactId: ResponseParser.toInt(json["ContactID"]),
        attended: ResponseParser.toInt(json["Attended"]),
        volunteering: ResponseParser.toStringNullSafe(json["Volunteering"]),
        name: ResponseParser.toStringNullSafe(json["Name"]),
        sessionGroupId: ResponseParser.toInt(json["SessionGroupID"]));
  }
}

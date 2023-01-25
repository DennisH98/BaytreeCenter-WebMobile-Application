import 'package:flutter/material.dart';
import 'package:flutter_app/models/session.dart';
import 'package:flutter_app/screens/questionnaire/questionnaire.dart';
import 'package:xml/xml.dart';

class RequestBodyBuilder {
  static String convertQuestionnaireAnswersToXMLString(
      List<Map<String, dynamic>> values) {
        
    final builder = XmlBuilder();
    //builder.processing('xml', 'version="1.0"');
    builder.element('answers', nest: () {
      builder.element('EntityType', nest: "Person");
      builder.element('EntityID', nest: 4); // 4 is maria
      for (var qn in values) {
        builder.element('answer', nest: () {
          builder.attribute('id', qn["QuestionID"]);
          builder.element('Answer', nest: qn["value"]);
        });
      }
    });
    final answersXML = builder.buildDocument();
    return answersXML.toString();
  }

  static String buildCreateSessionXMLBody(Session session) {
    final builder = XmlBuilder();

    builder.element('session', nest: () {
      builder.element('SessionGroupID', nest: session.sessionGroupID);
      builder.element('SessionType', nest: session.sessionType);
      builder.element('Name', nest: session.name);

      builder.element('StartDate', nest: "${session.startDate?.year}-" +
        (session.startDate as DateTime).month.toString().padLeft(2, "0") + 
        "-${(session.startDate as DateTime).day.toString().padLeft(2, "0")}");

      builder.element('StartTime', nest: "${session.startTime?.hour}:" +
        (session.startTime as TimeOfDay).minute.toString().padLeft(2, "0"));

      var durationInMinutes = (session.duration as Duration).inMinutes;
      var durationHours = (durationInMinutes ~/ 60);
      var durationMinutes = durationInMinutes - durationHours * 60;
      var durationHoursPadded = durationHours.toString().padLeft(2, "0");
      var durationMinutesPadded = durationMinutes.toString().padLeft(2, "0");
      builder.element('Duration', nest: "$durationHoursPadded:$durationMinutesPadded");

      builder.element('Cancelled', nest: (session.cancelled != null
        && session.cancelled as bool ? "1" : "0"));

      String activitiesXML = "";
      if (session.activities != null) {
        var activities = session.activities as List<String>;
        activitiesXML = activities[0];
        for (int i = 1; i < activities.length; i++) {
          activitiesXML += "|${activities[i]}";
        }
      }
      builder.element('Activity', nest: activitiesXML);

      builder.element('LeadStaff', nest: session.leadStaff);
      builder.element('VenueID', nest: session.venueID);
      builder.element('RestrictedRecord', nest: session.restrictedRecord);
      builder.element('ContactType', nest: session.contactType);
    });

    return builder.buildDocument().toString();
  }

  static String buildAddSessionParticipantXMLBody(
      {required int contactID, required bool attended}) {

    final builder = XmlBuilder();

    builder.element('participant', nest: () {
      builder.element('ContactID', nest: contactID);
      builder.element('Attended', nest: (attended ? "1" : "0"));
    });

    return builder.buildDocument().toString();
  }

  static String buildAddSessionStaffXMLBody(
      {required int contactID,
      required bool attended,
      String role = "",
      String volunteering = ""}) {

    final builder = XmlBuilder();

    builder.element('staff', nest: () {
      builder.element('ContactID', nest: contactID);
      builder.element('Attended', nest: (attended ? "1" : "0"));
      role == "" ? "" : builder.element('Role', nest: role);
      volunteering == ""
          ? ""
          : builder.element('Volunteering', nest: volunteering);
    });

    return builder.buildDocument().toString();
  }
}

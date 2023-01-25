import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_app/models/goal.dart';
import 'package:flutter_app/models/mentee.dart';
import 'package:flutter_app/models/mentor.dart';
import 'package:flutter_app/models/note.dart';
import 'package:flutter_app/models/participant.dart';
import 'package:flutter_app/models/question.dart';
import 'package:flutter_app/models/session.dart';
import 'package:flutter_app/models/session_attendance.dart';
import 'package:flutter_app/models/staff.dart';

class ResponseParser {
  static List<int> parseAvailableQuestionnaireIds(String dataJSON) {
    List<int> availQuestionnaires = [];
    // try {
    //   var mt = json.decode(dataJSON);
    //   List assigned = mt['assigned_questionnaires'] as List;
    //   for (int i=0; i<assigned.length; i++) {
    //     availQuestionnaires.add(assigned[i] as int);
    //   }
    // } catch (e){
    //   print(e);
    // }
    // ok to return null, handled in caller
    availQuestionnaires = [5,21];

    return availQuestionnaires;
  }

  static List<Mentee> parseMentees(String dataJSON) {
    late List<Mentee> menteeList = [];
    int vId = -1;
    String fName = "fName";
    String lName = "lName";
    try {
      var data = json.decode(dataJSON);
      Map<String, dynamic> dataList = Map<String, dynamic>.from(data);
      dataList.forEach((field,value) {
        if (field == "mentees") {
          dataList[field].forEach((mentee) {
            vId = int.parse(mentee["viewsId"]);
            fName = mentee["firstName"];
            lName = mentee["lastName"];
            menteeList.add(Mentee(viewsID: vId, fName: fName, lName: lName));
          });
        }
      });
    } catch (e) {
      print("parseMentees error");
    }
    return menteeList;
  }

  static Mentor parseMentorInfo(String dataJSON) {
    int vId = -1;
    String fName = "fName";
    String lName = "lName";
    Mentor mentor;
    try {
      var data = json.decode(dataJSON);
      Map<String, dynamic> dataList = Map<String, dynamic>.from(data);
      vId = int.parse(dataList["viewsId"]);
      fName = dataList["firstName"];
      lName = dataList["lastName"];
    } catch (e){
      print("parseMentorInfo error");
    }
    mentor = Mentor(id: vId, fName: fName, lName: lName);
    return mentor;
  }

  static List<Goal> parseGoals(String dataJSON) {
    List<Goal> goalsList = [];
    try {
      var data = json.decode(dataJSON);
      Map<String, dynamic> dataList = Map<String, dynamic>.from(data);
      dataList.forEach((field,value) {
        if (field == "goals") {
          dataList[field].forEach((goal) {
            //goalsList.add(new Goal());
          });
        }
      });
    } catch (e) {
      print(e);
    }
    // ok to return null, handled in caller
    return goalsList;
  }

  static String parseQuestionnaireName(String questionnaireJSON) {
    Map<String, dynamic> data = jsonDecode(questionnaireJSON);
    String questionnaireTitle = data['Title'];
    return questionnaireTitle;
  }

  static List<Question> parseQuestionnaireQuestions(String questionnaireJSON) {
    Map<String, dynamic> data = jsonDecode(questionnaireJSON);
    final jsonQuestions = data['questions'] as Map<String, dynamic>;

    List<Question> questionList = [];
    jsonQuestions.forEach((k, v) {
      Question q = Question(
          QuestionID: int.parse(v['QuestionID']),
          question: v['Question'],
          inputType: v['inputType'],
          validation: v['validation'],
          enabled: v['enabled'],
          order: v['order']);
      questionList.add(q);
    });
    return questionList;
  }


  static List<SessionAttendance> parseVolunteerSessionAttendanceJson(String volunteerSessionAttendanceBody) {

    List<SessionAttendance> sessionsList = [];

    var jsonDecoded = jsonDecode(volunteerSessionAttendanceBody);
    var sessionsObjects = jsonDecoded['sessions'];

    if (sessionsObjects is List) {
      return sessionsList;
    }

    var sessionsMap = sessionsObjects as Map;

    for (final session in sessionsMap.keys) {
      sessionsList.add(SessionAttendance.fromJson(sessionsMap[session]));
    }

    return sessionsList;
  }

  static String? toStringNullSafe(dynamic val) {
    if (val == null) {
      return null;
    }

    if (val is int) {
      return val.toString();
    } else if (val is bool) {
      return val.toString();
    } else {
      return val.toString();
    }
  }

  static dynamic tryJsonDecode(String source, dynamic defaultValue) {
    try {
      var decodedJSON = json.decode(source) as Map<String, dynamic>;
      return decodedJSON;
    } on FormatException {
      return defaultValue;
    }
  }

  static TimeOfDay? toTimeOfDay(dynamic jsonVal) {
    var str = toStringNullSafe(jsonVal);

    if (str == null) {
      return null;
    }

    var split = str.split(":");
    var hour = int.tryParse(split[0]);
    var min = int.tryParse(split[1]);

    if (hour == null || min == null) {
      return null;
    }

    return TimeOfDay(hour: hour, minute: min);
  }

  static Duration? toDuration(dynamic jsonVal) {
    var str = toStringNullSafe(jsonVal);

    if (str == null) {
      return null;
    }

    var split = str.split(":");
    var hour = int.tryParse(split[0]);
    var min = int.tryParse(split[1]);

    if (hour == null || min == null) {
      return null;
    }

    return Duration(hours: hour, minutes: min);
  }

  static DateTime? toDateTime(dynamic jsonVal) {
    var str = toStringNullSafe(jsonVal);

    return str != null ? DateTime.tryParse(str) : null;
  }

  static int? toInt(dynamic jsonVal) {
    var str = toStringNullSafe(jsonVal);

    return str != null ? int.tryParse(str) : null;
  }

  static bool? toBool(dynamic jsonVal) {
    var str = toStringNullSafe(jsonVal);

    return str != null ? (str == "1" || str == "true" ? true : false) : null;
  }

  static List<String>? toStringList(dynamic jsonVal) {
    var str = toStringNullSafe(jsonVal);
    return str?.split("|");
  }

  static Session? parseCreateSessionJson(String sessionBody) {
    var decodedJson = tryJsonDecode(sessionBody, null);
    return decodedJson != null ? Session.fromJson(decodedJson) : null;
  }

  static Participant? parseAddSessionParticipantJson(String participantBody) {
    var decodedJson = tryJsonDecode(participantBody, null);
    return decodedJson != null ? Participant.fromJson(decodedJson) : null;
  }

  static Staff? parseAddSessionStaffJson(String staffBody) {
    var decodedJson = tryJsonDecode(staffBody, null);
    return decodedJson != null ? Staff.fromJson(decodedJson) : null;
  }

  static Note? parseAddSessionNotesJson(String notesBody) {
    var decodedJson = tryJsonDecode(notesBody, null);
    return decodedJson != null ? Note.fromJson(decodedJson) : null;
  }
}

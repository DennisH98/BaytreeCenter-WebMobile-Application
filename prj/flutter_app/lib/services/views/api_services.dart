import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_app/models/note.dart';
import 'package:flutter_app/models/participant.dart';
import 'package:flutter_app/models/session.dart';
import 'package:flutter_app/models/staff.dart';
import 'package:flutter_app/utils/request_builder.dart';
import 'package:flutter_app/utils/response_parser.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

var username = dotenv.env['username'];
var password = dotenv.env['password'];

class ViewsAPIRequester {

  static const Map<String, String> defaultHeaders = {
    "content-type": "text/xml",
    "accept": "application/json",
    "connection": "keep-alive"
  };

  static final Map<String, String> authHeaders = {
      'authorization': ('Basic ' + base64Encode(utf8.encode('$username:$password')))
  };

  static const _defaultRequestRetries = 3;
  static const _requestRetryDelayInMilliseconds = 1000;

  static Future<http.Response> getViewsAPI(String url,
      {int retries = _defaultRequestRetries}) async {
    Map<String, String> headers = {};
    headers.addAll(authHeaders);
    headers.addAll(defaultHeaders);

    late http.Response response;

    try {
      response = await http.get(Uri.parse(url), headers: headers);

      if (response.statusCode == 200 || response.statusCode == 501) {
        return response;
      } else {
        throw Exception('Bad response from Views API');
      }
    } catch (e) {
      if (retries == 0) {
        throw Exception("Failed to receive response to HTTP Request");
      } else {
        return Future.delayed(
            const Duration(milliseconds: _requestRetryDelayInMilliseconds), () {
          return getViewsAPI(url, retries: retries - 1);
        });
      }
    }
  }

  static Future<http.Response> postViewsAPI(
      String url,
      String? body,
      {int retries = _defaultRequestRetries
      }) async {

    Map<String, String> headers = {};
    headers.addAll(authHeaders);
    headers.addAll(defaultHeaders);

    late http.Response response;

    try {
      response = await http.post(Uri.parse(url), headers: headers,
          body: body == null ? null : utf8.encode(body));

      if (response.statusCode == 200 || response.statusCode == 501) {
        return response;
      } else {
        throw Exception('Bad response from Views API');
      }
    } catch (e) {
      if (retries == 0) {
        throw Exception("Failed to receive response to HTTP Request");
      } else {
        return Future.delayed(const Duration(milliseconds: _requestRetryDelayInMilliseconds), () {
          return postViewsAPI(url, body, retries: retries - 1);
        });
      }
    }
  }

  static Future<http.Response> putViewsAPI(
      String url,
      String? body,
      {int retries = _defaultRequestRetries
      }) async {

    Map<String, String> headers = {};
    headers.addAll(authHeaders);
    headers.addAll(defaultHeaders);

    late http.Response response;

    try {
      response = await http.put(Uri.parse(url), headers: headers,
          body: body == null ? null : utf8.encode(body));

      if (response.statusCode == 200 || response.statusCode == 501) {
        return response;
      } else {
        throw Exception('Bad response from Views API');
      }
    } catch (e) {
      if (retries == 0) {
        throw Exception("Failed to receive response to HTTP Request");
      } else {
        return Future.delayed(const Duration(milliseconds: _requestRetryDelayInMilliseconds), () {
          return putViewsAPI(url, body, retries: retries - 1);
        });
      }
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

  static Future<Session?> createSession(
    {
      required int sessionGroupId,       // 3
      required String sessionType,       // Individual
      required String name,              // Mentor testing session
      required DateTime startDateTime,
      required Duration duration,        // 02:00
      required bool cancelled,            // 0
      required List<String> activities,          // Youth mentoring (must exist in activity list)
      required int leadStaff,            // 1
      required int venueId,              // 2
      required int restrictedRecord,     // 0  
      required String contactType,       // Individual
    }
  ) async {
    var url = fetchSessionGroupSessionsUrl(sessionGroupId);

    var body = RequestBodyBuilder.buildCreateSessionXMLBody(
      Session(
        sessionGroupID: sessionGroupId,
        sessionType: sessionType,
        name: name,
        startDate: startDateTime,
        startTime: TimeOfDay(hour: startDateTime.hour,
          minute: startDateTime.minute),
        duration: duration,
        cancelled: cancelled,
        activities: activities,
        leadStaff: leadStaff,
        venueID: venueId,
        restrictedRecord: restrictedRecord,
        contactType: contactType
      )
    );

    var res = await postViewsAPI(url, body);
    
    return ResponseParser.parseCreateSessionJson(res.body);
  }

  static Future<Participant?> addSessionParticipant({
    required int sessionId,
    required int contactId,
    required bool attended
  }) async {
    var url = fetchSessionParticipantsUrl(sessionId);

    var body = RequestBodyBuilder.buildAddSessionParticipantXMLBody(
      contactID: contactId, attended: attended
    );

    var res = await putViewsAPI(url, body);

    return ResponseParser.parseAddSessionParticipantJson(res.body);
  }

  static Future<Staff?> addSessionStaff({
    required int sessionId,              // 13
    required int contactId,              // 2 (personId of staff)
    required bool attended,               
    String? role = "",         // Lead (OR Assistant)
    String? volunteering = ""  // Mentored|Volunteered|Made Coffee (OR Mentored)
  }) async {
    var url = fetchSessionStaffUrl(sessionId);

    var body = RequestBodyBuilder.buildAddSessionStaffXMLBody(
      contactID: contactId,
      attended: attended
    );

    var res = await putViewsAPI(url, body);
    
    return ResponseParser.parseAddSessionStaffJson(res.body);
  }

  static Future<Note?> addSessionNotes({
    required int sessionId,
    required String notes
  }) async {
    var url = fetchSessionNotesUrl(sessionId);

    var body = '''
        <note>
            <Note>$notes</Note>
        </note>
    ''';

    var res = await postViewsAPI(url, body);

    return ResponseParser.parseAddSessionNotesJson(res.body);
  }

  static Future<http.Response> fetchMenteeInfo(int id) {
    // mentees are participants
    String url = 'https://app.viewsapp.net/api/restful/contacts/participants/' + id.toString();
    return getViewsAPI(url);
  }

  static Future<http.Response> fetchMentorInfo(int id) {
    // mentors are volunteers, volunteers are a subset of staff
    String url = 'https://app.viewsapp.net/api/restful/contacts/staff/' + id.toString();
    return getViewsAPI(url);
  }

  static String fetchQuestionnaireUrl(int id) {
    String url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/' +
        id.toString();
    return url;
  }

  static String sendAnswersUrl(int id) {
    String url = 'https://app.viewsapp.net/api/restful/evidence/questionnaires/' +
        id.toString() + '/answers';
    return url;
  }

  static String fetchParticipantsUrl(int id) {
    String url = 'https://app.viewsapp.net/api/restful/contacts/participants/' +
        id.toString();
    return url;
  }

  static String fetchVolunteerSessionAttendanceUrl({required int volunteerID}) {
    String url = "https://app.viewsapp.net/api/restful/contacts/volunteers/" + volunteerID.toString() + "/sessions?";
    return url;
  }

  static String fetchSessionInformationUrl({required int sessionID}) {
    String url = "https://app.viewsapp.net/api/restful/work/sessiongroups/sessions/" + sessionID.toString();
    return url;
  }

  static String fetchCreateSessionUrl({required int sessionGroupID}) {
    String url = "https://app.viewsapp.net/api/restful/work/sessiongroups/" + sessionGroupID.toString() + "/sessions";
    return url;
  }

  static String fetchSessionGroupSessionsUrl(int sessionGroupId) {
    String url = "https://app.viewsapp.net/api/restful/work/sessiongroups/$sessionGroupId/sessions";
    return url; 
  }

  static String fetchSessionNotesUrl(int sessionId) {
    String url = "https://app.viewsapp.net/api/restful/work/sessiongroups/sessions/$sessionId/notes";
    return url; 
  }

  static String fetchSessionParticipantsUrl(int sessionId) {
    String url = "https://app.viewsapp.net/api/restful/work/sessiongroups/sessions/$sessionId/participants";
    return url; 
  }

  static String fetchSessionStaffUrl(int sessionId) {
    String url = "https://app.viewsapp.net/api/restful/work/sessiongroups/sessions/$sessionId/staff";
    return url; 
  }
}

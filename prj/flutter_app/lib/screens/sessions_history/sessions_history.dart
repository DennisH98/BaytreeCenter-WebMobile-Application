import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/models/session_attendance.dart';
import 'package:flutter_app/services/views/api_services.dart';
import 'package:flutter_app/utils/response_parser.dart';
import 'package:intl/intl.dart';
import 'session_details_form.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';

class SessionsHistory extends StatefulWidget {
  const SessionsHistory({Key? key}) : super(key: key);

  @override
  _SessionsHistoryState createState() => _SessionsHistoryState();
}

class _SessionsHistoryState extends State<SessionsHistory> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        title: "Sessions History",
      ),
      drawer: const SideBar(),
      body: FutureBuilder(
        future: _fetchVolunteerSessionsAttendance(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Center(
              child: Text("Unable to get sessions. Please try again later"),
            );
          } else if (snapshot.hasData) {
            return _buildSessionsHistory(
                snapshot.data as List<SessionAttendance>);
          } else {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
        },
      ),
    );
  }

  Future<List<SessionAttendance>?> _fetchVolunteerSessionsAttendance() async {
    // TODO: Get real volunteer ID from user account to send to API instead of harcoded 6
    String volunteerSessionAttendanceUrl =
        ViewsAPIRequester.fetchVolunteerSessionAttendanceUrl(volunteerID: 6);

    http.Response volunteerSessionAttendanceResponse;
    try {
      volunteerSessionAttendanceResponse =
          await ViewsAPIRequester.getViewsAPI(volunteerSessionAttendanceUrl);
    } on Exception {
      return null;
    }

    return ResponseParser.parseVolunteerSessionAttendanceJson(
        volunteerSessionAttendanceResponse.body);
  }

  Widget _buildSessionsHistory(List<SessionAttendance> _sessionsHistory) {
    if (_sessionsHistory.isEmpty) {
      return const Center(
        child: Text('You do not have any previous sessions'),
      );
    } else {
      return ListView.separated(
        padding: const EdgeInsets.all(16.0),
        itemCount: _sessionsHistory.length,
        itemBuilder: (context, i) => _buildRow(_sessionsHistory[i]),
        separatorBuilder: (BuildContext context, int index) => const Divider(),
      );
    }
  }

  Widget _buildRow(SessionAttendance session) {
    return Card(
      child: ListTile(
        leading: session.attended
            ? const Icon(
                Icons.check_circle_outline_sharp,
                color: Colors.green,
              )
            : const Icon(
                Icons.do_not_disturb_alt,
                color: Colors.red,
              ),
        title: Text(session.title),
        subtitle: Text(
            'Start Date: ${DateFormat.MMMM().format(session.startDate)} ${session.startDate.day}, ${session.startDate.year}\n'
            'Duration: ${session.duration.inMinutes} mins'),
        trailing: const Icon(Icons.edit),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) {
              return SessionDetailsForm(session.sessionID);
            }),
          );
        },
      ),
    );
  }
}

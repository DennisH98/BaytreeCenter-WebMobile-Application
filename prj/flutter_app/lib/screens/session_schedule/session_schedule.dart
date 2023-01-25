import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/screens/session_schedule/edit_schedule.dart';
import 'package:flutter_app/services/backend/api_services.dart';
import 'package:flutter_app/services/backend/endpoints.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_app/utils/storage_keys.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';
import 'package:flutter_app/models/session_schedule.dart';

class SessionsSchedules extends StatefulWidget {
  const SessionsSchedules({Key? key}) : super(key: key);

  @override
  _SessionsSchedulesState createState() => _SessionsSchedulesState();
}

class _SessionsSchedulesState extends State<SessionsSchedules> {
  @override
  void initState() {
    super.initState();
  }

  void updateSessionsPage() {
    setState(() {});
  }

  late List<SessionsSchedule> allSchedules;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        title: "Sessions Schedule",
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          showDialog(
              context: context,
              builder: (context) => EditSchedule(
                    title: "Add New Schedule",
                    submitText: "Add",
                    sessionsCallbackFunction: updateSessionsPage,
                  ));
        },
      ),
      drawer: const SideBar(),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          FutureBuilder(
            future: _fetchVolunteerSessionsSchedules(),
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return const Center(
                  child:
                      Text("Unable to get schedules. Please try again later"),
                );
              } else if (snapshot.hasData) {
                return _buildSessionsSchedules(
                    snapshot.data as List<SessionsSchedule>);
              } else {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }
            },
          ),
        ],
      ),
    );
  }

  Future<List<SessionsSchedule>?> _fetchVolunteerSessionsSchedules() async {
    late String viewsID;
    await SecureStorage.getValue(StorageKeys.viewsMentorId).then((value) {
      viewsID = value!;
    });
    try {
      http.Response schedulesResponse = await BackendAPIRequester.getRequest(
          endpoint: Endpoints.SCHEDULES, parameters: viewsID);
      allSchedules = SessionsSchedule.jsonToSchedulesList(jsonResponseBody: schedulesResponse.body);
      return allSchedules;
    } on Exception {
      return null;
    }
  }

  Widget _buildSessionsSchedules(List<SessionsSchedule> _sessionsSchedules) {
    if (_sessionsSchedules.isEmpty) {
      return const Center(
        child: Text('You do not have any previous sessions schedules'),
      );
    } else {
      return Expanded(
          child: ListView.separated(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        padding: const EdgeInsets.all(16.0),
        itemCount: _sessionsSchedules.length,
        itemBuilder: (context, i) => _buildRow(_sessionsSchedules[i]),
        separatorBuilder: (BuildContext context, int index) => const Divider(),
      ));
    }
  }

  Widget _buildRow(SessionsSchedule sessionsSchedule) {
    return Card(
        child: ListTile(
      title: Text(
          'Every ${DateFormat('EEEE').format(sessionsSchedule.startDate)}, ${DateFormat.jm().format(sessionsSchedule.startDate)}'),
      subtitle: Text(
          'Name: ${sessionsSchedule.mentee.fName + " " + sessionsSchedule.mentee.lName}'),
      onTap: () {
        showModalBottomSheet(
            backgroundColor: Colors.black12,
            context: context,
            builder: (context) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(40),
                      ),
                      onPressed: () async {
                        await showDialog(
                            context: context,
                            builder: (context) => EditSchedule(
                                  title: "Edit Schedule",
                                  submitText: "Save",
                                  schedule: sessionsSchedule,
                                  sessionsCallbackFunction: updateSessionsPage,
                                ));
                        Navigator.pop(context);
                      },
                      child: const Text("Edit")),
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(40),
                      ),
                      onPressed: () async {
                        await showDialog(
                                context: context,
                                builder: (context) => _confirmationDialog(
                                    sessionsSchedule.scheduleID!))
                            .then((value) => setState(() {}));
                        Navigator.pop(context);
                      },
                      child: const Text("Delete"))
                ],
              );
            });
      },
    ));
  }

  Widget _confirmationDialog(String scheduleID) {
    return AlertDialog(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(10.0)),
      ),
      title: const Text("Are you sure? This cannot be undone"),
      actions: [
        TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Cancel')),
        TextButton(
          onPressed: () async {
            try {
              await BackendAPIRequester.deleteRequest(
                  endpoint: Endpoints.SCHEDULES, parameters: scheduleID);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Deleted')),
              );
              Navigator.pop(context);
            } on Exception {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                    content:
                        Text('Something went wrong. Please try again later')),
              );
            }
          },
          child: const Text("Delete"),
        ),
      ],
    );
  }
}

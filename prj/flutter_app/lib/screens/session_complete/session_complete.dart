import 'package:flutter/material.dart';
import 'package:flutter_app/utils/session_activities_list.dart';
//import 'package:flutter_app/models/session.dart';
//import 'package:provider/provider.dart'; (see _onNotesTextFieldChanged)
import 'package:flutter_app/services/views/api_services.dart';

import 'package:flutter_app/utils/current_session.dart';
import 'package:intl/intl.dart';
import 'package:stop_watch_timer/stop_watch_timer.dart';

class SessionCompletePage extends StatefulWidget {
  const SessionCompletePage({Key? key}) : super(key: key);

  @override
  _SessionCompletePageState createState() => _SessionCompletePageState();
}

class _SessionCompletePageState extends State<SessionCompletePage> {
  void _onSessionResumed(BuildContext context) {
    Navigator.of(context).pop(false);
  }

  void _onSuccessDialogFinishButtonClick(BuildContext context) {
    Navigator.of(context).pop();
    Navigator.of(context).pop(true);
  }

  void _onFailureDialogOkButtonClick(BuildContext context) {
    Navigator.of(context).pop();
  }

  Future<bool> _createSession() async {
    var currentSession = CurrentSession.instance;

    if (currentSession.viewsSessionCreatedId == null) {
      var startTime = currentSession.startTime as DateTime;

      final DateFormat formatter = DateFormat('yyyy-MM-dd');
      final String startDateStr = formatter.format(startTime);

      var stopWatchMinuteTime =
          (currentSession.stopWatch as StopWatchTimer).minuteTime;
      var durationHours = (stopWatchMinuteTime.value ~/ 60);
      var durationMinutes = stopWatchMinuteTime.value - durationHours * 60;

      var res = await ViewsAPIRequester.createSession(
          sessionGroupId: 3,
          sessionType: "Individual",
          name: "Mentoring session",
          startDateTime: startTime,
          duration: Duration(minutes: durationMinutes, hours: durationHours),
          cancelled: false,
          activities: currentSession.activities,
          leadStaff: 1,
          venueId: 2,
          restrictedRecord: 0,
          contactType: "Individual");
      currentSession.viewsSessionCreatedId = res?.sessionID;
    }

    int sessionId = currentSession.viewsSessionCreatedId;

    if (!currentSession.viewsParticipantCreated) {
      await ViewsAPIRequester.addSessionParticipant(
          sessionId: sessionId, contactId: 4, attended: true);
      currentSession.viewsParticipantCreated = true;
    }

    if (!currentSession.viewsStaffCreated) {
      await ViewsAPIRequester.addSessionStaff(
          sessionId: sessionId,
          contactId: 2,
          attended: true,
          role: "Lead",
          volunteering: "Mentoring");
      currentSession.viewsStaffCreated = true;
    }

    if (!currentSession.viewsNotesCreated) {
      await ViewsAPIRequester.addSessionNotes(
          sessionId: sessionId, notes: currentSession.notes);
      currentSession.viewsNotesCreated = true;
    }

    return true;
  }

  void _onSessionFinished(BuildContext context) {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return Dialog(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
              elevation: 16,
              child: FutureBuilder(
                  future: _createSession(),
                  builder: (context, snapshot) {
                    const labelTextStyle = TextStyle(fontSize: 36.0);
                    if (snapshot.hasData) {
                      return Column(children: [
                        const Padding(
                            padding: EdgeInsets.all(8.0),
                            child: Text("Session successfully created!",
                                style: labelTextStyle)),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Row(
                            children: <Widget>[
                              Expanded(child: Container(), flex: 2),
                              Expanded(
                                  child: TextButton(
                                      style: ButtonStyle(
                                          backgroundColor:
                                              MaterialStateProperty.all(
                                                  Theme.of(context)
                                                      .colorScheme
                                                      .primary),
                                          foregroundColor:
                                              MaterialStateProperty.all(
                                                  Colors.black),
                                          padding: MaterialStateProperty.all(
                                              const EdgeInsets.all(24.0))),
                                      child: Column(children: const [
                                        Icon(Icons.check, size: 48.0),
                                        Text("Finish",
                                            style: TextStyle(fontSize: 28.0))
                                      ]),
                                      onPressed: () =>
                                          _onSuccessDialogFinishButtonClick(context)),
                                  flex: 6),
                              Expanded(child: Container(), flex: 2),
                            ],
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                          ),
                        )
                      ]);
                    } else if (snapshot.hasError) {
                      return Column(children: [
                        const Padding(
                            padding: EdgeInsets.all(8.0),
                            child: Text(
                                "Failed to create session. Please try again later.",
                                style: labelTextStyle)),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Row(
                            children: <Widget>[
                              Expanded(child: Container(), flex: 2),
                              Expanded(
                                  child: TextButton(
                                      style: ButtonStyle(
                                          backgroundColor:
                                              MaterialStateProperty.all(
                                                  Colors.grey[300]),
                                          foregroundColor:
                                              MaterialStateProperty.all(
                                                  Colors.black),
                                          padding: MaterialStateProperty.all(
                                              const EdgeInsets.all(24.0))),
                                      child: Column(children: const [
                                        Text("Ok",
                                            style: TextStyle(fontSize: 28.0))
                                      ]),
                                      onPressed: () =>
                                          _onFailureDialogOkButtonClick(
                                              context)),
                                  flex: 6),
                              Expanded(child: Container(), flex: 2),
                            ],
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                          ),
                        )
                      ]);
                    } else {
                      return Column(children: const [
                        Text("Creating session...", style: labelTextStyle),
                        CircularProgressIndicator()
                      ]);
                    }
                  }));
        });
  }

  @override
  Widget build(BuildContext context) {
    const widgetPadding = EdgeInsets.all(8.0);
    const dropdownPadding = EdgeInsets.symmetric(horizontal: 16.0);
    const activityListPadding = EdgeInsets.symmetric(horizontal: 12.0);

    const labelTextStyle = TextStyle(fontSize: 36.0);
    const notesLabel = Text("Notes:", style: labelTextStyle);

    const textfieldStyle = TextStyle(fontSize: 24.0);
    var textfieldDecoration = InputDecoration(
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(
              color: Theme.of(context).colorScheme.primary, width: 2.0),
        ),
        enabledBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.grey, width: 2.0),
        ),
        hintText: 'Enter session notes here...',
        hintMaxLines: 2);

    const notesTextFieldMinLines = 5;
    var notesTextField = TextFormField(
      initialValue: CurrentSession.instance.notes,
      style: textfieldStyle,
      decoration: textfieldDecoration,
      keyboardType: TextInputType.multiline,
      maxLines: null,
      minLines: notesTextFieldMinLines,
      onChanged: (String change) => CurrentSession.instance.notes = change,
    );

    var activityDropdown = DropdownButton(
      isExpanded: true,
      items: sessionActivitiesList.map<DropdownMenuItem<String>>((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value),
        );
      }).toList(),
      hint: const Text("Choose the session activities"),
      onChanged: (String? value) {
        if (value != null) {
          if (!CurrentSession.instance.activities.contains(value.toString())) {
            setState(() {
              CurrentSession.instance.activities.add(value.toString());
            });
          }
        }
      },
      menuMaxHeight: 300,
    );

    var activityList = Wrap(
      spacing: 15,
      children: <Chip>[
        ...CurrentSession.instance.activities.map((activity) {
          return Chip(
            label: Text(activity),
            onDeleted: () {
              setState(() {
                CurrentSession.instance.activities.removeWhere((activityToRemove) => activityToRemove == activity);
              });
            },
          );
        })
      ],
    );

    var resumeButton = TextButton(
        style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all(Colors.grey[300]),
            foregroundColor: MaterialStateProperty.all(Colors.black)),
        child: Column(children: const [
          Icon(Icons.play_arrow, size: 48.0),
          Text("Resume", style: TextStyle(fontSize: 28.0))
        ]),
        onPressed: () => _onSessionResumed(context));

    var finishButton = TextButton(
        style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all(
                Theme.of(context).colorScheme.primary),
            foregroundColor: MaterialStateProperty.all(Colors.black)),
        child: Column(children: const [
          Icon(Icons.check, size: 48.0),
          Text("Finish", style: TextStyle(fontSize: 28.0))
        ]),
        onPressed: () => _onSessionFinished(context));

    return Scaffold(
        appBar: AppBar(title: const Text("Session Complete!")),
        body: SingleChildScrollView(
            reverse: true,
            child: Column(
              children: <Widget>[
                const Padding(
                  padding: widgetPadding,
                  child: notesLabel,
                ),
                Padding(
                  padding: widgetPadding,
                  child: notesTextField,
                ),
                Padding(
                  padding: dropdownPadding,
                  child: activityDropdown,
                ),
                Padding(
                  padding: activityListPadding,
                  child: activityList,
                ),
                Padding(
                  padding: widgetPadding,
                  child: Row(
                    children: <Widget>[
                      Expanded(child: resumeButton, flex: 3),
                      Expanded(child: Container(), flex: 1),
                      Expanded(child: finishButton, flex: 3)
                    ],
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                  ),
                ),
              ],
              crossAxisAlignment: CrossAxisAlignment.start,
            )));
  }
}

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:stop_watch_timer/stop_watch_timer.dart';
import 'package:flutter_app/screens/session_complete/session_complete.dart';
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';
import 'package:flutter_app/screens/session_starter/cancel_session_dialog.dart';
import 'package:flutter_app/utils/current_session.dart';

class LiveSession extends StatefulWidget {
  const LiveSession({Key? key}) : super(key: key);

  @override
  _LiveSessionState createState() => _LiveSessionState();
}

class _LiveSessionState extends State<LiveSession> {
  final StopWatchTimer stopWatch = StopWatchTimer();
  final isHours = true;

  bool _sessionActive = false;

  @override
  dispose() {
    super.dispose();
    stopWatch.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        context: context,
        title: "Live Session",
      ),
      drawer: const SideBar(),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 2,
            child: Container(),
          ),
          Expanded(
              flex: 6,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: (_sessionActive)
                    ? <Widget>[
                        const Text(
                          "Session in Progress!",
                          style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 25.0),
                          child: StreamBuilder<int>(
                            stream: CurrentSession.instance.stopWatch.rawTime,
                            initialData: CurrentSession.instance.stopWatch.rawTime.value,
                            builder: (context, snapshot) {
                              final value = snapshot.data;
                              final displayTime = StopWatchTimer.getDisplayTime(value!, hours: isHours, milliSecond: false);
                              return Text(displayTime, style: const TextStyle(fontSize: 45.0));
                            },
                          ),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            SizedBox(
                                width: 175,
                                height: 50,
                                child: ElevatedButton(
                                  child: const Text("Cancel Session", style: TextStyle(fontSize: 17.5)),
                                  onPressed: () async {
                                    bool? cancelled = await showCancelSessionDialog(context);

                                    if (cancelled != null && cancelled) {
                                      CurrentSession.instance.resetSession();

                                      CurrentSession.instance.resetStopWatch();

                                      setState(() {
                                        _sessionActive = false;
                                      });
                                    }
                                  },
                                )),
                            const SizedBox(width: 15),
                            SizedBox(
                                width: 175,
                                height: 50,
                                child: ElevatedButton(
                                  child: const Text("Check Out", style: TextStyle(fontSize: 17.5)),
                                  onPressed: () async {
                                    CurrentSession.instance.pauseStopWatch();

                                    bool? complete = await Navigator.push(context, MaterialPageRoute(builder: (context) {
                                      return const SessionCompletePage();
                                    }));

                                    if (complete == true) {
                                      CurrentSession.instance.resetSession();

                                      CurrentSession.instance.resetStopWatch();

                                      setState(() {
                                        _sessionActive = false;
                                      });
                                    } else {
                                      CurrentSession.instance.startStopWatch();
                                    }
                                  },
                                )),
                          ],
                        )
                      ]
                    : <Widget>[
                        SizedBox(
                          width: 200,
                          height: 75,
                          child: ElevatedButton(
                            child: const Text("Check In", style: TextStyle(fontSize: 25.0)),
                            style: ButtonStyle(
                                shape: MaterialStateProperty.all<RoundedRectangleBorder>(RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30.0),
                              side: const BorderSide(color: Colors.green),
                            ))),
                            onPressed: () {
                              CurrentSession.instance.resetSession();

                              CurrentSession.instance.resetStopWatch();
                              CurrentSession.instance.startStopWatch();

                              setState(() {
                                _sessionActive = true;
                              });
                            },
                          ),
                        ),
                      ],
              )),
          Expanded(
            flex: 2,
            child: Container(),
          ),
        ],
      ),
      floatingActionButton: (_sessionActive)
          ? FloatingActionButton(
              child: const Icon(Icons.note_add_rounded),
              onPressed: () => _displayNotesPopup(context),
            )
          : Container(),
    );
  }

  Future<void> _displayNotesPopup(BuildContext context) async {
    return showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(10.0),
            ),
          ),
          title: const Text('Notes'),
          content: Builder(builder: (context) {
            var height = MediaQuery.of(context).size.height * 0.5;
            var width = MediaQuery.of(context).size.width;

            return Container(
                width: width,
                height: height,
                child: TextFormField(
                    initialValue: CurrentSession.instance.notes,
                    autofocus: true,
                    keyboardType: TextInputType.multiline,
                    maxLines: null,
                    onChanged: (value) {
                      CurrentSession.instance.notes = value;
                    },
                    decoration: InputDecoration(
                        fillColor: Colors.grey[200],
                        filled: true,
                        contentPadding: const EdgeInsets.symmetric(vertical: 40.0),
                        hintText: "Notes ... ")));
          }),
          actions: [
            TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Text('Close'))
          ],
        );
      },
    );
  }
}

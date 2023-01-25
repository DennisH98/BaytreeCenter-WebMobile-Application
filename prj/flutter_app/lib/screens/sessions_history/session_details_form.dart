import 'package:duration_picker/duration_picker.dart';
import 'package:flutter/material.dart';

import 'package:flutter_app/models/session.dart';
import 'package:flutter_app/utils/session_activities_list.dart';

class SessionDetailsForm extends StatefulWidget {
  const SessionDetailsForm(int sessionID, {Key? key}) : super(key: key);

  @override
  _SessionDetailsFormState createState() => _SessionDetailsFormState();
}

class _SessionDetailsFormState extends State<SessionDetailsForm> {

  final _formKey = GlobalKey<FormState>();
  late DateTime _newStartDate;
  late TimeOfDay _newStartTime;
  late Duration _newDuration;
  late bool _newCancelled;
  late List<String> _newActivities;

  /**
   * TODO: need to implement function to retrieve the specific session
   * from the API using the sessionID
   * The following is a sample session
   */

  final _session = Session(
      sessionID: 1,
      sessionGroupID: 2,
      sessionType: "Individual",
      name: "Session Name",
      startDate: DateTime(2021,3, 2),
      startTime: TimeOfDay(hour: 9, minute: 30),
      duration: Duration(days: 0, hours: 1, minutes: 10),
      cancelled: false,
      activities: ["Budgeting", "Drama"],
      leadStaff: 3,
      venueID: 4,
      created: DateTime(2021,3, 1),
      createdBy: "group.customer",
      updated: DateTime.now(),
      updatedBy: "group.me",
      restrictedRecord:5,
      contactType: "Individual",
      sessionKey: "Some-session-key",
      venueName: "Some venue name"
  );

  _SessionDetailsFormState() {
    _newStartDate = _session.startDate ?? DateTime(2021);
    _newStartTime = _session.startTime ?? TimeOfDay(hour: 7, minute: 55);
    _newDuration = _session.duration ?? Duration();
    _newCancelled = _session.cancelled ?? false;
    _newActivities = _session.activities ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Session'),
      ),
      body: Center(
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Text(_session.name ?? ""),
              InputDatePickerFormField(
                // Assuming the furthest back they can change dates to is a year ago
                firstDate: DateTime(DateTime.now().year - 1),
                lastDate: DateTime.now(),
                initialDate: _newStartDate,
                fieldLabelText: "Start Date",
                errorInvalidText: "Please select a valid date",
                onDateSaved: (newDate) {
                  setState(() {
                    _newStartDate = newDate;
                  });
                },
              ),
              Row(
                children: [
                  ElevatedButton(
                      onPressed: () async {
                        final TimeOfDay? resultingStartTime = await showTimePicker(
                          context: context,
                          initialTime: _newStartTime,
                        );
                        if (resultingStartTime != null) {
                          setState(() {
                            _newStartTime = resultingStartTime;
                          });
                        }
                      },
                      child: const Text('Select Start Time')
                  ),
                  Text(
                    'Selected Time: ${_newStartTime.format(context)}',
                  )
                ],
              ),
              Row(
                children: [
                  ElevatedButton(
                      onPressed: () async {
                        final Duration? resultingDuration = await showDurationPicker(
                          context: context,
                          initialTime: _newDuration,
                        );
                        if (resultingDuration != null) {
                          setState(() {
                            _newDuration = resultingDuration;
                          });
                        }
                      },
                      child: const Text('Select Duration')
                  ),
                  Text(
                    'Selected Duration: ' + _newDuration.inMinutes.toString() + 'mins',
                  )
                ],
              ),
              const Text("Cancelled"),
              Checkbox(
                value: _newCancelled,
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _newCancelled = value;
                    });
                  }
                },
              ),
              DropdownButtonFormField(
                decoration: const InputDecoration(
                  labelText: "Activities",
                    /**
                     * Need to make sure user selects their respective
                     * session group activity. E.g. Youth movement
                     */
                ),
                isExpanded: true,
                items: sessionActivitiesList.map((activity) {
                  return DropdownMenuItem(
                    value: activity,
                    child: Text(activity),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    if (!_newActivities.contains(value.toString())) {
                      setState(() {
                        _newActivities.add(value.toString());
                      });
                    }
                  }
                },
                validator: (activity) {
                  if (_newActivities.isEmpty) {
                    return "Please select at least one activity";
                  }
                  return null;
                },
              ),
              Row(
                children: <Chip>[
                  ..._newActivities.map((activity) {
                    return Chip(
                      label: Text(activity),
                      onDeleted: () {
                        setState(() {
                          _newActivities.removeWhere((activityToRemove) => activityToRemove == activity);
                        });
                      },
                    );
                  })
                ],
              ),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _session.startDate = _newStartDate;
                    _session.startTime = _newStartTime;
                    _session.duration = _newDuration;
                    _session.cancelled = _newCancelled;
                    _session.activities = _newActivities;

                    /**
                     * Call a function to save the data and
                     * then tell user it has been updated
                     */
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Updated Session')),
                    );
                  }
                },
                child: const Text('Update')
              )
            ],
          ),
        ),
      ),
    );
  }
}
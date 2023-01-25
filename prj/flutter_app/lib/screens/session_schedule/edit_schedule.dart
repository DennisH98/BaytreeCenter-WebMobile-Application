import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentee.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/models/session_schedule.dart';
import 'package:flutter_app/services/backend/api_services.dart';
import 'package:flutter_app/services/backend/endpoints.dart';
import 'package:flutter_app/utils/general.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_app/utils/storage_keys.dart';

class EditSchedule extends StatefulWidget {
  const EditSchedule({
    Key? key,
    this.schedule,
    required this.title,
    required this.submitText,
    required this.sessionsCallbackFunction,
  }) : super(key: key);

  final String title;
  final String submitText;
  final SessionsSchedule? schedule;
  final Function sessionsCallbackFunction;

  @override
  _EditScheduleState createState() => _EditScheduleState();
}

class _EditScheduleState extends State<EditSchedule> {
  List<Mentee> associatedMentees = MentorAccount.instance.menteeList;
  late int _selectedWeekday;
  late Mentee _selectedMentee;
  TimeOfDay _selectedTime = TimeOfDay.now();

  final _formKey = GlobalKey<FormState>();
  static const _WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  @override
  void initState() {
    super.initState();
    if (widget.schedule == null) {
      _selectedWeekday = 0;
      _selectedTime = TimeOfDay.now();
      _selectedMentee = associatedMentees[0];
    } else {
      _selectedWeekday = widget.schedule!.startDate.weekday % 7;
      _selectedTime = TimeOfDay.fromDateTime(widget.schedule!.startDate);
      _selectedMentee = widget.schedule!.mentee;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(10.0)),
      ),
      title: Text(widget.title, style: const TextStyle(fontSize: 30)),
      content: Builder(builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(5.0),
          child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                      padding: const EdgeInsets.only(bottom: 20.0),
                      child: DropdownButtonFormField<String>(
                        isExpanded: true,
                        value: _WEEKDAYS[_selectedWeekday],
                        items: _WEEKDAYS
                            .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Center(child: Text("Every " + value)),
                          );
                        }).toList(),
                        onChanged: (value) {
                          if (value != null) {
                            _selectedWeekday = _WEEKDAYS.indexOf(value);
                          }
                        },
                        validator: (weekday) {
                          if (weekday == null) {
                            return "You must select a week day";
                          }
                          return null;
                        },
                      )),
                  const Padding(
                      padding: EdgeInsets.only(bottom: 20.0),
                      child: Center(
                        child: Text("at", style: TextStyle(fontSize: 20)),
                      )),
                  Padding(
                      padding: const EdgeInsets.only(bottom: 20.0),
                      child: Center(
                        child: ElevatedButton(
                            onPressed: () async {
                              final TimeOfDay? resultingStartTime =
                                  await showTimePicker(
                                context: context,
                                initialTime: _selectedTime,
                              );
                              if (resultingStartTime != null) {
                                setState(() {
                                  _selectedTime = resultingStartTime;
                                });
                              }
                            },
                            child: Text(_selectedTime.format(context))),
                      )),
                  const Padding(
                    padding: EdgeInsets.only(bottom: 20.0),
                    child: Center(
                        child: Text("with", style: TextStyle(fontSize: 20))),
                  ),
                  DropdownButtonFormField<Mentee>(
                    isExpanded: true,
                    items: associatedMentees
                        .map<DropdownMenuItem<Mentee>>((Mentee mentee) {
                      return DropdownMenuItem<Mentee>(
                        value: mentee,
                        child: Center(
                            child: Text(mentee.fName + " " + mentee.lName)),
                      );
                    }).toList(),
                    onChanged: (selectedMentee) {
                      if (selectedMentee != null) {
                        _selectedMentee = selectedMentee;
                      }
                    },
                    validator: (mentee) {
                      if (mentee == null) {
                        return "You must select a mentee";
                      }
                      return null;
                    },
                  ),
                ],
              )),
        );
      }),
      actions: [
        TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Cancel')),
        TextButton(
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                // TODO: Get better way to determine add or edit
                String? scheduleID = widget.schedule == null
                    ? null
                    : widget.schedule!.scheduleID;

                final now = DateTime.now();
                final today = DateTime(now.year, now.month, now.day,
                    _selectedTime.hour, _selectedTime.minute);

                SessionsSchedule schedule = SessionsSchedule(
                    scheduleID: scheduleID,
                    startDate: today.next(_selectedWeekday),
                    mentee: _selectedMentee
                  );

                late String viewsID;
                await SecureStorage.getValue(StorageKeys.viewsMentorId).then((value) {
                  viewsID = value!;
                });

                try {
                  if (widget.schedule == null) {
                    BackendAPIRequester.postRequest(
                        endpoint: Endpoints.SCHEDULES,
                        parameters: viewsID,
                        objDataMap: schedule.toJson());
                  } else {
                    BackendAPIRequester.patchRequest(
                        endpoint: Endpoints.SCHEDULES,
                        parameters: widget.schedule!.scheduleID!,
                        objDataMap: schedule.toJson());
                  }
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Success")),
                  );

                  await widget.sessionsCallbackFunction();

                } on Exception catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                        content: Text('Something went wrong: ${e.toString()}')),
                  );
                }

                Navigator.pop(context);
              }
            },
            child: Text(widget.submitText))
      ],
    );
  }
}

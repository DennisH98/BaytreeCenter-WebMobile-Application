import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentee.dart';
import 'package:flutter_app/models/session_schedule.dart';
import 'package:collection/collection.dart';
import 'package:flutter_app/screens/session_schedule/session_schedule.dart';
import 'package:intl/intl.dart';

class DashboardSessionSchedule extends StatefulWidget {
  DashboardSessionSchedule({
    Key? key,
    required this.mentorSchedules,
    required this.selectedMentee,
  }) : super(key: key);

  List<SessionsSchedule> mentorSchedules;
  Mentee selectedMentee;

  @override
  _DashboardSessionScheduleState createState() =>
      _DashboardSessionScheduleState();
}

class _DashboardSessionScheduleState extends State<DashboardSessionSchedule> {
  SessionsSchedule? displaySchedule;

  @override
  void initState() {
    super.initState();
    displaySchedule = widget.mentorSchedules.firstWhereOrNull(
        (schedule) => schedule.mentee.viewsID == widget.selectedMentee.viewsID);
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SessionsSchedules()),
        );
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(Icons.calendar_today),
              const Padding(padding: EdgeInsets.only(right: 5)),
              const Text("Next Session: "),
              displaySchedule == null
                  ? const Text("Tap to set one up")
                  : Text(
                      "${DateFormat('EEEE').format(displaySchedule!.startDate)}, ${DateFormat.jm().format(displaySchedule!.startDate)}"),
            ],
          ),
          const Icon(Icons.arrow_forward_sharp)
        ],
      ),
    );
  }
}

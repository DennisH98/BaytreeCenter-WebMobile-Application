import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/screens/discussions_page/discussions_page.dart';
import 'package:flutter_app/screens/goals_history/goals_history.dart';
import 'package:flutter_app/screens/landing_page/landing_screen.dart';
import 'package:flutter_app/screens/questionnaire/questionnaire.dart';
import 'package:flutter_app/screens/retrospective_session/retrospective_session.dart';
import 'package:flutter_app/screens/sessions_history/sessions_history.dart';
import 'package:flutter_app/services/backend/mentor_service.dart';
import 'package:flutter_app/screens/dynamic_home_page/dynamic_home_page.dart';

import 'package:flutter_app/screens/session_schedule/session_schedule.dart';
import 'package:flutter_app/screens/resources-page/resources-page.dart';

class SideBar extends StatefulWidget {
  const SideBar({Key? key}) : super(key: key);

  @override
  State<SideBar> createState() => _SideBarState();
}

class _SideBarState extends State<SideBar> {
  @override
  Widget build(BuildContext context) {
    return Theme(
        data: Theme.of(context).copyWith(
          canvasColor: Colors.green[100],
        ),
        child: Drawer(
            child: ListView(children: <Widget>[
          SizedBox(
            height: 120.0,
            child: DrawerHeader(
              decoration: const BoxDecoration(
                color: Colors.lightGreen,
              ),
              //Places an image of baytree logo on the drawer header
              child: Image.asset('assets/images/baytree-logo.png'),
            ),
          ),
          ListTile(
            title: const Text("Home"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const LandingPage()),
              );
            },
          ),
          ListTile(
            title: const Text("Completed Goals"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const GoalsHistory()),
              );
            },
          ),
          ListTile(
            title: const Text("Create Session"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const RetrospectiveSession()),
              );
            },
          ),
          // ListTile(
          //   title: const Text("Create live session"),
          //   onTap: () {
          //     Navigator.push(
          //       context, MaterialPageRoute(builder: (context) => const LiveSession()),
          //     );
          //   },
          // ),
          ListTile(
            title: const Text("Session History"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const SessionsHistory()),
              );
            },
          ),
          ListTile(
            title: const Text("Sessions Schedules"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const SessionsSchedules()),
              );
            },
          ),
          ListTile(
            title: const Text("Questionnaire"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const Questionnaire_Form()),
              );
            },
          ),
          ListTile(
            title: const Text("Resources"),
            onTap: () {
              launchResources();
            },
          ),
          ListTile(
            title: const Text("Discussions"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const DiscussionsPage()),
              );
            },
          ),
          ListTile(
            title: const Text("Log Out"),
            onTap: () {
              MentorService.logout();
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(
                    builder: (context) => const DynamicHomePage()),
                (route) => false,
              );
            },
          ),
        ])));
  }
}

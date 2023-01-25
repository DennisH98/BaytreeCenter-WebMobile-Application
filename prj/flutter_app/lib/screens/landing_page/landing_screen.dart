import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/models/discussion.dart';
import 'package:flutter_app/models/goal.dart';
import 'package:flutter_app/models/mentee.dart';
import 'package:flutter_app/models/mentor.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/models/questionnaire.dart';
import 'package:flutter_app/models/session_schedule.dart';
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:flutter_app/screens/discussions_page/discussions_page.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';
import 'package:flutter_app/services/backend/discussion.dart';
import 'package:flutter_app/screens/questionnaire/questionnaire.dart';
import 'package:flutter_app/services/backend/mentor_service.dart';
import 'package:flutter_app/services/views/api_services.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_app/utils/storage_keys.dart';
import 'package:flutter_app/utils/storage_keys.dart';
import 'package:flutter_app/widgets/dashboard_schedules.dart';
import 'package:flutter_app/widgets/dashboard_widgets.dart';
import 'package:flutter_app/widgets/dashboard_statistics.dart';
import 'package:flutter_app/utils/response_parser.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({Key? key}) : super(key: key);

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  late Future<http.Response> dashboardData;
  late DiscussionResponse? latestDiscussion;

  void pageSetState() {
    setState(() {});
  }

  Future<void> asyncPageSetState() async {
    setState(() {
      _clearValues();
      dashboardData = _loadDashboard();
    });
  }

  @override
  void initState() {
    dashboardData = _loadDashboard();
    super.initState();
    Future.delayed(Duration.zero, () {
      FirebaseMessaging.onMessage.listen((event) {
        Navigator.popAndPushNamed(context, "/landing_screen");
      });
    });
  }

  // mentees assigned to user
  late List<Mentee> menteeList = [];
  late List<SessionsSchedule> mentorSchedules = [];

  // dashboard corresponds to selected mentee
  late int viewedMenteeIndex; // saved locally
  late String currentMenteeName;

  late List<Questionnaire> questionnaireList = [];

  void _clearValues() {
    menteeList = [];
    mentorSchedules = [];
    viewedMenteeIndex = -1;
    currentMenteeName = "";
    questionnaireList = [];
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: dashboardData,
      builder: (context, AsyncSnapshot<http.Response> snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }
        if (snapshot.hasError) {
          return const Center(
            child: Text("Unable to reach server.\nPlease try again later."),
          );
        } else {
          return Scaffold(
            drawer: const SideBar(),
            body: _buildDashboard(),
          );
        }
      },
    );
  }

  // get data from backend, returns json string
  Future<http.Response> _loadDashboard() async {
    http.Response response = await MentorService.getDashboardData();
    List<DiscussionResponse> discussionResponses =
        await DiscussionService.instance.getDiscussions(limit: 1, filters: {
      "sortCreatedAt": ["desc"]
    });

    if (discussionResponses.isNotEmpty) {
      setState(() {
        latestDiscussion = discussionResponses[0];
      });
    }

    try {
      var decodedData = json.decode(response.body);

      // parallel async
      await Future.wait([
        parseMentor(response.body),
        parseMentees(decodedData["mentees"]),
        parseSchedules(decodedData["schedules"]),
        parseGoals(response.body),
        parseAssignedQuestionnaires(response.body)
      ]); //todo: handle null cases

    } catch (e) {
      print(e);
    }

    MentorAccount.instance.refreshDashboard = asyncPageSetState;

    return response;
  }

  Widget _buildDashboard() {
    double topHeight = 0.0;

    if (viewedMenteeIndex >= menteeList.length) {
      viewedMenteeIndex = 0;
      SecureStorage.setValue(
          StorageKeys.viewedMenteeIndex, viewedMenteeIndex.toString());
    }

    Mentee selectedMentee = menteeList[viewedMenteeIndex];
    String currentMenteeFirstName = selectedMentee.fName;
    currentMenteeName = selectedMentee.fName + " " + selectedMentee.lName;
    SecureStorage.setValue(StorageKeys.currentMenteeName, currentMenteeName);

    return Padding(
        padding: const EdgeInsets.all(4),
        child: RefreshIndicator(
            onRefresh: asyncPageSetState,
            child: CustomScrollView(
              slivers: [
                CustomSliverAppBar(
                  top: topHeight,
                  key: UniqueKey(),
                  context: context,
                ),
                SliverList(
                  delegate: SliverChildListDelegate(
                    [
                      sliverChild(
                        widget: InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const DiscussionsPage()),
                              );
                            },
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                    child: Row(
                                  children: [
                                    Flexible(
                                        flex: 0, child: Icon(Icons.message)),
                                    Flexible(
                                        flex: 0,
                                        child: Padding(
                                            padding:
                                                EdgeInsets.only(right: 5))),
                                    Flexible(
                                        flex: 0,
                                        child: Text("New Message:",
                                            style: TextStyle(
                                                fontWeight: FontWeight.bold))),
                                    Flexible(
                                        flex: 0,
                                        child: Padding(
                                            padding:
                                                EdgeInsets.only(right: 5))),
                                    latestDiscussion != null
                                        ? Flexible(
                                            flex: 1,
                                            child: Container(
                                                child: Text(
                                              latestDiscussion!.title,
                                              overflow: TextOverflow.ellipsis,
                                            )))
                                        : Container()
                                  ],
                                )),
                                Flexible(
                                    flex: 0,
                                    child:
                                        const Icon(Icons.arrow_forward_sharp))
                              ],
                            )),
                      ),
                      menteeSelector(currentMenteeFirstName),
                      sliverChild(
                          widget: DashboardSessionSchedule(
                              mentorSchedules: mentorSchedules,
                              selectedMentee: selectedMentee),
                          widgetColor: Colors.pink[100]!),
                      for (int i
                          in MentorAccount.instance.assignedQuestionnairesIds)
                        (() {
                          String currMonth =
                              DateFormat.yM().format(DateTime.now());
                          bool exists = false;
                          String name = "Questionnaire ID: $i";
                          for (Questionnaire q in questionnaireList) {
                            if (i == q.id) {
                              name = q.name;
                              String lastSubmit =
                                  DateFormat.yM().format(q.lastSubmit);
                              if (currMonth == lastSubmit) {
                                // already submitted for last month
                                exists = true;
                                return const SizedBox.shrink();
                              }
                            }
                          }
                          if (exists == false) {
                            return sliverChild(
                                widget:
                                    questionnaireRemainder(context, i, name),
                                widgetColor: Colors.white);
                          }
                          throw Exception("questionnaire remainder error");
                        }())
                    ],
                  ),
                ),
                SliverGrid.count(
                  crossAxisCount: 2,
                  childAspectRatio: 2,
                  children: [
                    // sliverChild(widget: const Text("remainingSessionsCell")),
                    // sliverChild(widget: const Text("attendanceCell")),
                  ],
                ),
                SliverList(
                  delegate: SliverChildListDelegate(
                    [
                      Padding(
                        padding: const EdgeInsets.all(10.0),
                        child: Column(
                          children: [
                            const Text("Your Session Stats"),
                            SizedBox(
                                height: 150,
                                child: MentorSessionStats.withSampleData())
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                SliverGrid.count(
                    crossAxisCount: 3, children: goalsWidgetsBuilder()),
              ],
            )));
  }

  List<Widget> goalsWidgetsBuilder() {
    List<Widget> goalsWidgetList = [];
    for (int i = 0; i < MentorAccount.instance.goalsList.length; i++) {
      if (MentorAccount.instance.goalsList[i].menteeId ==
          menteeList[viewedMenteeIndex].viewsID) {
        // filters out finished goals
        if (MentorAccount.instance.goalsList[i].curr == "false" ||
            (double.tryParse(MentorAccount.instance.goalsList[i].curr) !=
                double.tryParse(MentorAccount.instance.goalsList[i].end))) {
          goalsWidgetList.add(GoalCell(
              goal: MentorAccount.instance.goalsList[i], context: context));
        }
      }
    }
    goalsWidgetList.add(NewGoalBtn(
      menteeId: menteeList[viewedMenteeIndex].viewsID,
      goalsList: MentorAccount.instance.goalsList,
      context: context,
      setStateCallback: pageSetState,
    ));
    return goalsWidgetList;
  }

  Widget menteeSelector(String currentMentee) {
    return Padding(
        padding: const EdgeInsets.all(4),
        child: Container(
            color: Colors.green,
            height: 50,
            child: Padding(
                padding: const EdgeInsets.only(left: 10, right: 10),
                child: Column(children: [
                  Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                            "Dashboard for: $currentMenteeName (ID: ${menteeList[viewedMenteeIndex].viewsID.toString()})"),
                        DropdownButton(
                          value: currentMentee,
                          icon: const Icon(Icons.arrow_downward),
                          iconSize: 24,
                          elevation: 16,
                          style: const TextStyle(color: Colors.brown),
                          underline: Container(
                            height: 2,
                            color: Colors.lightGreen,
                          ),
                          onChanged: (String? newValue) {
                            setState(() {
                              for (int i = 0; i < menteeList.length; i++) {
                                if (menteeList[i].fName == newValue) {
                                  currentMentee = menteeList[i].fName;
                                  viewedMenteeIndex = i;
                                  MentorAccount.instance.viewedMenteeIndex = i;
                                  SecureStorage.setValue(
                                      StorageKeys.viewedMenteeIndex,
                                      i.toString());
                                }
                              }
                            });
                          },
                          items: menteeList
                              .map<DropdownMenuItem<String>>((Mentee mentee) {
                            return DropdownMenuItem<String>(
                              value: mentee.fName,
                              child: Text(mentee.fName),
                            );
                          }).toList(),
                        )
                      ])
                ]))));
  }

  Future<void> parseMentor(String dataJson) async {
    try {
      Mentor mentor = ResponseParser.parseMentorInfo(dataJson);
      MentorAccount.instance.mentor = mentor;
      // not used here but will be used in other pages
    } catch (e) {
      print('parse mentor error');
      print(e);
    }
  }

  Future<void> parseMentees(List<dynamic> menteesData) async {
    await loadLastViewedMentee();
    menteeList =
        Mentee.jsonMenteeListToMenteeList(jsonMenteesList: menteesData);
    MentorAccount.instance.menteeList = menteeList;
  }

  Future<void> loadLastViewedMentee() async {
    try {
      String? lastViewMentee =
          await SecureStorage.getValue(StorageKeys.viewedMenteeIndex);
      viewedMenteeIndex = int.parse(lastViewMentee!);
    } catch (e) {
      // if problem loading, just default to 1st mentee
      print("viewedMenteeIndex defaulting to 0");
      viewedMenteeIndex = 0;
    }
    MentorAccount.instance.viewedMenteeIndex = viewedMenteeIndex;
  }

  Future<void> parseSchedules(List<dynamic> schedulesData) async {
    List<SessionsSchedule> schedules =
        SessionsSchedule.listDynamicObjectsToSchedulesList(
            dynamicSchedules: schedulesData);
    schedules.sort();
    mentorSchedules = schedules;
    MentorAccount.instance.schedules = mentorSchedules;
  }

  Future<void> parseGoals(String dataJson) async {
    MentorAccount.instance.goalsList = ResponseParser.parseGoals(dataJson);
  }

  Future<void> parseAssignedQuestionnaires(String dataJson) async {
    List<int> availQuestionnaires =
        ResponseParser.parseAvailableQuestionnaireIds(dataJson); // [5,21]
    MentorAccount.instance.assignedQuestionnairesIds = availQuestionnaires;

    String? listJson =
        await SecureStorage.getValue(StorageKeys.assignedQuestionnaires);
    List<dynamic> parseList = [];
    List<Questionnaire> questList = [];
    try {
      parseList = jsonDecode(listJson!);
    } catch (e) {
      print(e);
    }
    for (var i in parseList) {
      questList.add(Questionnaire(
          id: i['id'],
          name: i['name'],
          lastSubmit: DateTime.parse(i['lastSubmit'])));
    }
    questionnaireList = questList;
  }
}

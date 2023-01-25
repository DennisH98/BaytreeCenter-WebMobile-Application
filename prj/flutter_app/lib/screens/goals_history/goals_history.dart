import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/models/goal.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';
import 'package:flutter_app/widgets/dashboard_widgets.dart';
import 'package:intl/intl.dart';

class GoalsHistory extends StatefulWidget {
  const GoalsHistory({Key? key}) : super(key: key);

  @override
  _GoalsHistoryState createState() => _GoalsHistoryState();
}

class _GoalsHistoryState extends State<GoalsHistory> {
  Future<void> asyncPageSetState() async {
    await Future.delayed(const Duration(seconds: 1));
    MentorAccount.instance.refreshDashboard();
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: CustomAppBar(
          context: context,
          title: "Goals History",
        ),
        drawer: const SideBar(),
        body: _buildPage());
  }

  Widget _buildPage() {
    return Column(children: [
      Container(
          height: 30,
          color: Colors.lightGreen[200],
          child: Row(
            children: const [
              Spacer(flex: 3),
              Text("Goal"),
              Spacer(flex: 6),
              Text("Description"),
              Spacer(flex: 3),
              Text("Start-Duration-End"),
              Spacer()
            ],
          )),
      Expanded(
          child: RefreshIndicator(
              onRefresh: asyncPageSetState,
              child: ListView.builder(
                itemCount: 5, //week, month, 4 month, 1 year, all time
                itemBuilder: (context, index) {
                  return _sectionBuilder(index);
                },
              )))
    ]);
  }

  Widget _sectionBuilder(index) {
    return Padding(
        padding: const EdgeInsets.all(4),
        child: CustomScrollView(
          shrinkWrap: true,
          physics: const ClampingScrollPhysics(),
          slivers: [
            SliverList(
              delegate: SliverChildListDelegate(
                [_timeRangeText(index)],
              ),
            ),
            (() {
              if (true) {
                //todo: dont render slivergrid if builder is empty
                return SliverGrid.count(
                    crossAxisCount: 3, children: _buildGoalGrids(index));
              }
            }()),
          ],
        ));
  }

  Widget _timeRangeText(index) {
    String title;
    switch (index) {
      case 0:
        title = "Last 7 Days";
        break;
      case 1:
        title = "Last 30 Days";
        break;
      case 2:
        title = "Last 4 Months";
        break;
      case 3:
        title = "Last Year";
        break;
      case 4:
        title = "All Time";
        break;
      default:
        throw Exception("_timeRangeText switch index error");
    }
    return Padding(
        padding: const EdgeInsets.only(left: 5, top: 10, bottom: 10),
        child:
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold)));
  }

  List<Widget> _buildGoalGrids(int index) {
    DateTime startRange;
    DateTime endRange;
    switch (index) {
      case 0:
        endRange = DateTime.now();
        startRange = DateTime.now().subtract(const Duration(days: 7));
        break;
      case 1:
        endRange = DateTime.now().subtract(const Duration(days: 7));
        startRange = DateTime.now().subtract(const Duration(days: 30));
        break;
      case 2:
        endRange = DateTime.now().subtract(const Duration(days: 30));
        startRange = DateTime.now().subtract(const Duration(days: 120));
        break;
      case 3:
        endRange = DateTime.now().subtract(const Duration(days: 120));
        startRange = DateTime.now().subtract(const Duration(days: 365));
        break;
      case 4:
        endRange = DateTime.now().subtract(const Duration(days: 365));
        startRange = DateTime(2000);
        break;
      default:
        throw Exception("_buildGoalGrids switch index error");
    }
    return goalsWidgetsBuilder(startRange, endRange);
  }

  goalsWidgetsBuilder(DateTime startRange, DateTime endRange) {
    List<Widget> goalsWidgetList = [];
    for (int i = 0; i < MentorAccount.instance.goalsList.length; i++) {
      if (MentorAccount.instance.goalsList[i].menteeId ==
          MentorAccount.instance
              .menteeList[MentorAccount.instance.viewedMenteeIndex].viewsID) {
        // filter completed only
        if (MentorAccount.instance.goalsList[i].curr == "true" ||
            (double.tryParse(MentorAccount.instance.goalsList[i].curr) ==
                double.tryParse(MentorAccount.instance.goalsList[i].end))) {
          // filter within time range
          if (MentorAccount.instance.goalsList[i].endDate.isBefore(endRange) &&
              MentorAccount.instance.goalsList[i].endDate.isAfter(startRange)) {
            goalsWidgetList.add(GoalCell(
              goal: MentorAccount.instance.goalsList[i],
              context: context,
            ));

            goalsWidgetList
                .add(goalDescription(MentorAccount.instance.goalsList[i]));

            goalsWidgetList
                .add(goalTimeTaken(MentorAccount.instance.goalsList[i]));
          }
        }
      }
    }
    return goalsWidgetList;
  }

  Widget goalTimeTaken(Goal goal) {
    return Padding(
        padding: const EdgeInsets.only(left: 6),
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Row(children: [
                Text(DateFormat('yMMMd').format(goal.startDate),
                    style: const TextStyle(fontSize: 14)),
                const Spacer(flex: 2)
              ]),
              const Text("⬇", style: TextStyle(fontSize: 14)),
              Row(children: [
                const Spacer(),
                Text(
                    "${(goal.endDate.difference(goal.startDate).inHours / 24).round()} days",
                    style: const TextStyle(fontSize: 14)),
                const Spacer()
              ]),
              const Text("⬇", style: TextStyle(fontSize: 14)),
              Row(children: [
                const Spacer(flex: 2),
                Text(DateFormat('yMMMd').format(goal.endDate),
                    style: const TextStyle(fontSize: 14))
              ]),
            ]));
  }

  Widget goalDescription(Goal goal) {
    return Padding(
        padding: const EdgeInsets.only(left: 6, right: 6),
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SingleChildScrollView(
                child: Text(goal.description,
                    maxLines: 7,
                    style: const TextStyle(fontSize: 13),
                    overflow: TextOverflow.ellipsis),
              )
            ]));
  }
}

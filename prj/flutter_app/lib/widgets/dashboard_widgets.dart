import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_app/models/goal.dart';
import 'package:flutter_app/screens/questionnaire/questionnaire.dart';
import 'package:flutter_app/services/backend/mentor_service.dart';
import 'package:intl/intl.dart';

Widget sliverChild(
    {required Widget widget, Color widgetColor = Colors.lightGreen}) {
  return Padding(
      padding: const EdgeInsets.all(4),
      child: Ink(
        decoration: boxDecoration(widgetColor),
        child: Padding(padding: const EdgeInsets.all(10), child: widget),
      ));
}

// sliver list widgets

// sliver grid widgets
Widget questionnaireRemainder(
    BuildContext context, int questionnaireId, String name) {
  DateTime currDate = DateTime.now();
  DateTime prevMonthDate =
      DateTime(currDate.year, currDate.month - 1, currDate.day);
  String prevMonth = DateFormat.MMMM().format(prevMonthDate);

  return InkWell(
      onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const Questionnaire_Form()),
    );
  },
  child: Padding(
      padding: EdgeInsets.only(bottom: 0),
      child: Row(children: [
        const Icon(
            Icons.format_list_bulleted), // there's probably a better icon
        Expanded(
            child: Column(
            children: [
          Row(
            children: [
              const Spacer(),
              Text("Submit $prevMonth Questionnaire"),
              const Spacer(),
              Text("Overdue ${DateFormat.d().format(DateTime.now())} days ",
                  style: const TextStyle(
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                      overflow: TextOverflow.fade)),
              const Spacer(flex: 2),
            ],
          ),
          Text(name, style: const TextStyle(
            height: 1.5))
        ]))
      ])));
}

class GoalCell extends StatefulWidget {
  final Goal goal;
  const GoalCell({required this.goal, required BuildContext context, Key? key})
      : super(key: key);

  @override
  _GoalCellState createState() => _GoalCellState();
}

class _GoalCellState extends State<GoalCell> {
  bool _isUpdating = false;
  void updateGoalCellState() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    double colorOpacity;
    if (widget.goal.type == "progress") {
      colorOpacity =
          double.parse(widget.goal.curr) / double.parse(widget.goal.end);
    } else if (widget.goal.curr == "true") {
      colorOpacity = 1.0;
    } else {
      colorOpacity = 0.0;
    }

    if (_isUpdating == true) {
      return Padding(
          padding: const EdgeInsets.all(4),
          child: Ink(
              decoration:
                  boxDecoration(Colors.lightGreen.withOpacity(colorOpacity)),
              child: Container(
                  color: Colors.lightGreen[200],
                  child: const Padding(
                      padding: EdgeInsets.all(45),
                      child: CircularProgressIndicator()))));
    } else {
      return Padding(
          padding: const EdgeInsets.all(4),
          child: Ink(
              decoration:
                  boxDecoration(Colors.lightGreen.withOpacity(colorOpacity)),
              child: InkWell(
                  splashColor: Colors.pink[100],
                  onTap: () async {
                    var editedGoal =
                        await _editGoalDialog(widget.goal, context);
                    if (editedGoal != null) {
                      // Ok button is clicked

                      _isUpdating = true;
                      updateGoalCellState();
                      await MentorService.updateGoal(
                          editedGoal); //todo: check post is successful
                      _isUpdating = false;
                      updateGoalCellState();
                    }
                  },
                  child: Column(children: [
                    Padding(
                        padding:
                            const EdgeInsets.only(left: 15, right: 15, top: 15),
                        child: Center(
                            child: Text(widget.goal.name,
                                maxLines: 3,
                                style: const TextStyle(
                                    overflow: TextOverflow.ellipsis,
                                    fontWeight: FontWeight
                                        .bold)))), // idk why center isnt centering, todo: prevent from overflowing
                    const Spacer(),
                    Padding(
                        padding: const EdgeInsets.only(left: 20, right: 20),
                        child: _goalProgress(widget.goal)),
                    Padding(
                        padding: const EdgeInsets.only(
                            left: 20, right: 20, bottom: 14),
                        child: Text((() {
                          if (widget.goal.type == "progress") {
                            return (double.parse(widget.goal.curr)
                                    .toStringAsFixed(0) +
                                ' out of ' +
                                double.parse(widget.goal.end)
                                    .toStringAsFixed(0));
                          } else if (widget.goal.type == "bool") {
                            if (widget.goal.curr == "false") {
                              return "Not complete";
                            } else if (widget.goal.curr == "true") {
                              return "Completed";
                            } else {
                              print(widget.goal.curr);
                              return "bool error";
                            }
                          } else {
                            return "goal error";
                          }
                        })(),
                            maxLines: 1,
                            style: const TextStyle(
                                overflow: TextOverflow.fade, fontSize: 13)))
                  ]))));
    }
  }
}

class NewGoalBtn extends StatefulWidget {
  final List<Goal> goalsList;
  final int menteeId;
  final void Function() setStateCallback;
  const NewGoalBtn(
      {required this.goalsList,
      required this.menteeId,
      required BuildContext context,
      Key? key,
      required this.setStateCallback})
      : super(key: key);

  @override
  _NewGoalBtnState createState() => _NewGoalBtnState();
}

class _NewGoalBtnState extends State<NewGoalBtn> {
  bool _isLoadingNewGoal = false;

  void updateNewGoalBtnState() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoadingNewGoal) {
      return Padding(
          padding: const EdgeInsets.all(4),
          child: Ink(
              decoration: boxDecoration(Colors.lightGreen.withOpacity(0.25)),
              child: Ink(
                  child: Container(
                      color: Colors.lightGreen.withOpacity(0),
                      child: const Padding(
                          padding: EdgeInsets.all(45),
                          child: CircularProgressIndicator())))));
    } else {
      return Padding(
          padding: const EdgeInsets.all(4),
          child: Ink(
              decoration: boxDecoration(Colors.lightGreen.withOpacity(0.25)),
              child: InkWell(
                  splashColor: Colors.pink[100],
                  onTap: () async {
                    var newGoal =
                        await _newGoalDialog(widget.menteeId, context);
                    if (newGoal != null) {
                      _isLoadingNewGoal = true;
                      updateNewGoalBtnState();
                      var result = await MentorService.newGoal(newGoal);
                      // for testing only
                      widget.goalsList.add(newGoal); //immediately saves locally
                      _isLoadingNewGoal = false;
                      // if (result) //todo: check post is successful, rollback otherwise
                      widget.setStateCallback();
                    }
                  },
                  child: Container(
                      child: const Text('+',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              color: Colors.brown, fontSize: 100))))));
    }
  }
}

Widget _goalProgress(Goal goal) {
  double val = 0.0;
  if (goal.type == "progress") {
    val = double.parse(goal.curr) / double.parse(goal.end);
  } else if (goal.type == "bool") {
    if (goal.curr == "false") {
      const Spacer();
      // return Text("☐",
      //     style: TextStyle(
      //         color: Colors.pinkAccent.withOpacity(0.5), fontSize: 24));
    } else if (goal.curr == "true") {
      return const Text("✔",
          style: TextStyle(
              color: Colors.pinkAccent,
              fontSize: 20,
              fontWeight: FontWeight.normal));
    }
  }
  return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: LinearProgressIndicator(
        value: val,
        minHeight: 6,
        color: Colors.pinkAccent,
        backgroundColor: Colors.white70,
      ));
}

Future<Goal?> _editGoalDialog(Goal goal, BuildContext context) async {
  String _name = goal.name;
  String _description = goal.description;
  String _end = goal.end;
  String _progress = goal.curr;
  bool _isChecked = false;
  if (goal.type == "bool") {
    if (goal.curr == "true") {
      _isChecked = true;
    }
  } else {
    _isChecked = false;
  }

  return await showDialog<Goal>(
    context: context,
    barrierDismissible: false,
    builder: (context) {
      return StatefulBuilder(builder: (context, setState) {
        return AlertDialog(
          backgroundColor: Colors.green[100],
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(0.0),
            ),
          ),
          title: TextFormField(
              decoration: const InputDecoration(border: InputBorder.none),
              initialValue: _name,
              onChanged: (value) {
                _name = value;
              },
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          content: Builder(builder: (context) {
            return IntrinsicHeight(
                child: Column(children: [
              TextFormField(
                  initialValue: _description,
                  autofocus: false,
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  onChanged: (value) {
                    _description = value;
                  },
                  style: const TextStyle(fontSize: 14),
                  decoration: InputDecoration(
                      border: InputBorder.none,
                      fillColor: Colors.green[50],
                      filled: true,
                      contentPadding: const EdgeInsets.all(10),
                      hintText: "Details or progress updates ...")),
              Padding(
                  padding: const EdgeInsets.only(top: 15),
                  child: Text(
                      "Started on ${DateFormat('yyyy-MM-dd').format(goal.startDate)}",
                      style: const TextStyle(fontSize: 14))),
              Padding(
                  padding: const EdgeInsets.only(top: 20),
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Progress: $_progress",
                          style: const TextStyle(
                              fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        Row(
                            children: (() {
                          if (goal.type == "progress") {
                            return [
                              const Text("0"),
                              Expanded(
                                  child: Slider(
                                value: double.parse(_progress),
                                min: 0,
                                max: double.parse(goal.end),
                                divisions: double.parse(goal.end).round(),
                                label:
                                    "${(double.parse(_progress) / double.parse(goal.end) * 100.round()).toStringAsFixed(0)}%",
                                onChanged: (double value) {
                                  setState(() {
                                    _progress = value.toString();
                                  });
                                },
                              )),
                              IntrinsicWidth(
                                  child: TextFormField(
                                decoration: const InputDecoration(
                                    border: InputBorder.none),
                                keyboardType: TextInputType.number,
                                inputFormatters: [
                                  FilteringTextInputFormatter.allow(
                                      RegExp('[0-9]'))
                                ],
                                initialValue: _end,
                                onChanged: (value) {
                                  _end = value;
                                },
                              ))
                            ];
                          } else if ((goal.type == "bool")) {
                            return [
                              const Spacer(),
                              Text("Not complete",
                                  style: TextStyle(
                                      fontSize: 12,
                                      color: (() {
                                        if (_progress == "true") {
                                          return Colors.black.withOpacity(0.3);
                                        }
                                      }()))),
                              Transform.scale(
                                  scale: 1.5,
                                  child: Checkbox(
                                      checkColor: Colors.white,
                                      value: _isChecked,
                                      onChanged: (bool? value) {
                                        setState(() {
                                          if (value == true) {
                                            _progress = "true";
                                            _isChecked = true;
                                          } else {
                                            _progress = "false";
                                            _isChecked = false;
                                          }
                                        });
                                      })),
                              Text("Completed",
                                  style: TextStyle(
                                      fontSize: 14,
                                      color: (() {
                                        if (_progress == "false") {
                                          return Colors.black.withOpacity(0.3);
                                        }
                                      }()))),
                              const Spacer()
                            ];
                          } else {
                            return [const Text("goal type error")];
                          }
                        }()))
                      ]))
            ]));
          }),
          actions: [
            TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text('Cancel')),
            TextButton(
                onPressed: () {
                  goal.name = _name;
                  goal.description = _description;
                  goal.end = _end.toString();
                  goal.curr = _progress.toString();

                  if (goal.curr == "true" ||
                      (double.tryParse(goal.curr) ==
                          double.tryParse(goal.end))) {
                    goal.endDate = DateTime.now();
                  } else {
                    goal.endDate = DateTime(1900);
                  }

                  Navigator.of(context).pop(goal);
                },
                child: const Text('Save'))
          ],
        );
      });
    },
  );
}

Future<Goal?> _newGoalDialog(menteeId, BuildContext context) async {
  String _type = "progress";
  String _name = "New Unnamed Goal";
  String _curr = "0";
  String _end = "10";
  String _description = "";

  return await showDialog<Goal>(
    context: context,
    barrierDismissible: false,
    builder: (context) {
      return StatefulBuilder(builder: (context, setState) {
        return AlertDialog(
          backgroundColor: Colors.green[100],
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.all(
              Radius.circular(0.0),
            ),
          ),
          title: TextFormField(
              decoration: const InputDecoration(hintText: "Name this goal"),
              onChanged: (value) {
                _name = value;
              },
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          content: Builder(builder: (context) {
            return IntrinsicHeight(
                child: Column(children: [
              TextFormField(
                  autofocus: false,
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  onChanged: (value) {
                    _description = value;
                  },
                  style: const TextStyle(fontSize: 14),
                  decoration: InputDecoration(
                      fillColor: Colors.green[50],
                      filled: true,
                      contentPadding: const EdgeInsets.all(10),
                      hintText: "A short description")),
              Padding(
                  padding: const EdgeInsets.only(top: 30, bottom: 30),
                  child: Container(
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                        const Text(
                          "Goal Type: ",
                          style: TextStyle(fontSize: 14),
                        ),
                        Padding(
                            padding: const EdgeInsets.all(5),
                            child: ElevatedButton(
                                style: (() {
                                  if (_type != "progress") {
                                    return ElevatedButton.styleFrom(
                                        primary: Colors.green[100],
                                        side: const BorderSide(
                                            color: Colors.black12),
                                        elevation: 0);
                                  }
                                }()),
                                onPressed: () {
                                  setState(() {
                                    _type = "progress";
                                    _curr = "0";
                                  });
                                },
                                child: Row(children: [
                                  const Text("Incremental, out of  "),
                                  SizedBox(
                                      height: 25,
                                      child: IntrinsicWidth(
                                          child: TextFormField(
                                        decoration: const InputDecoration(
                                            fillColor: Colors.white60,
                                            filled: true),
                                        initialValue: "10",
                                        keyboardType: TextInputType.number,
                                        inputFormatters: [
                                          FilteringTextInputFormatter.allow(
                                              RegExp('[0-9]'))
                                        ],
                                        onChanged: (value) {
                                          _end = value;
                                        },
                                      )))
                                ]))),
                        Padding(
                            padding: const EdgeInsets.all(5),
                            child: ElevatedButton(
                                style: (() {
                                  if (_type != "bool") {
                                    return ElevatedButton.styleFrom(
                                        primary: Colors.green[100],
                                        side: const BorderSide(
                                            color: Colors.black12),
                                        elevation: 0);
                                  }
                                }()),
                                onPressed: () {
                                  setState(() {
                                    _type = "bool";
                                    _curr = "false";
                                  });
                                },
                                child: Row(
                                    children: const [Text("True / False")])))
                      ])))
            ]));
          }),
          actions: [
            TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text('Cancel')),
            TextButton(
                onPressed: () {
                  Goal newGoal = Goal(
                      menteeId: menteeId,
                      startDate: DateTime.now(),
                      endDate: DateTime(1900), //means not ended yet
                      type: _type,
                      name: _name,
                      curr: _curr,
                      end: _end,
                      description: _description);
                  Navigator.of(context).pop(newGoal);
                },
                child: const Text('Create'))
          ],
        );
      });
    },
  );
}

Decoration boxDecoration(Color dynamicColor) {
  return BoxDecoration(
    color: dynamicColor,
    boxShadow: [
      BoxShadow(
        color: Colors.grey.withOpacity(0.4),
        spreadRadius: 3,
        blurRadius: 4,
        offset: const Offset(1, 2),
      ),
    ],
  );
}

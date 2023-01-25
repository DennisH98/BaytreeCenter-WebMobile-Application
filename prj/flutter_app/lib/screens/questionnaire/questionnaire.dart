import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_app/models/mentor.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/models/question.dart';
import 'package:flutter_app/models/questionnaire.dart';
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';
import 'package:flutter_app/services/views/api_services.dart';
import 'package:flutter_app/utils/request_builder.dart';
import 'package:flutter_app/utils/response_parser.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_app/utils/storage_keys.dart';
import 'package:http/http.dart' as http;

const double fontSize = 14;

class Questionnaire_Form extends StatefulWidget {
  const Questionnaire_Form({Key? key}) : super(key: key);

  @override
  _Questionnaire_FormState createState() => _Questionnaire_FormState();
}

class _Questionnaire_FormState extends State<Questionnaire_Form> {
  late Future<http.Response> questionnaireData;

  List<int> availableQuestionnaireIds = [];
  List<String> availableQuestionnairesNames = [];
  late int lastQuestionnaireIndex;
  late String mentorName;
  late String menteeName;

  var numQuestions = 0;

  // required to identify form widget
  GlobalKey<FormState> formKey = GlobalKey<FormState>();

  // Default Radio Button Selected Item and Result from group
  List<int> radioButtonItem = List.filled(128, 0);
  List<int> groupChoice = List.filled(128, -1);

  // stores user answers
  List<Map<String, dynamic>> values = <Map<String, dynamic>>[];

  @override
  void initState() {
    questionnaireData = _fetchDataAndQuestionnaire();
    super.initState();
  }

  void refreshPage() {
    setState(() {
      clearData();
      questionnaireData = _fetchDataAndQuestionnaire();
    });
  }

  void clearData() {
    availableQuestionnaireIds = [];
    availableQuestionnairesNames = [];
    numQuestions = 0;
    radioButtonItem = List.filled(128, 0);
    groupChoice = List.filled(128, -1);
    formKey = GlobalKey<FormState>();
    values = <Map<String, dynamic>>[];
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: questionnaireData,
      builder: (context, AsyncSnapshot<http.Response> snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          // triggered by a pageRefresh()
          return CustomAppBar_withLoadingIndicator(context, "Questionnaire");
        } else if (snapshot.hasError) {
          return const Center(
            child: Text("Unable to get questionnaire. Please try again later"),
          );
        } else if (snapshot.hasData) {
          return Scaffold(
            appBar: CustomAppBar(
                context: context,
                title: "Questionnaire",
                button: CustomAppBarButton(
                    callback: submitAnswers, title: "Submit")),
            drawer: const SideBar(),
            body: _buildForm(formKey, snapshot.data!.body),
          );
        } else {
          return CustomAppBar_withLoadingIndicator(context, "Questionnaire");
        }
      },
    );
  }

  Future<http.Response> _fetchDataAndQuestionnaire() async {
    // 🤏 temporal coupling
    Future.wait(
        [getAvailableQuestionnaireIds(), getMentorName(), getMenteeName()]);
    await getLastViewedQuestionnaireIndex();
    await getQuestionnaireNames();

    String questionnaireUrl = ViewsAPIRequester.fetchQuestionnaireUrl(
        availableQuestionnaireIds[lastQuestionnaireIndex]);
    http.Response response =
        await ViewsAPIRequester.getViewsAPI(questionnaireUrl);

    return response;
  }

  Future<void> getMentorName() async {
    try {
      mentorName = MentorAccount.instance.mentor.fName +
          " " +
          MentorAccount.instance.mentor.lName;
    } catch (e) {
      print("getMentorName error");
    }
  }

  Future<void> getMenteeName() async {
    try {
      menteeName =
          (await SecureStorage.getValue(StorageKeys.currentMenteeName))!;
    } catch (e) {
      print("getMenteeName error");
    }
  }

  Future<void> getAvailableQuestionnaireIds() async {
    availableQuestionnaireIds =
        MentorAccount.instance.assignedQuestionnairesIds;
    if (availableQuestionnaireIds == []) {
      throw Exception("no assigned questionnaires");
    }
  }

  Future<void> getQuestionnaireNames() async {
    List<String> names = [];
    try {
      // todo: make this run in parallel
      for (int i = 0; i < availableQuestionnaireIds.length; i++) {
        String questionnaireUrl = ViewsAPIRequester.fetchQuestionnaireUrl(
            availableQuestionnaireIds[i]);
        http.Response response =
            await ViewsAPIRequester.getViewsAPI(questionnaireUrl);
        names.add(ResponseParser.parseQuestionnaireName(response.body));
      }
      availableQuestionnairesNames = names;
    } catch (e) {
      print(e);
      print("no assigned questionnaire names");
      availableQuestionnairesNames = [];
    }
  }

  Future<void> getLastViewedQuestionnaireIndex() async {
    try {
      String? lastQuestionnaire =
          await SecureStorage.getValue(StorageKeys.lastQuestionnaireIndex);
      lastQuestionnaireIndex = int.parse(lastQuestionnaire!);
    } catch (e) {
      print(e);
      // if problem loading, just default to 1st questionnaire
      lastQuestionnaireIndex = 0;
    }
  }

  Widget _buildForm(_formKey, String questionnaireJSON) {
    List<Question> questionList =
        ResponseParser.parseQuestionnaireQuestions(questionnaireJSON);
    numQuestions = questionList.length;
    String currentQuestionnaire =
        availableQuestionnairesNames[lastQuestionnaireIndex];

    return Column(children: [
      questionnaireSelector(currentQuestionnaire),
      Expanded(
          child: Form(
              key: _formKey,
              child: ListView.builder(
                shrinkWrap: true,
                padding: const EdgeInsets.all(10.0),
                itemCount: questionList.length,
                itemBuilder: (context, index) {
                  return _buildRowByQnType(questionList, index);
                },
              )))
    ]);
  }

  Container questionnaireSelector(String currentQuestionnaire) {
    return Container(
        color: Colors.lightGreen[150],
        height: 48,
        child: Padding(
            padding: const EdgeInsets.only(left: 10, right: 10),
            child: Column(children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                // Text(
                //     "ID: ${availableQuestionnaireIds[lastQuestionnaireIndex]} "),
                Flexible(
                    fit: FlexFit.tight,
                    child: DropdownButton(
                      // todo_style: make text overflow properly
                      isExpanded: true,
                      value: currentQuestionnaire,
                      icon: const Icon(Icons.arrow_downward),
                      iconSize: 24,
                      elevation: 16,
                      style: const TextStyle(
                          color: Colors.brown, overflow: TextOverflow.fade),
                      underline: Container(
                        height: 2,
                        color: Colors.lightGreen,
                      ),
                      onChanged: (String? newValue) async {
                        for (int i = 0;
                            i < availableQuestionnairesNames.length;
                            i++) {
                          if (availableQuestionnairesNames[i] == newValue) {
                            currentQuestionnaire =
                                availableQuestionnairesNames[i];
                            lastQuestionnaireIndex = i;

                            await SecureStorage.setValue(
                                StorageKeys.lastQuestionnaireIndex,
                                i.toString());
                          }
                        }
                        refreshPage();
                      },
                      items: availableQuestionnairesNames
                          .map<DropdownMenuItem<String>>((String val) {
                        return DropdownMenuItem<String>(
                          value: val,
                          child: Text(val),
                        );
                      }).toList(),
                    ))
              ])
            ])));
  }

  Widget _buildRowByQnType(List<Question> questionList, int index) {
    Widget qnRow;
    // choose appropriate builder for each question type
    if (Question.getQuestionType(questionList[index]) == "text") {
      qnRow = _textQuestion(questionList[index]);
    } else if (Question.getQuestionType(questionList[index]) == "rating") {
      qnRow = _ratingQuestion(questionList[index]);
    } else if (Question.getQuestionType(questionList[index]) == "month") {
      qnRow = _monthQuestion(questionList[index]);
    } else {
      qnRow = const Text("Error: unsupported question");
    }
    return Card(child: qnRow);
  }

  Row _textQuestion(Question qn) {
    return Row(
      children: [
        const Padding(
          padding: EdgeInsets.all(10.0),
        ),
        Text(qn.question, style: const TextStyle(fontSize: fontSize)),
        const SizedBox(width: 5),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(10.0),
            child: TextFormField(
                initialValue: ((() {
                  String val = prefillNames(qn.question);
                  _updateAnswers(qn.QuestionID, val);
                  return val;
                }())),
                decoration: const InputDecoration(
                  contentPadding: EdgeInsets.all(10.0),
                  isDense: true,
                  filled: true,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please answer question';
                  }
                  return null;
                },
                onChanged: (val) {
                  _updateAnswers(qn.QuestionID, val);
                }),
          ),
        ),
      ],
    );
  }

  String prefillNames(String qn) {
    if (qn == 'Mentor\'s Name') {
      return mentorName;
    } else if (qn == 'Mentee\'s Name') {
      return menteeName;
    } else {
      return "";
    }
  }

  Column _ratingQuestion(Question qn) {
    int ratingQnGrp = qn.QuestionID;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.only(
            left: 20,
            right: 20,
            top: 10,
          ),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Text(qn.question, style: TextStyle(fontSize: fontSize)),
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.only(
                left: 2,
                right: 10,
                top: 10,
                bottom: 10,
              ),
              child: Text(
                'Never',
                style: TextStyle(
                  fontSize: fontSize - 2,
                  fontStyle: FontStyle.italic,
                  color: Colors.black.withOpacity(0.6),
                ),
              ),
            ),
            SizedBox(
              height: 24.0,
              width: 24.0,
              child: Radio(
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                value: 1,
                groupValue: groupChoice[ratingQnGrp],
                onChanged: (val) {
                  setState(() {
                    radioButtonItem[ratingQnGrp] = 1;
                    groupChoice[ratingQnGrp] = 1;
                    _updateAnswers(qn.QuestionID, "1");
                  });
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 2,
                right: 10,
                top: 10,
                bottom: 10,
              ),
              child: Text(
                '1',
                style: new TextStyle(fontSize: fontSize),
              ),
            ),
            SizedBox(
              height: 24.0,
              width: 24.0,
              child: Radio(
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                value: 2,
                groupValue: groupChoice[ratingQnGrp],
                onChanged: (val) {
                  setState(() {
                    radioButtonItem[ratingQnGrp] = 2;
                    groupChoice[ratingQnGrp] = 2;
                    _updateAnswers(qn.QuestionID, "2");
                  });
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 2,
                right: 10,
                top: 10,
                bottom: 10,
              ),
              child: Text(
                '2',
                style: new TextStyle(
                  fontSize: fontSize,
                ),
              ),
            ),
            SizedBox(
              height: 24.0,
              width: 24.0,
              child: Radio(
                value: 3,
                groupValue: groupChoice[ratingQnGrp],
                onChanged: (val) {
                  setState(() {
                    radioButtonItem[ratingQnGrp] = 3;
                    groupChoice[ratingQnGrp] = 3;
                    _updateAnswers(qn.QuestionID, "3");
                  });
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 2,
                right: 10,
                top: 10,
                bottom: 10,
              ),
              child: Text(
                '3',
                style: new TextStyle(fontSize: fontSize),
              ),
            ),
            SizedBox(
              height: 24.0,
              width: 24.0,
              child: Radio(
                value: 4,
                groupValue: groupChoice[ratingQnGrp],
                onChanged: (val) {
                  setState(() {
                    radioButtonItem[ratingQnGrp] = 4;
                    groupChoice[ratingQnGrp] = 4;
                    _updateAnswers(qn.QuestionID, "4");
                  });
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 2,
                right: 10,
                top: 10,
                bottom: 10,
              ),
              child: Text(
                '4',
                style: new TextStyle(
                  fontSize: fontSize,
                ),
              ),
            ),
            SizedBox(
              height: 24.0,
              width: 24.0,
              child: Radio(
                value: 5,
                groupValue: groupChoice[ratingQnGrp],
                onChanged: (val) {
                  setState(() {
                    radioButtonItem[ratingQnGrp] = 5;
                    groupChoice[ratingQnGrp] = 5;
                    _updateAnswers(qn.QuestionID, "5");
                  });
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 2,
                right: 10,
                top: 15,
                bottom: 15,
              ),
              child: Text(
                '5',
                style: new TextStyle(
                  fontSize: fontSize,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 2,
                right: 10,
                top: 10,
                bottom: 10,
              ),
              child: Text(
                'Always',
                style: TextStyle(
                  fontSize: fontSize - 2,
                  //fontStyle: FontStyle.italic,
                  color: Colors.black.withOpacity(0.6),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Row _monthQuestion(Question qn) {
    var _currMonth = DateTime.now().month;
    //TODO: make into scrolling picker
    List<String> monthStrings = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    final List<Widget> months = List<Widget>.generate(
      12,
      (i) => Card(
        child: Center(
          child: Text(
            monthStrings[i],
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );

    return Row(
      children: [
        const Padding(
          padding: EdgeInsets.all(10.0),
        ),
        Text(qn.question, style: const TextStyle(fontSize: fontSize)),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(10.0),
            child: TextFormField(
                keyboardType: TextInputType.number,
                //initialValue: DateTime.now().month.toString(),
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'[0-9]')),
                ],
                decoration: const InputDecoration(
                  contentPadding: EdgeInsets.all(10.0),
                  isDense: true,
                  filled: true,
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please answer question';
                  }
                  return null;
                },
                onChanged: (val) {
                  _updateAnswers(qn.QuestionID, val);
                }),
          ),
        ),
      ],
    );
  }

  void _updateAnswers(int qnID, String val) async {
    int foundKey = -1;
    for (var map in values) {
      if (map.containsKey("QuestionID")) {
        if (map["QuestionID"] == qnID) {
          foundKey = qnID;
          break;
        }
      }
    }
    if (foundKey != -1) {
      values.removeWhere((map) {
        return map["QuestionID"] == foundKey;
      });
    }
    Map<String, dynamic> json = {
      "QuestionID": qnID,
      "value": val,
    };
    values.add(json);
  }

  void submitAnswers() {
    if (formKey.currentState!.validate() && validateRatingQns()) {
      String answersXML =
          RequestBodyBuilder.convertQuestionnaireAnswersToXMLString(values);
      _onSending(answersXML);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please answer all questions.')));
    }
  }

  bool validateRatingQns() {
    return (numQuestions == values.length);
  }

  Future<void> _onSending(String xml) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Dialog(
            insetPadding: EdgeInsets.zero,
            clipBehavior: Clip.antiAliasWithSaveLayer,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
            child: const SizedBox(
              width: 100.0,
              height: 100.0,
              child: Padding(
                  padding: EdgeInsets.all(10.0),
                  child: Center(child: LinearProgressIndicator())),
            ));
      },
    );
    http.Response response = await _sendAnswersToViews(xml);
    Navigator.pop(context);

    if (response.statusCode == 200) {
      updateQuestionnaireSubmissionDate();

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return Dialog(
              insetPadding: EdgeInsets.zero,
              clipBehavior: Clip.antiAliasWithSaveLayer,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15)),
              child: const SizedBox(
                width: 100.0,
                height: 100.0,
                child: Padding(
                    padding: EdgeInsets.all(10.0),
                    child: Center(
                        child: Text("✅",
                            style: TextStyle(fontSize: fontSize * 3)))),
              ));
        },
      );
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text("Answers submitted.")));
    } else {
      const SnackBar(content: Text("Submitted failed."));
    }
  }

  Future<http.Response> _sendAnswersToViews(String ansXml) async {
    String sendAnsUrl = ViewsAPIRequester.sendAnswersUrl(
        availableQuestionnaireIds[lastQuestionnaireIndex]);
    http.Response response =
        await ViewsAPIRequester.postViewsAPI(sendAnsUrl, ansXml);

    return response;
  }

  Future<void> updateQuestionnaireSubmissionDate() async {
    String? listJson = await SecureStorage.getValue(StorageKeys.assignedQuestionnaires);
    List<dynamic> parseList = [];
    List<Questionnaire> questionnaireList = [];
    try {
      parseList = jsonDecode(listJson!);
    } catch (e) {
      print(e);
    }
    bool updated = false;
    for (var i in parseList) {
      if (i['id'] == availableQuestionnaireIds[lastQuestionnaireIndex]) {
        questionnaireList.add(Questionnaire(id: availableQuestionnaireIds[lastQuestionnaireIndex], name: availableQuestionnairesNames[lastQuestionnaireIndex], lastSubmit: DateTime.now()));
        updated = true;
      } else {
        questionnaireList.add(Questionnaire(id: i['id'], name: i['name'], lastSubmit: DateTime.parse(i['lastSubmit'])));
      }
    }
    if (updated == false) {
      questionnaireList.add(Questionnaire(id: availableQuestionnaireIds[lastQuestionnaireIndex], name: availableQuestionnairesNames[lastQuestionnaireIndex], lastSubmit: DateTime.now()));
    }
    await SecureStorage.setValue(StorageKeys.assignedQuestionnaires, jsonEncode(questionnaireList));
  }
}
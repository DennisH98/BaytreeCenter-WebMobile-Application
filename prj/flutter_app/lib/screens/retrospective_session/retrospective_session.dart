import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:intl/intl.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';
import 'package:flutter_app/screens/landing_page/landing_screen.dart';
import 'package:flutter_app/services/views/api_services.dart';


class RetrospectiveSession extends StatefulWidget{
  const RetrospectiveSession({Key? key}) : super(key: key);

  @override
  State<RetrospectiveSession> createState() => _RetrospectiveSession();
}

class _RetrospectiveSession extends State<RetrospectiveSession> {

  //todo: check to make sure that the user has enter a time and date
  //todo: check to make sure that the user has entered a valid time

  DateTime date = DateTime.now();
  TimeOfDay time = TimeOfDay.now();
  DateTime startDateTime = DateTime(DateTime.now().day + 1);
  DateTime endDateTime = DateTime(DateTime.now().day + 1);
  String sessionNotes = "";
  bool cancelled = false;
  final _formKey = GlobalKey<FormState>();
  List <String> menteeList = fillMenteeList();

  String dropDownValue = MentorAccount.instance.menteeList[0].fName;

  Future<Null> pickDateTime() async {
    final dateChoosen = await pickDate();
    if (dateChoosen == null) return;
    final timeChoosen = await pickTime();
    if (timeChoosen == null) return;


    setState(() {
      startDateTime = DateTime(
        dateChoosen.year,
        dateChoosen.month,
        dateChoosen.day,
        timeChoosen.hour,
        timeChoosen.minute,
      );
    });
  }
  Future<Null> pickDuritionTime() async {
    final timeChoosen = await pickTime();
    if (timeChoosen == null) return;
    setState(() {
      endDateTime = DateTime(
        startDateTime.year,
        startDateTime.month,
        startDateTime.day,
        timeChoosen.hour,
        timeChoosen.minute,
      );
    });
  }


  Future<DateTime?> pickDate () async{
    DateTime? datePicked = await showDatePicker(
      context: context,
      initialDate: date,
      firstDate: DateTime(DateTime.now().year - 1),
      lastDate: DateTime.now(),
    );

    if(datePicked  != null){
      setState((){
        date = datePicked ;
      });
      return date;
    }
    return null;
  }
  Future<TimeOfDay?> pickTime() async {
    TimeOfDay? timePicked = await showTimePicker(
      context: context,
      initialTime: time,
    );
    if(timePicked  != null){
      setState((){
        time = timePicked;
      });
      return time;
    }
    return null;
  }

  String getDateTime(){
    if (startDateTime == DateTime(DateTime.now().day + 1)){
      return "Click Here to Record";
    }
    else{
      return DateFormat('dd/MM/yyyy hh:mm aa').format(startDateTime);
    }
  }
  String getTime(){
    if (endDateTime == DateTime(DateTime.now().day + 1)){
      return "Click Here to Record";
    }
    else{
      return DateFormat('hh:mm aa').format(endDateTime);

    }
  }

  static List<String> fillMenteeList (){
    List <String> tmpMenteeList = [];
    for(var mentee in MentorAccount.instance.menteeList ){
      tmpMenteeList.add(mentee.fName);
    }
    return tmpMenteeList;
  }

  int findMenteeId (){
    for(var mentee in MentorAccount.instance.menteeList ){
      if (mentee.fName == dropDownValue){
        return mentee.viewsID;
      }
    }
    return 0;
  }

  String notesReminderForCanceledSession(){
    if(cancelled){
      return "(If you or the mentee did not attend the session, please explain why)";
    }
    else{
      return "(Please enter your session notes for the selected Mentee: ${dropDownValue}";
    }
  }

  Future<void> _createSession() async {

    List<String> activities = <String>[];
    activities.add("Budgeting");

    var res = await ViewsAPIRequester.createSession(
        sessionGroupId: 3,
        sessionType: "Individual",
        name: "Mentoring session",
        startDateTime: startDateTime,
        duration: endDateTime.difference(startDateTime),
        cancelled: cancelled,
        activities: activities,
        leadStaff: MentorAccount.instance.mentor.id,
        venueId: 2,
        restrictedRecord: 0,
        contactType: "Individual");

    int sessionId = res!.sessionID as int;


    await ViewsAPIRequester.addSessionParticipant(
        sessionId: sessionId,
        contactId: findMenteeId(),
        attended: !cancelled);

    await ViewsAPIRequester.addSessionStaff(
        sessionId: sessionId,
        contactId: MentorAccount.instance.mentor.id,
        attended: !cancelled,
        role: "Lead",
        volunteering: "Mentoring");

    await ViewsAPIRequester.addSessionNotes(
        sessionId: sessionId,
        notes: sessionNotes);

  }

  showAlertDialog(BuildContext context) {

    Widget cancelButton = TextButton(
      style: TextButton.styleFrom(
        primary: Colors.white,
        backgroundColor:Colors.pink[300],
      ),
      onPressed: () {
        Navigator.pop(context);
      },
      child: Text('CANCEL'),
    );

    Widget continueButton = TextButton(
      style: TextButton.styleFrom(
        primary: Colors.white,
        backgroundColor: Colors.pink[300],
      ),
      onPressed: () {
        _createSession();

        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text(
                    "Session Sent!"
                )
            )
        );
      },
      child: Text('SUBMIT'),

    );

    AlertDialog alert = AlertDialog(
      title: Text("Summary", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      content: SingleChildScrollView(
        child: Wrap(
          children: <Widget>[
            RichText(
              text:TextSpan(
                  text:"Mentee's Name:  ",
                  style: TextStyle(
                      color: Colors.black.withOpacity(1),
                      fontWeight: FontWeight.bold,
                      fontSize: 16
                  ),
                  children: <TextSpan>[
                    TextSpan(
                      text:"${dropDownValue} \n",
                      style:TextStyle(
                          color: Colors.black.withOpacity(0.9),
                          fontWeight: FontWeight.w400
                      ),
                    ),
                  ]
              ),
            ),
            SizedBox(height: 25),
            RichText(
              text:TextSpan(
                  text:"Session Happened? ",
                  style: TextStyle(
                      color: Colors.black.withOpacity(1),
                      fontWeight: FontWeight.bold,
                      fontSize: 16
                  ),
                  children: <TextSpan>[
                    TextSpan(
                      text:"${(cancelled) ? "No" : "Yes" }\n",
                      style:TextStyle(
                          color: Colors.black.withOpacity(0.9),
                          fontWeight: FontWeight.w400
                      ),
                    ),
                  ]
              ),
            ),
            SizedBox(height: 25),
            RichText(
              text:TextSpan(
                  text:"Starting Date: ",
                  style: TextStyle(
                      color: Colors.black.withOpacity(1),
                      fontWeight: FontWeight.bold,
                      fontSize: 16
                  ),
                  children: <TextSpan>[
                    TextSpan(
                      text:"${DateFormat('dd/MM/yyyy').format(startDateTime)}\n",
                      style:TextStyle(
                          color: Colors.black.withOpacity(0.9),
                          fontWeight: FontWeight.w400
                      ),
                    ),
                  ]
              ),
            ),
            SizedBox(height: 25),
            RichText(
              text:TextSpan(
                  text:"Starting Time: ",
                  style: TextStyle(
                      color: Colors.black.withOpacity(1),
                      fontWeight: FontWeight.bold,
                      fontSize: 16
                  ),
                  children: <TextSpan>[
                    TextSpan(
                      text:"${DateFormat('hh:mm aa').format(startDateTime)}\n",
                      style:TextStyle(
                          color: Colors.black.withOpacity(0.9),
                          fontWeight: FontWeight.w400
                      ),
                    ),
                  ]
              ),
            ),
            SizedBox(height: 25),
            RichText(
              text:TextSpan(
                  text:"Ending Time: ",
                  style: TextStyle(
                      color: Colors.black.withOpacity(1),
                      fontWeight: FontWeight.bold,
                      fontSize: 16
                  ),
                  children: <TextSpan>[
                    TextSpan(
                      text:"${DateFormat('hh:mm aa').format(endDateTime)}\n",
                      style:TextStyle(
                          color: Colors.black.withOpacity(0.9),
                          fontWeight: FontWeight.w400
                      ),
                    ),
                  ]
              ),
            ),
            SizedBox(height: 25),
            RichText(
              text:TextSpan(
                  text:"Session Notes:\n",
                  style: TextStyle(
                      color: Colors.black.withOpacity(1),
                      fontWeight: FontWeight.bold,
                      fontSize: 16
                  ),
                  children: <TextSpan>[
                    TextSpan(
                      text:"${sessionNotes}",
                      style:TextStyle(
                          color: Colors.black.withOpacity(0.9),
                          fontWeight: FontWeight.w400
                      ),
                    ),
                  ]
              ),
            ),
          ],
        ),
      ),
      actions: [
        continueButton,
        cancelButton,
      ],
      actionsPadding: const EdgeInsets.all(20.0),
    );

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }


  var dateTimeStyle = ButtonStyle(
    overlayColor: MaterialStateProperty.all(Colors.pink[300]),
    elevation: MaterialStateProperty.all(5),
    shadowColor: MaterialStateProperty.all(Colors.black),
    shape: MaterialStateProperty.all(
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
    ),
  );
  var actionButtonStyle =  ButtonStyle(
    overlayColor: MaterialStateProperty.all(Colors.pink[300]),
    fixedSize: MaterialStateProperty.all(const Size(150, 40)),
    elevation: MaterialStateProperty.all(15),
    shadowColor: MaterialStateProperty.all(Colors.black),
  );
  var textStyle = TextStyle(
      color: Colors.black.withOpacity(0.9),
      fontWeight: FontWeight.w500
  );
  var dropDownDecoration = BoxDecoration(
    border: Border.all(
      color: Color(0xFF8BC34A),
      width: 6,
    ),
    borderRadius: BorderRadius.circular(20),
  );

  static const IconData arrow_drop_down_circle_rounded = IconData(0xf576, fontFamily: 'MaterialIcons');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: CustomAppBar(
          context: context,
          title: "Create Session",
        ),
        drawer: const SideBar(),
        body: SingleChildScrollView(
            child:Padding(
                padding: const EdgeInsets.all(20.0),
                child:
                Column(
                  children: <Widget>[
                    Row(
                        children: <Widget>[
                          Text("Mentee's name:",
                              style: textStyle),
                          Spacer(),
                          Container(
                            padding: const EdgeInsets.only(left: 10.0, right: 10.0),
                            decoration: dropDownDecoration,
                            child:DropdownButton<String>(
                              items: menteeList.map((String value) {
                                return DropdownMenuItem<String>(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                              value: dropDownValue,
                              onChanged: (String? newValue){
                                setState((){
                                  dropDownValue = newValue!;
                                });
                              },
                              icon: Icon(arrow_drop_down_circle_rounded),
                              iconSize: 24,
                              underline: Container(
                                  padding: const EdgeInsets.all(20.0)
                              ),
                            ) ,
                          )
                        ]
                    ),
                    Row(
                      children: <Widget>[
                        Text("Check if the session didn't take place?",
                            style: textStyle),
                        Checkbox(
                          value: this.cancelled,
                          onChanged: (bool? value) {
                            setState(() {
                              this.cancelled = value!;
                            });
                          },
                        ),
                      ],
                    ),
                    Row(
                        children: <Widget>[
                          Text("Starting Time and Date:",
                              style: textStyle),
                          Spacer(),
                          ElevatedButton(
                              onPressed: () {
                                pickDateTime();
                              },
                              child: Text(getDateTime()),
                              style: dateTimeStyle
                          )
                        ]
                    ),
                    Row(
                        children: <Widget>[
                          Text("Ending Time:",
                              style: textStyle),
                          Spacer(),
                          ElevatedButton(
                              onPressed: () {
                                pickDuritionTime();
                              },
                              child: Text(getTime()),
                              style: dateTimeStyle
                          )
                        ]
                    ),
                    SizedBox(height: 10),
                    RichText(
                      text:TextSpan(
                          text:"Session Notes: \n",
                          style: textStyle,
                          children: <TextSpan>[
                            TextSpan(
                              text: notesReminderForCanceledSession(),
                              style:TextStyle(
                                  color: Colors.black.withOpacity(0.5),
                                  fontWeight: FontWeight.w500,
                                  fontStyle: FontStyle.italic
                              ),
                            ),
                          ]
                      ),
                    ),
                    SizedBox(height: 3),
                    Form(
                      key: _formKey,
                      child: TextFormField(
                        cursorColor: Colors.black,
                        keyboardType: TextInputType.multiline,
                        autocorrect: true,
                        minLines: 5,
                        maxLines: null,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your Notes';
                          }
                          return null;
                        },
                        onChanged: (String change) => sessionNotes = change,
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                          contentPadding:
                          EdgeInsets.only(left: 15, bottom: 11, top: 11, right: 15),
                          hintText: "Enter session notes here...",
                        ),
                      ),
                    ),
                    SizedBox(height: 15),
                    Padding(
                      padding: const EdgeInsets.all(10.0),
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: <Widget>[
                            ElevatedButton(
                              onPressed: () {
                                if (_formKey.currentState!.validate()) {
                                  showAlertDialog(context);
                                }
                              },
                              child: Text("Submit"),
                              style: actionButtonStyle,
                            ),
                            ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(builder: (
                                      context) => const LandingPage()),
                                );
                              },
                              child: Text("Cancel"),
                              style: actionButtonStyle,
                            )
                          ]
                      ),
                    )
                  ],
                )
            )
        )
    );

  }
}
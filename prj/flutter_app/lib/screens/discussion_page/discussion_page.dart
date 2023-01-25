import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_app/models/discussion.dart';
import 'package:flutter_app/models/discussion_reply.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';
import 'package:flutter_app/services/backend/discussion.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_app/utils/storage_keys.dart';
import 'package:intl/intl.dart';

class DiscussionCard extends StatelessWidget {
  final TextStyle cardTitleStyle =
      const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold);
  final TextStyle cardBodyStyle = const TextStyle(fontSize: 16.0);
  final TextStyle cardCreatedAtStyle =
      const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w400);

  final String title;
  final String body;
  final DateTime createdAt;
  final Color? color;
  void Function()? onReplyPressed;
  DiscussionCard(
      {Key? key,
      required this.title,
      required this.body,
      required this.createdAt,
      this.color,
      this.onReplyPressed})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
        color: color,
        margin: const EdgeInsets.all(6.0),
        child: Padding(
            padding: const EdgeInsets.all(8.0),
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(title, style: cardTitleStyle),
              Text(
                  '${DateFormat.MMMM().format(createdAt)} ${createdAt.day}, ${createdAt.year} ${DateFormat('hh:mm a').format(createdAt)}',
                  style: cardCreatedAtStyle),
              const SizedBox(height: 10),
              Text(body, style: cardBodyStyle),
              onReplyPressed != null
                  ? Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                      IconButton(
                          onPressed: onReplyPressed,
                          icon: const Icon(
                            Icons.reply,
                            color: Colors.lightGreen,
                          ))
                    ])
                  : Container()
            ])));
  }
}

class DiscussionPage extends StatefulWidget {
  final String discussionId;
  const DiscussionPage({Key? key, required this.discussionId})
      : super(key: key);

  @override
  _DiscussionPageState createState() => _DiscussionPageState();
}

class _DiscussionPageState extends State<DiscussionPage> {
  final TextEditingController _textFieldController = TextEditingController();

  Future<DiscussionResponse> getDiscussion() async {
    return (await DiscussionService.instance.getDiscussions(filters: {
      "id": [widget.discussionId]
    }))[0];
  }

  Future<void> _displayReplyInputDialog(BuildContext context) {
    _textFieldController.clear();
    return showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text('Write Reply'),
            content: TextField(
              autofocus: true,
              keyboardType: TextInputType.multiline,
              maxLines: null,
              controller: _textFieldController,
              decoration: InputDecoration(hintText: "Enter here..."),
            ),
            actions: <Widget>[
              FlatButton(
                color: Colors.grey[400],
                textColor: Colors.white,
                child: Text('CANCEL'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              FlatButton(
                color: Colors.green,
                textColor: Colors.white,
                child: const Text(
                  'OK',
                ),
                onPressed: () async {
                  if (_textFieldController.text == "") {
                    Navigator.of(context).pop();
                    return;
                  }
                  String? mentorAccountId =
                      await SecureStorage.getValue(StorageKeys.mentorAccountId);
                  await DiscussionService.instance.addReply(
                      DiscussionReplyRequest(
                          authorMentorAccountId: mentorAccountId!,
                          author:
                              "${MentorAccount.instance.mentor.fName} ${MentorAccount.instance.mentor.lName}",
                          body: _textFieldController.text),
                      widget.discussionId);
                  Navigator.of(context).pop();
                  setState(() {});
                },
              ),
            ],
          );
        });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Discussion"),
          centerTitle: true,
          backgroundColor: Colors.green[100],
          actions: [
            IconButton(
                onPressed: () =>
                    Navigator.popAndPushNamed(context, "/discussion"),
                icon: Icon(Icons.refresh))
          ],
        ),
        drawer: const SideBar(),
        floatingActionButton: FloatingActionButton(
            child: Icon(Icons.reply),
            onPressed: () => _displayReplyInputDialog(context)),
        body: FutureBuilder(
          future: getDiscussion(), // async work
          builder: (BuildContext context,
              AsyncSnapshot<DiscussionResponse> snapshot) {
            switch (snapshot.connectionState) {
              case ConnectionState.waiting:
                return Center(child: CircularProgressIndicator());
              default:
                if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                } else {
                  DiscussionResponse discussion = snapshot.data!;
                  return ListView(
                    padding: const EdgeInsets.all(8),
                    children: <Widget>[
                      DiscussionCard(
                          title: discussion.title,
                          createdAt: discussion.createdAt,
                          body: discussion.body,
                          color: Colors.green[100]),
                      SizedBox(height: 20),
                      Divider(
                        color: Colors.grey,
                      ),
                      SizedBox(height: 20),
                      ...discussion.replies.map((reply) => DiscussionCard(
                          title: reply.author,
                          body: reply.body,
                          createdAt: reply.createdAt))
                    ],
                  );
                }
            }
          },
        ));
  }
}

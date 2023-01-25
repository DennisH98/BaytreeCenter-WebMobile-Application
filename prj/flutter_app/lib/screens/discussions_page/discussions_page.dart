import 'dart:convert';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/models/discussion.dart';
import 'package:flutter_app/screens/app_bar/app_bar.dart';
import 'package:flutter_app/screens/discussion_page/discussion_page.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';
import 'package:flutter_app/services/backend/api_services.dart';
import 'package:flutter_app/services/backend/discussion.dart';
import 'package:flutter_app/services/backend/mentor_service.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_app/utils/storage_keys.dart';
import 'package:intl/intl.dart';
import 'package:pagination_view/pagination_view.dart';

class DiscussionsPage extends StatefulWidget {
  const DiscussionsPage({Key? key}) : super(key: key);

  @override
  _DiscussionsPageState createState() => _DiscussionsPageState();
}

class _DiscussionsPageState extends State<DiscussionsPage> {
  Future<List<DiscussionResponse>> getDiscussions(int offset) async {
    String? mentorAccountId =
        await SecureStorage.getValue(StorageKeys.mentorAccountId);

    if (mentorAccountId == null) {
      throw Exception("Failed to get the mentor account id from local storage");
    }

    List<String> mentorTypes =
        (await MentorService.getMentorAccounts(ids: [mentorAccountId]))[0]
            .mentorTypes;

    return DiscussionService.instance
        .getDiscussions(offset: offset, limit: 10, filters: {
      "or": [
        {"mentorTypesIncludesAny": mentorTypes},
        {
          "mentorAccountIdsIncludesAny": [mentorAccountId]
        },
        {
          "isGlobal": ["true"]
        }
      ],
      "sortCreatedAt": ["desc"]
    });
  }

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration.zero, () {
      FirebaseMessaging.onMessage.listen((event) {
        Navigator.popAndPushNamed(context, "/discussions");
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text("Discussions"),
          centerTitle: true,
          backgroundColor: Colors.green[100],
          actions: [
            IconButton(
                onPressed: () =>
                    Navigator.popAndPushNamed(context, "/discussions"),
                icon: Icon(Icons.refresh))
          ],
        ),
        drawer: const SideBar(),
        body: PaginationView<DiscussionResponse>(
          itemBuilder: (BuildContext context, DiscussionResponse discussion,
                  int index) =>
              Column(children: [
            ListTile(
              onTap: () {
                Discussion.instance.discussionId = discussion.id;
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          DiscussionPage(discussionId: discussion.id)),
                );
              },
              title: Padding(
                  padding: EdgeInsets.only(top: 6.0),
                  child: Text(discussion.title)),
              subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                        '${DateFormat.MMMM().format(discussion.createdAt)} ${discussion.createdAt.day}, ${discussion.createdAt.year} ${DateFormat('hh:mm a').format(discussion.createdAt)}'),
                    SizedBox(height: 6),
                    Text(discussion.body)
                  ]),
              leading: Padding(
                  padding: EdgeInsets.only(top: 10.0),
                  child: Icon(
                    Icons.forum,
                  )),
            ),
            Divider(color: Colors.grey)
          ]),
          paginationViewType: PaginationViewType.listView, // optional
          pageFetch: getDiscussions,
          pullToRefresh: true,
          onError: (dynamic error) => const Center(
            child: Text('Some error occured'),
          ),
          onEmpty: const Center(
            child: Text('Sorry! This is empty'),
          ),
          bottomLoader: const Center(
            // optional
            child: CircularProgressIndicator(),
          ),
          initialLoader: const Center(
            // optional
            child: CircularProgressIndicator(),
          ),
        ));
  }
}

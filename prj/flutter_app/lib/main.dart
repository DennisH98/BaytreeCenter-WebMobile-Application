import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/screens/discussion_page/discussion_page.dart';
import 'package:flutter_app/screens/discussions_page/discussions_page.dart';
import 'package:flutter_app/screens/dynamic_home_page/dynamic_home_page.dart';
import 'package:flutter_app/screens/landing_page/landing_screen.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'models/discussion.dart';
import 'services/backend/notification.dart';

Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print("Handling a background message");
}

Future main() async {
  await dotenv.load(fileName: ".env");
  await Firebase.initializeApp();
  await NotificationService.instance.initializeNotifications();
  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.lightGreen,
        scaffoldBackgroundColor: Colors.green[50],
      ),
      onGenerateRoute: (settings) {
        // If you push the PassArguments route
        if (settings.name == '/discussions') {
          return MaterialPageRoute(
            builder: (context) {
              return DiscussionsPage();
            },
          );
        } else if (settings.name == "/landing_screen") {
          return MaterialPageRoute(
            builder: (context) {
              return LandingPage();
            },
          );
        } else if (settings.name == "/discussion") {
          return MaterialPageRoute(
            builder: (context) {
              return DiscussionPage(
                discussionId: Discussion.instance.discussionId,
              );
            },
          );
        }
        assert(false, 'Need to implement ${settings.name}');
        return null;
      },
      home: const DynamicHomePage(),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/screens/login_page/login_page.dart';
import 'package:flutter_app/screens/landing_page/landing_screen.dart';
import 'package:flutter_app/utils/storage_keys.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_app/screens/loading_page/loading_page.dart';
import 'package:http/http.dart' as http;

class DynamicHomePage extends StatefulWidget {
  const DynamicHomePage({Key? key}) : super(key: key);

  @override
  _DynamicHomePageState createState() => _DynamicHomePageState();
}

class _DynamicHomePageState extends State<DynamicHomePage> {
  final Future<String?> _tokenFuture = SecureStorage.getValue(StorageKeys.authToken);
  final Future<String?> minLoadPeriod = Future.delayed(const Duration(seconds: 1));

  //initialize first, data loaded on dashboard
  MentorAccount mentorAcc = MentorAccount();

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String?>>(
        future: Future.wait<String?>(<Future<String?>>[_tokenFuture, minLoadPeriod]),
        builder: (BuildContext context, AsyncSnapshot<List<String?>> snapshot) {

          if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasData && snapshot.data?[0] != null) {
              return const LandingPage();
            } else {
              return const LoginPage();
            }
          } else {
            return const LoadingPage();
          }
        });
  }
}

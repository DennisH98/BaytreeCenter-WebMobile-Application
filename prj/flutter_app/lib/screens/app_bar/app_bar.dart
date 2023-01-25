import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_app/screens/discussions_page/discussions_page.dart';
import 'package:flutter_app/screens/landing_page/side_bar.dart';

// rename to something else?
class CustomAppBar extends AppBar {
  CustomAppBar(
      {required BuildContext context,
      String title = 'Baytree Centre',
      CustomAppBarButton? button,
      Key? key})
      : super(
          key: key,
          backgroundColor: Colors.green[100],
          title: Text(title),
          centerTitle: true,
          automaticallyImplyLeading: true,
          actions: <Widget>[(button != null) ? button : Container(height: 0)],
        );
}

Scaffold CustomAppBar_withLoadingIndicator(BuildContext context, String title) {
  return Scaffold(
      appBar: CustomAppBar(context: context, title: title),
      body: const Center(
        child: CircularProgressIndicator(),
      ));
}

class CustomAppBarButton extends ElevatedButton {
  CustomAppBarButton(
      {required String title, required VoidCallback callback, Key? key})
      : super(
            key: key,
            child: Text(title),
            onPressed: callback,
            style: ElevatedButton.styleFrom(
                primary: Colors.green[100],
                elevation: 10,
                textStyle: const TextStyle(fontWeight: FontWeight.bold)));
}

class CustomSliverAppBar extends SliverAppBar {
  CustomSliverAppBar(
      {required double top, Key? key, required BuildContext context})
      : super(
            key: key,
            actions: [
              Padding(
                  padding: EdgeInsets.only(right: 20.0),
                  child: GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const DiscussionsPage()),
                      );
                    },
                    child: Icon(
                      Icons.forum,
                      size: 26.0,
                    ),
                  ))
            ],
            backgroundColor: Colors.green[100],
            expandedHeight: 200.0,
            floating: true,
            pinned: true,
            flexibleSpace: LayoutBuilder(
                builder: (BuildContext context, BoxConstraints constraints) {
              var top = constraints.biggest.height;
              double statusBarHeight = MediaQuery.of(context).padding.top;

              double titleOpacity(double top, double statusBarHeight) {
                if (top == (statusBarHeight + kToolbarHeight)) {
                  return 1.0;
                } else {
                  return 0.0;
                }
              }

              return FlexibleSpaceBar(
                  centerTitle: true,
                  title: AnimatedOpacity(
                      duration: const Duration(milliseconds: 100),
                      opacity: titleOpacity(top, statusBarHeight),
                      child: Text(
                        "Baytree Companion App",
                      )),
                  background: Padding(
                      padding: EdgeInsets.only(top: statusBarHeight),
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Image.asset('assets/images/baytree-logo.png',
                                width: 125, fit: BoxFit.fill),
                          ])));
            }));
}

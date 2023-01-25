import "package:flutter/material.dart";

class LoadingPage extends StatelessWidget {
  const LoadingPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
            alignment: const Alignment(0.0, 0.0),
            margin: const EdgeInsets.all(16.0),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Container(
                    height: 300,
                    width: 200,
                    decoration: const BoxDecoration(
                      image: DecorationImage(
                          image: AssetImage('assets/images/baytree-logo.png'),
                          fit: BoxFit.contain),
                    ),
                  ),
                  const SizedBox(
                    height: 60,
                  ),
                  const CircularProgressIndicator(),
                ]))
        // )
        // Image.asset('assets/images/baytree-logo.png'),
        //
        );
  }
}

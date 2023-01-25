import "package:flutter/material.dart";
import 'package:flutter_app/services/backend/mentor_service.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({Key? key}) : super(key: key);

  @override
  _ForgotPasswordPageState createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _formKey = GlobalKey<FormState>();

  final _emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Forgot Your Password?"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
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
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Padding(
                    padding: EdgeInsets.only(top: 15.0, bottom: 2.0),
                    child: Text("Please enter the email used to log into the app",
                      style: TextStyle(
                        color: Colors.black54,
                        fontWeight: FontWeight.w600,
                        fontStyle: FontStyle.italic,
                        fontSize: 15),
                      )
                  )
                ),
                TextFormField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    border: UnderlineInputBorder(), labelText: "Email",
                    prefixIcon: Icon(Icons.alternate_email_outlined , color: Colors.lightGreen)
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Please enter your email.";
                    } else {
                      return null;
                    }
                  }
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  child: ElevatedButton(
                    onPressed: () async {
                      ScaffoldMessenger.of(context).hideCurrentSnackBar();

                      if (_formKey.currentState!.validate()) {
                        bool requestMade = await MentorService.resetPassword(_emailController.text);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Sending request...")),
                        );
                        if (requestMade) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                "Password reset request was made. Please check your email for details."
                              )
                            )
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                "Password reset request was not able to be made."
                              )
                            )
                          );
                        }
                      }
                    },
                    child: const Text("Request Password Reset", style: TextStyle(color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 13),
                      textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      )
    );
  }
}

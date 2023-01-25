import "package:flutter/material.dart";
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/screens/forgot_password_page/forgot_password_page.dart';
import 'package:flutter_app/screens/landing_page/landing_screen.dart';
import 'package:flutter_app/services/backend/mentor_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();

  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Log Into App"),
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
                TextFormField(
                  controller: _usernameController,
                  decoration: const InputDecoration(
                    border: UnderlineInputBorder(), labelText: "Username or Email",
                    prefixIcon: Icon(Icons.account_circle_outlined, color: Colors.lightGreen)
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Please enter your username or email.";
                    } else {
                      return null;
                    }
                  }
                ),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration:  const InputDecoration(
                    border: UnderlineInputBorder(), labelText: "Password",
                    prefixIcon: Icon(Icons.lock_outline, color: Colors.lightGreen)
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Please enter your password.";
                    } else {
                      return null;
                    }
                  },
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 16.0),
                  child: InkWell(
                    onTap: () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const ForgotPasswordPage()));
                    },
                    child: const Text("Forgot Password?",
                      style: TextStyle(
                          color: Colors.black54,
                          fontWeight: FontWeight.w600,
                          fontStyle: FontStyle.italic,
                          fontSize: 15,
                          decoration: TextDecoration.underline,
                      ),
                    )
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 30.0),
                  child: ElevatedButton(
                    onPressed: () async {
                      ScaffoldMessenger.of(context).hideCurrentSnackBar();

                      if (_formKey.currentState!.validate()) {
                        bool loggedIn = await MentorService.login(
                            _usernameController.text, _passwordController.text);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Logging in...")),
                        );
                        if (loggedIn) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => const LandingPage()),
                          );
                          ScaffoldMessenger.of(context).hideCurrentSnackBar();
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text("Unable to log in.")));
                        }
                      }
                    },
                    child: const Text("Log In",  style: TextStyle(color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 130, vertical: 13),
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

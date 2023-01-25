import 'package:flutter/material.dart';

Future<bool?> showCancelSessionDialog(BuildContext context) async {
  return showDialog<bool>(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: const Text("Cancel the Session?"),
        content: const Text("All progress will be lost."),
        actions: <Widget>[
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("No")),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text("Yes"))
        ],
      );
    }
  );
}

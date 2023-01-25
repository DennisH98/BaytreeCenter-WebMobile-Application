import 'package:intl/intl.dart';

class Questionnaire {
  final int id;
  String name;
  DateTime lastSubmit;

  Questionnaire(
      {required this.id, required this.name, required this.lastSubmit
        });

  Questionnaire.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        name = json['name'],
        lastSubmit = DateTime.parse(json['lastSubmit']);

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'lastSubmit': DateFormat('yyyy-MM-dd').format(lastSubmit)
    };
  }
}

class Question {
  final int QuestionID;
  final String question;
  final String inputType;
  final String validation;
  final String enabled;
  final String order;

  Question({
    required this.QuestionID,
    required this.question,
    required this.inputType,
    required this.validation,
    required this.enabled,
    required this.order,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      QuestionID: json['QuestionID'],
      question: json['Question'],
      inputType: json['inputType'],
      validation: json['validation'],
      enabled: json['enabled'],
      order: json['order'],
    );
  }

  static String getQuestionType(Question qn) {
    if (qn.inputType == 'text') {
      return "text";
    } else if (qn.inputType == 'number') {
      if (qn.validation.contains('range[1,12]')) {
        return "month";
      } else if (qn.validation.contains('range[1,5]')) {
        return "rating";
      }
    }
    else {
      return "unknown";
    }
    return "error";
  }
}

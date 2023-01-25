class SessionAttendance {
  final int sessionID;
  final int sessionGroupID;
  final String title;
  final String type;
  final DateTime startDate;
  final Duration duration;
  final int participantID;
  final bool attended;

  SessionAttendance({
    required this.sessionID, 
    required this.sessionGroupID, 
    required this.title, 
    required this.type,
    required this.startDate, 
    required this.duration, 
    required this.participantID, 
    required this.attended
  });

  factory SessionAttendance.fromJson(Map<String, dynamic> json) {

    return SessionAttendance(
      sessionID: int.parse(json['SessionID']),
      sessionGroupID: int.parse(json['SessionGroupID']),
      title: json['Title'] as String,
      type: json['Type'] as String,
      startDate: DateTime.parse(json['StartDate'].substring(0, 10)),
      duration: Duration(
        hours: int.parse(json['Duration'].substring(0, 2)),
        minutes: int.parse(json['Duration'].substring(3, 5)),
      ),
      participantID: json['ParticipantID'],
      attended: json['Status'] == "Attended" ? true : false
    );
  }
}
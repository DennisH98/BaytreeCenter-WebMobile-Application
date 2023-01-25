class Goal {
  final int menteeId;
  DateTime startDate;
  DateTime endDate;
  String type;
  String name;
  String curr;
  String end;
  String description;

  Goal(
      {required this.menteeId,
      required this.startDate,
      required this.endDate,
      required this.type,
      required this.name,
      required this.curr,
      required this.end,
      required this.description});
}

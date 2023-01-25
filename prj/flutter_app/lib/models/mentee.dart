class Mentee {
  final String? documentID;
  final int viewsID;
  final String fName;
  final String lName;

  Mentee({
    required this.viewsID, 
    required this.fName, 
    required this.lName,
    this.documentID
  });

  Mentee.fromJson({required Map<String, dynamic> jsonObj}) :
    documentID = jsonObj["_id"].toString(),
    viewsID = int.parse(jsonObj["viewsId"]),
    fName = jsonObj["firstName"],
    lName = jsonObj["lastName"];
  

  static List<Mentee> jsonMenteeListToMenteeList({required List<dynamic> jsonMenteesList}) {
    
    List<Mentee> mentees = [];
    
    try {
      jsonMenteesList.forEach((mapElement) {
        Mentee mentee = Mentee.fromJson(jsonObj: mapElement);
        mentees.add(mentee);
      });
    } on Exception {
      throw Exception("Bad data format");
    }
    
    return mentees;
  }
}

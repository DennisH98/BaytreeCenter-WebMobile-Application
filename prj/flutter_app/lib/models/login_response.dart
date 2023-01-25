class LoginResponse {
  final String mentorAccountId;
  final String token;
  final String viewsId;

  LoginResponse(
      {required this.mentorAccountId,
      required this.token,
      required this.viewsId});

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      mentorAccountId: json["mentorAccountId"] as String,
      token: json["token"] as String,
      viewsId: json["viewsId"] as String,
    );
  }
}

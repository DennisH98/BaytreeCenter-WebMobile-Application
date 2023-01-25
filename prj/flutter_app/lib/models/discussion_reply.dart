class DiscussionReplyResponse {
  final String authorMentorAccountId;
  final String author;
  final String body;
  final DateTime createdAt;

  DiscussionReplyResponse(
      {required this.authorMentorAccountId,
      required this.author,
      required this.body,
      required this.createdAt});

  factory DiscussionReplyResponse.fromJson(Map<String, dynamic> json) {
    return DiscussionReplyResponse(
        authorMentorAccountId: json["authorMentorAccountId"],
        author: json["author"],
        body: json["body"],
        createdAt: DateTime.parse(json["createdAt"]));
  }
}

class DiscussionReplyRequest {
  final String authorMentorAccountId;
  final String author;
  final String body;

  DiscussionReplyRequest({
    required this.authorMentorAccountId,
    required this.author,
    required this.body,
  });

  static Map<String, dynamic> toJson(DiscussionReplyRequest discussionRequest) {
    return {
      "authorMentorAccountId": discussionRequest.authorMentorAccountId,
      "author": discussionRequest.author,
      "body": discussionRequest.body,
    };
  }
}

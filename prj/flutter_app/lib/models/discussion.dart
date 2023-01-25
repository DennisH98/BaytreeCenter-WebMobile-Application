import 'package:flutter_app/models/discussion_reply.dart';

class DiscussionResponse {
  final String id;
  final List<String> mentorTypes;
  final List<String> mentorAccountIds;
  final DateTime createdAt;
  final String title;
  final String body;
  final List<DiscussionReplyResponse> replies;

  DiscussionResponse({
    required this.id,
    required this.mentorTypes,
    required this.mentorAccountIds,
    required this.createdAt,
    required this.title,
    required this.body,
    required this.replies,
  });

  factory DiscussionResponse.fromJson(Map<String, dynamic> json) {
    return DiscussionResponse(
        id: json["id"],
        mentorTypes: json["mentorTypes"].cast<String>(),
        mentorAccountIds: json["mentorAccountIds"].cast<String>(),
        createdAt: DateTime.parse(json["createdAt"]),
        title: json["title"],
        body: json["body"],
        replies: json["replies"]
            .map((replyJson) => DiscussionReplyResponse.fromJson(replyJson))
            .toList()
            .cast<DiscussionReplyResponse>());
  }
}

class DiscussionRequest {
  final String? id;
  final List<String>? mentorTypes;
  final List<String>? mentorAccountIds;
  final DateTime? createdAt;
  final String? title;
  final String? body;
  final List<DiscussionReplyRequest>? replies;

  DiscussionRequest({
    this.id,
    this.mentorTypes,
    this.mentorAccountIds,
    this.createdAt,
    this.title,
    this.body,
    this.replies,
  });

  static Map<String, dynamic> toJson(DiscussionRequest discussionRequest) {
    return {
      "id": discussionRequest.id,
      "mentorTypes": discussionRequest.mentorTypes,
      "mentorAccountIds": discussionRequest.mentorAccountIds,
      "createdAt": discussionRequest.createdAt,
      "firstName": discussionRequest.title,
      "lastName": discussionRequest.body,
      "replies": discussionRequest.replies?.map((discussionReplyRequest) =>
          DiscussionReplyRequest.toJson(discussionReplyRequest))
    };
  }
}

class Discussion {
  late String discussionId;

  static final Discussion _inst = Discussion._internal();

  static get instance {
    return _inst;
  }

  Discussion._internal();

  factory Discussion() {
    return _inst;
  }
}

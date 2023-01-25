import 'dart:convert';

import 'package:flutter_app/models/discussion.dart';
import 'package:flutter_app/models/discussion_reply.dart';

import 'api_services.dart';
import 'endpoints.dart';

class DiscussionService {
  static DiscussionService? _instance;
  DiscussionService._internal();
  static DiscussionService get instance =>
      _instance ??= DiscussionService._internal();

  Future<List<DiscussionResponse>> getDiscussions(
      {int? offset, int? limit, Map<String, dynamic>? filters}) async {
    filters = filters ?? {};

    if (offset != null) {
      filters["offset"] = [offset.toString()];
    }

    if (limit != null) {
      filters["limit"] = [limit.toString()];
    }

    String queryString =
        BackendAPIRequester.getUrlQueryString(queryParams: filters);

    var response = await BackendAPIRequester.getRequest(
        endpoint: Endpoints.DISCUSSIONS, parameters: queryString);

    var responseObjects = json.decode(response.body)["data"] as List<dynamic>;

    return responseObjects
        .map((responseObj) => DiscussionResponse.fromJson(responseObj))
        .toList();
  }

  Future<void> addReply(DiscussionReplyRequest discussionReplyRequest,
      String discussionId) async {
    await BackendAPIRequester.postRequest(
        endpoint: "${Endpoints.DISCUSSIONS}/addReply/$discussionId",
        objDataMap: DiscussionReplyRequest.toJson(discussionReplyRequest));
  }
}

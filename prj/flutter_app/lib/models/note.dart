import 'package:flutter_app/utils/response_parser.dart';

class Note {
  final int? noteId;
  final String? note;
  final int? private;
  final String? type;
  final int? typeId;
  final DateTime? created;
  final String? createdBy;
  final DateTime? updated;
  final String? updatedBy;
  final DateTime? date;
  final String? snippet;

  Note(
      {this.noteId,
      required this.note,
      this.private,
      this.type,
      this.typeId,
      this.created,
      this.createdBy,
      this.updated,
      this.updatedBy,
      this.date,
      this.snippet});

  factory Note.fromJson(Map<String, dynamic> json) {
    return Note(
        noteId: ResponseParser.toInt(json['NoteId']),
        note: ResponseParser.toStringNullSafe(json['Note']),
        private: ResponseParser.toInt(json['Private']),
        type: ResponseParser.toStringNullSafe(json['Type']),
        typeId: ResponseParser.toInt(json['TypeId']),
        created: ResponseParser.toDateTime(json['Created']),
        createdBy: ResponseParser.toStringNullSafe(json['CreatedBy']),
        updated: ResponseParser.toDateTime(json['Updated']),
        updatedBy: ResponseParser.toStringNullSafe(json['UpdatedBy']),
        date: ResponseParser.toDateTime(json['Date']),
        snippet: ResponseParser.toStringNullSafe(json['Snippet']));
  }
}

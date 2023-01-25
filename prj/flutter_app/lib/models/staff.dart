import 'package:flutter_app/utils/response_parser.dart';

class Staff {
  final int? personId;
  final DateTime? created;
  final String? createdBy;
  final DateTime? updated;
  final String? updatedBy;
  final DateTime? archived;
  final String? archivedBy;
  final bool? restrictedRecord;
  final String? forename;
  final String? surname;
  final DateTime? dateOfBirth;
  final int? age;
  final String? gender;
  final String? address1;
  final String? address2;
  final String? county;
  final String? town;
  final String? postalCode;
  final String? mobile;
  final String? telephone;
  final String? email;
  final String? type;
  final String? typeName;

  Staff(
      {this.personId,
      this.created,
      this.createdBy,
      this.updated,
      this.updatedBy,
      this.archived,
      this.archivedBy,
      this.restrictedRecord,
      required this.forename,
      this.surname,
      this.dateOfBirth,
      this.age,
      this.gender,
      this.address1,
      this.address2,
      this.county,
      this.town,
      this.postalCode,
      this.mobile,
      this.telephone,
      this.email,
      this.type,
      this.typeName});

  factory Staff.fromJson(Map<String, dynamic> json) {
    return Staff(
        personId: ResponseParser.toInt(json['PersonId']),
        created: ResponseParser.toDateTime(json['Created']),
        createdBy: ResponseParser.toStringNullSafe(json['CreatedBy']),
        updated: ResponseParser.toDateTime(json['Updated']),
        updatedBy: ResponseParser.toStringNullSafe(json['UpdatedBy']),
        archived: ResponseParser.toDateTime(json['Archived']),
        archivedBy: ResponseParser.toStringNullSafe(json['ArchivedBy']),
        restrictedRecord: ResponseParser.toBool(['RestrictedRecord']),
        forename: ResponseParser.toStringNullSafe(json['Forename']),
        surname: ResponseParser.toStringNullSafe(json['Surname']),
        dateOfBirth: ResponseParser.toDateTime(json['DateOfBirth']),
        age: ResponseParser.toInt(json['Age']),
        gender: ResponseParser.toStringNullSafe(json['Gender']),
        address1: ResponseParser.toStringNullSafe(json['Address1']),
        address2: ResponseParser.toStringNullSafe(json['Address2']),
        county: ResponseParser.toStringNullSafe(json['County']),
        town: ResponseParser.toStringNullSafe(json['Town']),
        postalCode: ResponseParser.toStringNullSafe(json['PostalCode']),
        mobile: ResponseParser.toStringNullSafe(json['Mobile']),
        telephone: ResponseParser.toStringNullSafe(json['Telephone']),
        email: ResponseParser.toStringNullSafe(json['Email']),
        type: ResponseParser.toStringNullSafe(json['Type']),
        typeName: ResponseParser.toStringNullSafe(json['TypeName']));
  }
}

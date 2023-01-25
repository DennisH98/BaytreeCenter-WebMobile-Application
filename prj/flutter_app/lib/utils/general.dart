import 'package:flutter/material.dart';

extension DateTimeExtension on DateTime {
  DateTime next(int day) {
    return this.add(
      Duration(
        days: (day - this.weekday) % DateTime.daysPerWeek,
      ),
    );
  }
}

double timeOfDayToDouble(TimeOfDay timeOfDay) => timeOfDay.hour + timeOfDay.minute/60.0;

int compareToTime(DateTime thisTime, DateTime otherTime, DateTime timeNow) {
  double thisTimeOfSession =
      timeOfDayToDouble(TimeOfDay.fromDateTime(thisTime));
  double otherTimeOfSession =
      timeOfDayToDouble(TimeOfDay.fromDateTime(otherTime));
  double timeOfDayNow = timeOfDayToDouble(TimeOfDay.fromDateTime(timeNow));

  if (thisTimeOfSession < timeOfDayNow && otherTimeOfSession > timeOfDayNow) {
    return 1;
  } else if (thisTimeOfSession > timeOfDayNow &&
      otherTimeOfSession < timeOfDayNow) {
    return -1;
  } else if ((thisTimeOfSession < timeOfDayNow &&
          otherTimeOfSession < timeOfDayNow) ||
      (thisTimeOfSession > timeOfDayNow &&
          otherTimeOfSession > timeOfDayNow)) {
    if (thisTimeOfSession < otherTimeOfSession) {
      return -1;
    } else if (thisTimeOfSession > otherTimeOfSession) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

int compareToWeekdays(
    int thisObjWeekday, int otherObjWeekday, int todayWeekday) {
  int thisDaysFromNow = thisObjWeekday - todayWeekday;
  int otherDaysFromNow = otherObjWeekday - todayWeekday;

  thisDaysFromNow =
      thisDaysFromNow < 0 ? thisDaysFromNow + 7 : thisDaysFromNow;
  otherDaysFromNow =
      otherDaysFromNow < 0 ? otherDaysFromNow + 7 : otherDaysFromNow;

  if (thisDaysFromNow < otherDaysFromNow) {
    return -1;
  } else if (thisDaysFromNow > otherDaysFromNow) {
    return 1;
  } else {
    return 0;
  }
}
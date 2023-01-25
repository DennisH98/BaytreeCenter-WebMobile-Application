import 'package:stop_watch_timer/stop_watch_timer.dart';

class CurrentSession {
  static CurrentSession? _instance;

  final StopWatchTimer stopWatch = StopWatchTimer();

  final List<String> activities = <String>[];

  late String menteeName;
  late String notes;
  late DateTime startTime;
  late int? _viewsSessionCreatedId;
  late bool _viewsParticipantCreated;
  late bool _viewsStaffCreated;
  late bool _viewsNotesCreated;

  static get instance {
    _instance ??= CurrentSession._internal();

    return _instance;
  }

  int? get viewsSessionCreatedId => _viewsSessionCreatedId;
  set viewsSessionCreatedId(val) => _viewsSessionCreatedId = val;

  bool get viewsParticipantCreated => _viewsParticipantCreated;
  set viewsParticipantCreated(val) => _viewsParticipantCreated = val;

  bool get viewsStaffCreated => _viewsStaffCreated;
  set viewsStaffCreated(val) => _viewsStaffCreated = val;

  bool get viewsNotesCreated => _viewsNotesCreated;
  set viewsNotesCreated(val) => _viewsNotesCreated = val;

  void resetSession() {
    menteeName = "";
    notes = "";
    startTime = DateTime.now();
    activities.clear();
    _viewsSessionCreatedId = null;
    _viewsParticipantCreated = false;
    _viewsStaffCreated = false;
    _viewsNotesCreated = false;
  }

  void pauseStopWatch() {
    stopWatch.onExecute.add(StopWatchExecute.stop);
  }

  void resetStopWatch() {
    stopWatch.onExecute.add(StopWatchExecute.stop);
    stopWatch.onExecute.add(StopWatchExecute.reset);
  }

  void startStopWatch() {
    stopWatch.onExecute.add(StopWatchExecute.start);
  }

  CurrentSession._internal();
}

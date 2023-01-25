import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_app/models/mentor_account.dart';
import 'package:flutter_app/services/backend/mentor_service.dart';
import 'package:flutter_app/utils/secure_storage.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static NotificationService? _instance;
  NotificationService._internal();
  static NotificationService get instance =>
      _instance ??= NotificationService._internal();

  late AndroidNotificationChannel notificationChannel;
  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();
  static const int notificationDurationSecs = 15;

  Future<void> _registerFCMTokenWithBackend(
      String mentorAccountId, String token) async {
    var mentorAccounts =
        await MentorService.getMentorAccounts(ids: [mentorAccountId]);
    if (mentorAccounts.isEmpty) {
      throw Exception("Could not find mentor account by id");
    } else {
      var mentorAccountTokens = mentorAccounts[0].fcmRegistrationTokens;
      if (!mentorAccountTokens.contains(token)) {
        await MentorService.putMentorAccounts([
          MentorAccountRequest(
              id: mentorAccountId,
              fcmRegistrationTokens: [...mentorAccountTokens, token])
        ]);
      }
    }
  }

  Future<bool> registerFCMTokenForMentorAccount(
      {required String mentorAccountId}) async {
    try {
      String? token = await FirebaseMessaging.instance.getToken();
      if (token != null) {
        await _registerFCMTokenWithBackend(mentorAccountId, token);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      flutterLocalNotificationsPlugin.show(
          1337,
          "Error",
          "Failed to register notifications for this device, please try again later.",
          NotificationDetails(
            android: AndroidNotificationDetails(
              notificationChannel.id,
              notificationChannel.name,
              channelDescription: notificationChannel.description,
              // other properties...
            ),
          ));

      return false;
    }
  }

  void registerOnMessageListener(AndroidNotificationChannel channel) {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
      RemoteNotification? notification = message.notification;
      AndroidNotification? android = message.notification?.android;

      // If `onMessage` is triggered with a notification, construct our own
      // local notification to show to users using the created channel.
      if (notification != null && android != null) {
        await flutterLocalNotificationsPlugin.show(
            notification.hashCode,
            notification.title,
            notification.body,
            NotificationDetails(
              android: AndroidNotificationDetails(channel.id, channel.name,
                  channelDescription: channel.description,
                  icon: "baytree_logo",
                  largeIcon: const DrawableResourceAndroidBitmap(
                      '@drawable/baytree_logo')
                  // other properties...
                  ),
            ));
      }
    });
  }

  Future<void> _onFcmTokenRefresh(String token) async {
    String? mentorAccountId = await SecureStorage.getValue("mentorAccountId");
    if (mentorAccountId != null) {
      registerFCMTokenForMentorAccount(mentorAccountId: mentorAccountId);
    }
  }

  Future<void> registerFCMTokenRefreshListener() async {
    FirebaseMessaging.instance.onTokenRefresh.listen(_onFcmTokenRefresh);
  }

  Future<AndroidNotificationChannel>
      createImportantNotificationChannel() async {
    const AndroidNotificationChannel channel = AndroidNotificationChannel(
      'high_importance_channel',
      'High Importance Notifications',
      description: 'This channel is used for important notifications.',
      importance: Importance.max,
    );

    final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
        FlutterLocalNotificationsPlugin();

    await flutterLocalNotificationsPlugin
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);

    return channel;
  }

  Future<void> initializePlatformNotificationSettings() async {
    FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
        FlutterLocalNotificationsPlugin();
    var initializationSettingsAndroid = const AndroidInitializationSettings(
        'baytree_logo'); // <- default icon name is @drawable/baytree_logo
    //var initializationSettingsIOS = IOSInitializationSettings(onDidReceiveLocalNotification: onDidReceiveLocalNotification);
    var initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);
    await flutterLocalNotificationsPlugin.initialize(initializationSettings);
  }

  Future<void> setForegroundPresentationOptions() async {
    await FirebaseMessaging.instance
        .setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  Future<void> initializeNotifications() async {
    await initializePlatformNotificationSettings();
    await setForegroundPresentationOptions();
    notificationChannel = await createImportantNotificationChannel();
    await registerFCMTokenRefreshListener();
    registerOnMessageListener(notificationChannel);
  }
}

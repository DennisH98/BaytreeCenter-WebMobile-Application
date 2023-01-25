import "package:flutter_secure_storage/flutter_secure_storage.dart";

class SecureStorage {
  static const _storage = FlutterSecureStorage();

  static Future setValue(String key, String value) async =>
    await _storage.write(key: key, value: value);

  static Future<String?> getValue(String key) async =>
    await _storage.read(key: key);

  static Future delete(String key) async =>
      await _storage.delete(key: key);

  static Future deleteAll() async => await _storage.deleteAll();
}

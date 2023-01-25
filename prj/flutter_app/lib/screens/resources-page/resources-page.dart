import 'package:url_launcher/url_launcher.dart';

launchResources() async {
  const url = 'https://thebaytreecentre.sharepoint.com/:f:/g/Ej7DxK0KjzNBuTwQ_lU-0bMB9bBeK8trNJlBPD8wCgPFAw?e=FjtYZ8';
  if (await canLaunch(url)) {
    await launch(url,
      forceWebView: true,
      enableJavaScript: true,
      enableDomStorage: true);
  } else {
    throw 'Could not launch $url';
  }
}
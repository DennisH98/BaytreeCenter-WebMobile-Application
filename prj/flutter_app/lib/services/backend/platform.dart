import 'dart:io' show Platform;

const urlIOS = "http://localhost:3000/api/";
const urlAndroid = "http://10.0.2.2:3000/api/";

String determinePlatform (){
  if(Platform.isAndroid){
    return urlAndroid;
  }
  else {
    return urlIOS;
  }
}
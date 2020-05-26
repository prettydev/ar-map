# arnav customer app

## build release version guide

1. android/app/build.gradle
   1. bundleInRelease: true
   2. enableHermes: false
2. command
   1. react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
3. android/app/src/main/res/
   1. delete drawable\*, raw directories
4. command
   1. cd android
   2. ./gradlew assembleRelease
5. android/app/build/outputs/apk/release
   1. could find release version apk.
6. What parts consumed my valuable times
   1. trial to remove unused packages from package.json, you may try it after build successfully.
      1. in my guess, it occurs import path error, still can't find correct reason, but was painful for me.
   2. enableHermes: true, this is the really bad option to set true.
   3. mis deleting mipmap directories, absolutely don't delete!
   4. mis setting of bundleInRelease: true, remember, never forgot!
   5. don't modify some app functions, it makes the problem more difficult.
      1. this project, i modified BottomNavTab, and didn't test it's behavior, so eventually modified again like the start point.

---

## ssl setting guide

1. yarn add react-native-ssl-pinning@latest
2. openssl s_client -showcerts -connect 106.53.75.202:8000
3. Copy the certificate (Usally the first one in the chain), and paste it using nano or other editor like so , nano mycert.pem
4. convert it to .cer with this command openssl x509 -in mycert.pem -outform der -out mycert.cer
5. iOS > drag mycert.cer to Xcode project, mark your target and 'Copy items if needed'
   Android > Place your .cer files under src/main/assets/.

---

## ios settings

brew install openssl

- cd /usr/local/include

ln -s ../opt/openssl/include/openssl

-cd ios

pod deintegrate
pod install

---

- periodical background notificatioin
- continuos connect, disconnect to the server
- test message list, detail
- add report logic
- ... ... ..

---

- get sha1
  keytool -list -v -keystore .\arnav.keystore -alias findstuffkey -storepass 123456 -keypass 123456

- generate debug.keystore
  keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000

- generate app icon sets

  https://easyappicon.com/

- bottom tab bar ref

  https://reactnavigation.org/docs/bottom-tab-navigator/

---

# gradle.properties

## error

- Where:
  Script 'F:\boss\ar-navigation\customer\node_modules\react-native-maps\lib\android\gradle-maven-push.gradle' line: 62

- What went wrong:
  A problem occurred configuring project ':react-native-maps'.

  > No such property: POM_DESCRIPTION for class: org.gradle.api.publication.maven.internal.pom.CustomModelBuilder

- Try:
  Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

- Get more help at https://help.gradle.org

## occurs error due to the following settings

MYAPP_UPLOAD_STORE_FILE=arnav.keystore
MYAPP_UPLOAD_KEY_ALIAS=findstuffkey
MYAPP_UPLOAD_STORE_PASSWORD=123456
MYAPP_UPLOAD_KEY_PASSWORD=123456

VERSION_NAME=1000.0.0-master
GROUP=com.facebook.react

POM_NAME=ReactNative
POM_ARTIFACT_ID=react-native
POM_PACKAGING=aar

MOCKITO_CORE_VERSION=2.19.1
POWERMOCK_VERSION=1.6.2
ROBOLECTRIC_VERSION=3.0
JUNIT_VERSION=4.12
FEST_ASSERT_CORE_VERSION=2.0M10

ANDROIDX_TEST_VERSION=1.1.0
FRESCO_VERSION=2.0.0
OKHTTP_VERSION=3.12.1
SO_LOADER_VERSION=0.8.2

BOOST_VERSION=1_63_0
DOUBLE_CONVERSION_VERSION=1.1.6
FOLLY_VERSION=2020.01.13.00
GLOG_VERSION=0.3.5

android.useAndroidX=true
android.enableJetifier=true
android.enableR8=false

---

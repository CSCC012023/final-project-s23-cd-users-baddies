import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io';

class LoginPage extends StatelessWidget {
  LoginPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextButton.icon(
              label: Text('Sign in with Google'),
              icon: Icon(Icons.login),
              onPressed: () async {
                final googleSignIn = GoogleSignIn(
                  clientId:
                      "CHANGE_WITH_PEROSNAL-1eol51mag25qg5883eqfailbt8l5eaut.apps.googleusercontent.com",
                );

                final googleUser = await googleSignIn.signIn();

                if (googleUser == null) return;

                final googleAuth = await googleUser.authentication;

                final credential = GoogleAuthProvider.credential(
                    accessToken: googleAuth.accessToken,
                    idToken: googleAuth.idToken);

                await FirebaseAuth.instance.signInWithCredential(credential);
                FirebaseFirestore db = FirebaseFirestore.instance;
                String uid = FirebaseAuth.instance.currentUser!.uid;
                db.collection("Users").doc(uid).set({
                  "Name": googleUser.displayName,
                  "lastLogin": DateTime.now().toString()
                });
              },
            ),
            TextButton.icon(
              label: Text('Sign in with Apple (only on iOS)'),
              icon: Icon(Icons.apple),
              onPressed: () async {
                if (!kIsWeb && Platform.isIOS) {
                  // Authenticate login
                  final credential = await SignInWithApple.getAppleIDCredential(
                    scopes: [
                      AppleIDAuthorizationScopes.email,
                      AppleIDAuthorizationScopes.fullName,
                    ],
                  );

                  final oAuthProvider = OAuthProvider('apple.com');

                  final newCred = oAuthProvider.credential(
                      accessToken: credential.authorizationCode,
                      idToken: credential.identityToken);

                  await FirebaseAuth.instance.signInWithCredential(newCred);
                } else {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: Text('Feature not available'),
                        content: Text(
                            'Sign in with Apple is only available on iOS.'),
                        actions: <Widget>[
                          TextButton(
                            child: Text('OK'),
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                          ),
                        ],
                      );
                    },
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}

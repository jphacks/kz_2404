"use client"
import { getAuth, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useEffect } from "react";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_APPID
};

const provider = new GoogleAuthProvider();
async function signUp() {
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      // TODO ユーザのDB登録
      fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }).then((res) => {
        if (res.ok) {
          localStorage.setItem("userID", user.uid);

          window.location.href = "/";
        } else {
          throw new Error('ユーザー登録に失敗');
        }
      })

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}
export const LoginButton = () => {
    const app = initializeApp(firebaseConfig);

    useEffect(() => {
      if (localStorage.getItem("userID")) {
        console.log(localStorage.getItem("userID"));
      }
    }, []);

    return (
        <div>
            <button onClick={signUp}>SignUp</button>
        </div>
    )
}

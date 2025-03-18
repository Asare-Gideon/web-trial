import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebase/config";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableSignup, setDisableSignup] = useState(true);
  const router = useRouter();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(FIREBASE_AUTH);
  const [userInfo, Stateloading, stateError] = useAuthState(FIREBASE_AUTH);

  useEffect(() => {
    email !== "" && password !== ""
      ? setDisableSignup(false)
      : setDisableSignup(true);
  }, [name, email, password]);

  const handleLogin = (e: Event) => {
    e.preventDefault();
    if (!disableSignup) {
      signInWithEmailAndPassword(email, password);
    }
  };

  useEffect(() => {
    if (userInfo) {
      router.replace("/");
    }
  });

  return (
    <div className="flex justify-center">
      <div className="flex h-screen w-full max-w-[1200px] bg-gray200">
        {/* Left Pane */}
        {/* <div className="hidden lg:flex items-center relative justify-center flex-1 bg-white text-black">
          <Image src={img} alt="img" className="h-screen w-full" />
        </div> */}
        {/* Right Pane */}

        <div className="w-full bg-gray-100  flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <h1 className="text-3xl font-semibold mb-6 text-black text-center">
              Login
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Login to purchase courses{" "}
            </h1>

            <form action="#" method="POST" className="space-y-4">
              {/* Your form elements go here */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                  id="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword((e.target as HTMLInputElement).value)
                  }
                  id="password"
                  name="password"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <button
                  disabled={disableSignup}
                  onClick={(e) => handleLogin(e as any)}
                  type="submit"
                  className={`w-full ${
                    disableSignup
                      ? "bg-gray400 opacity-20 cursor-not-allowed"
                      : "bg-black"
                  } text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300`}
                >
                  {loading ? "signing up...." : "Sign Up"}
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Already have an account?{" "}
                <Link href="/signup" className="text-black hover:underline">
                  create account
                </Link>
              </p>
              {error && (
                <span className="text-red text-sm font-semibold">
                  {error.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

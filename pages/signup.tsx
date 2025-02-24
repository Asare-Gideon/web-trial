import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebase/config";
const img = require("../public/bg-img/signup2.jpg");
import {
  useCreateUserWithEmailAndPassword,
  useAuthState,
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

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disableSignup, setDisableSignup] = useState(true);
  const router = useRouter();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(FIREBASE_AUTH);
  const [userInfo, Stateloading, stateError] = useAuthState(FIREBASE_AUTH);

  useEffect(() => {
    name !== "" && email !== "" && password !== ""
      ? setDisableSignup(false)
      : setDisableSignup(true);
  }, [name, email, password]);

  const handleSignup = (e: Event) => {
    e.preventDefault();
    if (!disableSignup) {
      createUserWithEmailAndPassword(email, password);
    }
  };

  const handleAddUser = async (emial: string) => {
    await setDoc(doc(FIREBASE_DB, "users", emial), {
      date: serverTimestamp(),
      name: name,
      email: email,
    });
    router.replace("/");
  };

  useEffect(() => {
    if (user) {
      handleAddUser(user?.user.email as any);
    }
  }, [user]);

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
              Sign Up
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Sign up to purchase courses{" "}
            </h1>

            <form action="#" method="POST" className="space-y-4">
              {/* Your form elements go here */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName((e.target as HTMLInputElement).value)
                  }
                  id="username"
                  name="username"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
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
                  onClick={(e) => handleSignup(e as any)}
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
                <Link href="/signin" className="text-black hover:underline">
                  Login here
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

export default Signup;

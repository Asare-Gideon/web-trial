import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FIREBASE_AUTH } from "@/firebase/config";

const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const [user, loading, error] = useAuthState(FIREBASE_AUTH);

  return <div>AuthCheck</div>;
};

export default AuthCheck;

"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const LoginPage: React.FC = (e) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();

  const token = session?.user?.accesstoken;
  const refreshToken = async () => {
    try {
      console.log(1);
      const authToken = Cookies.get("auth_token");
      if (authToken) {
        const response = await fetch("/api/users/refreshtoken", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const newToken = data.newToken;

          Cookies.set("auth_token", newToken, {
            expires: 300 / (24 * 60 * 60),
          });
        } else {
          console.error("Failed to refresh token");
        }
      } else {
        console.error("Auth token not found in cookies");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
    });

    if (result?.error) {
      console.error(result.error);
    } else {
      setLoading(false);
      const token = session?.user?.accesstoken;
      if (token) {
        const expirationTimeInSeconds = 300;
        Cookies.set("auth_token", token, {
          expires: expirationTimeInSeconds / (24 * 60 * 60),
        });
        resetToken();
        // alert("/profile");
        // router.push("/profile");
      }
    }
  };

  const resetToken = async () => {
    console.log("resetToken called");
    setInterval(() => {
      refreshToken();
    }, 40000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

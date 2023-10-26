"use client";
import axios from "axios";

function refreshToken(token: string, expirationTime: number): void {
  setTimeout(() => {
    axios
      .post("http://localhost:3000/api/users/refreshtoken", { token })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, expirationTime);
}

export default refreshToken;

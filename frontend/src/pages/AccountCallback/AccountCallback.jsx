import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  exchangeCodeForToken,
} from "../../services/customerAuth";

function AccountCallback() {
  const navigate = useNavigate();

  const [message, setMessage] =
    useState("Signing you in...");

  useEffect(() => {
    async function handleCallback() {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const code = params.get("code");
        const returnedState = params.get("state");

        const savedState = localStorage.getItem(
          "shopify_auth_state"
        );

        const error = params.get("error");

        if (error) {
          throw new Error(
            params.get("error_description") ||
            "Authentication was cancelled."
          );
        }

        if (!code) {
          throw new Error(
            "No authorization code received."
          );
        }

        if (
          !returnedState ||
          returnedState !== savedState
        ) {
          throw new Error(
            "Invalid authentication state."
          );
        }

        setMessage(
          "Completing your sign in..."
        );

        await exchangeCodeForToken(code);

        setMessage(
          "Signed in successfully!"
        );

        setTimeout(() => {
          navigate("/account");
        }, 800);

      } catch (error) {
        console.error(error);

        setMessage(
          error.message ||
          "Unable to sign you in."
        );
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <main className="account-callback-page">
      <div className="account-callback-container">
        <p>{message}</p>
      </div>
    </main>
  );
}

export default AccountCallback;
const SHOP_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;

// Your Customer Account API Client ID
const CLIENT_ID = import.meta.env.VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;

const REDIRECT_URI = "https://www.mannzariya.com/account/callback";


function generateRandomString(length = 64) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const array = new Uint8Array(length);

  crypto.getRandomValues(array);

  return Array.from(array)
    .map((value) => characters[value % characters.length])
    .join("");
}


async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();

  const data = encoder.encode(verifier);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return btoa(
    String.fromCharCode(...new Uint8Array(digest))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}


export async function loginCustomer() {
  try {
    const response = await fetch(
      `https://${SHOP_DOMAIN}/.well-known/openid-configuration`
    );

    if (!response.ok) {
      throw new Error("Unable to load Shopify authentication configuration");
    }

    const config = await response.json();

    const verifier = generateRandomString();

    const challenge =
      await generateCodeChallenge(verifier);

    const state = generateRandomString(32);

    localStorage.setItem(
      "shopify_code_verifier",
      verifier
    );

    localStorage.setItem(
      "shopify_auth_state",
      state
    );

    const authorizationUrl = new URL(
      config.authorization_endpoint
    );

    authorizationUrl.searchParams.set(
      "scope",
      "openid email customer-account-api:full"
    );

    authorizationUrl.searchParams.set(
      "client_id",
      CLIENT_ID
    );

    authorizationUrl.searchParams.set(
      "response_type",
      "code"
    );

    authorizationUrl.searchParams.set(
      "redirect_uri",
      REDIRECT_URI
    );

    authorizationUrl.searchParams.set(
      "state",
      state
    );

    authorizationUrl.searchParams.set(
      "code_challenge",
      challenge
    );

    authorizationUrl.searchParams.set(
      "code_challenge_method",
      "S256"
    );

    window.location.href =
      authorizationUrl.toString();

  } catch (error) {
    console.error("Login failed:", error);
  }
}

export async function exchangeCodeForToken(code) {
  const verifier = localStorage.getItem(
    "shopify_code_verifier"
  );

  if (!verifier) {
    throw new Error(
      "Login session expired. Please try signing in again."
    );
  }

  // Discover Shopify's current token endpoint
  const discoveryResponse = await fetch(
    `https://${SHOP_DOMAIN}/.well-known/openid-configuration`
  );

  if (!discoveryResponse.ok) {
    throw new Error(
      "Unable to load Shopify authentication configuration."
    );
  }

  const config = await discoveryResponse.json();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: verifier,
  });

  const response = await fetch(config.token_endpoint, {
    method: "POST",

    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },

    body,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Shopify token error:", data);

    throw new Error(
      data.error_description ||
      data.error ||
      "Unable to complete sign in."
    );
  }

  // Store authentication data locally for now
  localStorage.setItem(
    "shopify_customer_access_token",
    data.access_token
  );

  localStorage.setItem(
    "shopify_customer_id_token",
    data.id_token
  );

  if (data.refresh_token) {
    localStorage.setItem(
      "shopify_customer_refresh_token",
      data.refresh_token
    );
  }

  const expiresAt =
    Date.now() + data.expires_in * 1000;

  localStorage.setItem(
    "shopify_customer_token_expires_at",
    expiresAt.toString()
  );

  // Clean up one-time PKCE values
  localStorage.removeItem(
    "shopify_code_verifier"
  );

  localStorage.removeItem(
    "shopify_auth_state"
  );

  return data;
}

export async function getCustomer() {
  const accessToken = localStorage.getItem(
    "shopify_customer_access_token"
  );

  if (!accessToken) {
    throw new Error("You are not signed in.");
  }

  const response = await fetch(
    `https://${SHOP_DOMAIN}/.well-known/customer-account-api`
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load Customer Account API configuration."
    );
  }

  const config = await response.json();

    const query = `
    query GetCustomer {
        customer {
        id
        firstName
        lastName

        emailAddress {
            emailAddress
        }

        phoneNumber {
            phoneNumber
        }

        orders(first: 20) {
        edges {
            node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus

            cancelledAt
            cancelReason

            totalPrice {
                amount
                currencyCode
            }

            lineItems(first: 20) {
                edges {
                node {
                    title
                    quantity
                }
                }
            }
            }
        }
        }
        }
    }
    `;

  const customerResponse = await fetch(
    config.graphql_api,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },

      body: JSON.stringify({
        query,
      }),
    }
  );

  const data = await customerResponse.json();

  if (!customerResponse.ok || data.errors) {
    console.error(
      "Customer API Error:",
      data
    );

    throw new Error(
      data.errors?.[0]?.message ||
        "Unable to load customer account."
    );
  }

  return data.data.customer;
}

export async function logoutCustomer() {
  const idToken = localStorage.getItem(
    "shopify_customer_id_token"
  );

  // Clear local app session first
  localStorage.removeItem(
    "shopify_customer_access_token"
  );

  localStorage.removeItem(
    "shopify_customer_refresh_token"
  );

  localStorage.removeItem(
    "shopify_customer_token_expires_at"
  );

  localStorage.removeItem(
    "shopify_auth_state"
  );

  localStorage.removeItem(
    "shopify_code_verifier"
  );

  if (!idToken) {
    localStorage.removeItem(
      "shopify_customer_id_token"
    );

    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch(
      `https://${SHOP_DOMAIN}/.well-known/openid-configuration`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to load Shopify authentication configuration."
      );
    }

    const config = await response.json();

    const logoutUrl = new URL(
      config.end_session_endpoint
    );

    logoutUrl.searchParams.set(
      "id_token_hint",
      idToken
    );

    logoutUrl.searchParams.set(
      "post_logout_redirect_uri",
      window.location.origin
    );

    // Remove local ID token before leaving
    localStorage.removeItem(
      "shopify_customer_id_token"
    );

    // Redirect to Shopify so its session is terminated
    window.location.href = logoutUrl.toString();

  } catch (error) {
    console.error("Logout failed:", error);

    localStorage.removeItem(
      "shopify_customer_id_token"
    );

    window.location.href = "/";
  }
}
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCustomer,
  loginCustomer,
  logoutCustomer,
} from "../../services/customerAuth";

import "./Account.css";

function Account() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const customerData = await getCustomer();

        setCustomer(customerData);
      } catch (error) {
        console.error(error);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
  }, []);

  function logout() {
    localStorage.removeItem(
      "shopify_customer_access_token"
    );

    localStorage.removeItem(
      "shopify_customer_id_token"
    );

    localStorage.removeItem(
      "shopify_customer_refresh_token"
    );

    localStorage.removeItem(
      "shopify_customer_token_expires_at"
    );

    navigate("/");
  }

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-container">
          <p>Loading your account...</p>
        </div>
      </main>
    );
  }

  if (error || !customer) {
    return (
      <main className="account-page">
        <div className="account-container">
          <p className="section-eyebrow">
            CUSTOMER ACCOUNT
          </p>

          <h1>Welcome to Mann Zariya</h1>

          <p className="account-description">
            Sign in to view your account and orders.
          </p>

          <button
            type="button"
            className="account-login-button"
            onClick={loginCustomer}
          >
            Login / Sign Up →
          </button>

          <Link
            to="/shop"
            className="account-shop-link"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const fullName =
    `${customer.firstName || ""} ${
      customer.lastName || ""
    }`.trim();

  return (
    <main className="account-page">
      <div className="account-container">

        <p className="section-eyebrow">
          MY ACCOUNT
        </p>

        <div className="account-header">
            <div>
                <h1>
                {fullName || "Welcome"}
                </h1>

                <p className="account-email">
                {customer.emailAddress?.emailAddress}
                </p>
            </div>

            <button
            type="button"
            className="account-logout-button"
            onClick={logoutCustomer}
            >
            Logout
            </button>
        </div>

        <div className="account-divider" />

        <section className="account-section">
          <h2>Account Details</h2>

          <div className="account-details">
            <div>
              <span>Name</span>

              <p>
                {fullName || "Not provided"}
              </p>
            </div>

            <div>
              <span>Email</span>

              <p>
                {customer.emailAddress?.emailAddress ||
                  "Not provided"}
              </p>
            </div>

            {customer.phoneNumber?.phoneNumber && (
              <div>
                <span>Phone</span>

                <p>
                  {customer.phoneNumber.phoneNumber}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="account-section">
            <h2>Orders</h2>

            {customer.orders?.edges?.length === 0 ? (
                <p className="account-description">
                You haven't placed any orders yet.
                </p>
            ) : (
                <div className="account-orders">
                {customer.orders.edges.map(({ node: order }) => (
                    <div
                    className="account-order"
                    key={order.id}
                    >
                    <div className="account-order-header">
                        <div>
                        <p className="account-order-name">
                            {order.name}
                        </p>

                        <p className="account-order-date">
                            {new Date(
                            order.processedAt
                            ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            })}
                        </p>
                        </div>

                        <div className="account-order-total">
                        ₹{" "}
                        {Number(
                            order.totalPrice.amount
                        ).toLocaleString("en-IN")}
                        </div>
                    </div>

                    <div className="account-order-items">
                        {order.lineItems.edges.map(
                        ({ node: item }, index) => (
                            <p key={index}>
                            {item.title} × {item.quantity}
                            </p>
                        )
                        )}
                    </div>

                    <p
                    className={`account-order-status ${
                        order.cancelledAt
                        ? "account-order-cancelled"
                        : ""
                    }`}
                    >
                    {order.cancelledAt
                        ? "Cancelled"
                        : order.financialStatus}
                    </p>
                    {order.cancelledAt && (
                    <p className="account-order-cancelled-date">
                        Cancelled on{" "}
                        {new Date(
                        order.cancelledAt
                        ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        })}
                    </p>
                    )}
                    </div>
                ))}
                </div>
            )}
        </section>

      </div>
    </main>
  );
}

export default Account;
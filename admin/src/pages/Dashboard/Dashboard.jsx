import { useEffect, useState } from "react";
import { adminFetch } from "../../lib/api";
import "./Dashboard.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await adminFetch(
        "/admin/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const availableProducts = products.filter(
    (product) => product.available
  );

  const unavailableProducts = products.filter(
    (product) => !product.available
  );

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            MANN ZARIYA ADMIN
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-description">
            Manage your collection and keep track of your products.
          </p>
        </div>
      </div>

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <p>Total Products</p>
          <h2>{products.length}</h2>
        </div>

        <div className="dashboard-stat-card">
          <p>Available</p>
          <h2>{availableProducts.length}</h2>
        </div>

        <div className="dashboard-stat-card">
          <p>Unavailable</p>
          <h2>{unavailableProducts.length}</h2>
        </div>

      </section>

      <section className="dashboard-recent">
        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-eyebrow">
              COLLECTION
            </p>

            <h2>Recent Products</h2>
          </div>
        </div>

        <div className="dashboard-products-list">
          {products.slice(0, 5).map((product) => (
            <div
              className="dashboard-product-item"
              key={product.id}
            >
              <div className="dashboard-product-image">
                <img
                  src={
                    product.images?.[0]?.url ||
                    product.image
                  }
                  alt={product.name}
                />
              </div>

              <div className="dashboard-product-info">
                <h3>{product.name}</h3>

                <p>
                  ₹ {product.price.toLocaleString("en-IN")}
                </p>
              </div>

              <span
                className={
                  product.available
                    ? "dashboard-status available"
                    : "dashboard-status unavailable"
                }
              >
                {product.available
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
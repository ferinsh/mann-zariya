import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "../../lib/api";
import "./Products.css";

function Products() {
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
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <p className="products-eyebrow">CATALOGUE</p>

          <h1>Products</h1>

          <p className="products-description">
            Manage your Mann Zariya collection.
          </p>
        </div>

        <Link to="/products/new" className="add-product-button">
          + Add Product
        </Link>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="products-product">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        product.image
                      }
                      alt={product.name}
                    />

                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.slug}</p>
                    </div>
                  </div>
                </td>

                <td>
                  ₹ {product.price.toLocaleString("en-IN")}
                </td>

                <td>
                  {product.sizes?.length
                    ? product.sizes.join(", ")
                    : "—"}
                </td>

                <td>
                  <span
                    className={
                      product.available
                        ? "product-status available"
                        : "product-status unavailable"
                    }
                  >
                    {product.available
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </td>

                <td>
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="edit-product-button"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
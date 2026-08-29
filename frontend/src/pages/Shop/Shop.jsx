import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Shop.css";

const API_URL = import.meta.env.VITE_API_URL;

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="shop-page">
      <section className="shop-hero">
        <div className="shop-container">
          <p className="section-eyebrow">OUR COLLECTION</p>

          <h1>Kurta Sets, Churidars & Salwars</h1>

          <p className="shop-description">
            Explore thoughtfully curated pieces designed to bring together
            elegance, comfort, and effortless everyday style.
          </p>
        </div>
      </section>

      <section className="shop-products">
        <div className="shop-container">
          <div className="shop-products-header">
            <p>
              {products.length}{" "}
              {products.length === 1 ? "Piece" : "Pieces"}
            </p>
          </div>

          {loading && <p>Loading products...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <div className="shop-products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Shop;
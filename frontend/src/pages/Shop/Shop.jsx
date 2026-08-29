import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../data/products";
import "./Shop.css";

function Shop() {
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
              {products.length} {products.length === 1 ? "Piece" : "Pieces"}
            </p>
          </div>

          <div className="shop-products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Shop;
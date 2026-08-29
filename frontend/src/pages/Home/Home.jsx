import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../data/products";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-eyebrow">MANN ZARIYA</p>

            <h1>
              Fashion that moves
              <br />
              with your everyday life.
            </h1>

            <p className="hero-description">
              Discover thoughtfully curated styles that bring together
              elegance, comfort, and individuality.
            </p>

            <Link to="/shop" className="hero-button">
              Explore Collection
              <span>→</span>
            </Link>
          </div>

          <div className="hero-images">
            <div className="hero-image hero-image-main">
              <img
                src="https://placehold.co/700x900"
                alt="Mann Zariya fashion collection"
              />
            </div>

            <div className="hero-image hero-image-secondary">
              <img
                src="https://placehold.co/400x500"
                alt="Mann Zariya fashion detail"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="introduction">
        <div className="introduction-container">
          <p className="section-eyebrow">OUR PHILOSOPHY</p>

          <h2>
            Fashion Excellence
            <br />
            for Everyday Success
          </h2>

          <p className="introduction-text">
            We believe fashion should be a reflection of individuality.
            Mann Zariya brings together thoughtfully curated styles that
            combine elegance, comfort, and timeless design.
          </p>
        </div>
      </section>

      <section className="collection">
        <div className="collection-container">
          <div className="collection-header">
            <div>
              <p className="section-eyebrow">OUR COLLECTION</p>

              <h2>
                Kurta Sets,
                <br />
                Churidars & Salwars
              </h2>
            </div>

            <div className="collection-intro">
              <p>
                Explore thoughtfully curated pieces designed to bring together
                elegance, comfort, and effortless everyday style.
              </p>

              <Link to="/shop" className="collection-link">
                Explore the Collection <span>→</span>
              </Link>
            </div>
          </div>

          <div className="collection-showcase">
            <div className="collection-image collection-image-large">
              <img
                src="https://placehold.co/900x650"
                alt="Mann Zariya collection"
              />
            </div>

            <div className="collection-image collection-image-small">
              <img
                src="https://placehold.co/500x650"
                alt="Mann Zariya fashion detail"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="featured-products-container">

          <div className="featured-products-header">
            <div>
              <p className="section-eyebrow">FEATURED PIECES</p>

              <h2>Made to be Worn</h2>
            </div>

            <Link to="/shop" className="featured-products-link">
              View All <span>→</span>
            </Link>
          </div>

          <div className="featured-products-grid">
            {products.slice(0, 3).map((product) => (
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

export default Home;
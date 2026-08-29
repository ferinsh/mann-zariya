import { Link, useParams } from "react-router-dom";
import products from "../../data/products";
import { BUSINESS } from "../../config/business";
import "./Product.css";

function Product() {
  const { slug } = useParams();

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return (
      <main className="product-not-found">
        <div className="product-container">
          <p className="section-eyebrow">PRODUCT NOT FOUND</p>

          <h1>This piece is no longer available.</h1>

          <Link to="/shop" className="product-back-link">
            Back to Collection →
          </Link>
        </div>
      </main>
    );
  }

  const whatsappNumber = BUSINESS.whatsappNumber;

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} priced at ₹${product.price.toLocaleString(
      "en-IN"
    )}. Is it available?`
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="product-page">
      <div className="product-container">

        <Link to="/shop" className="product-back-link">
          ← Back to Collection
        </Link>

        <section className="product-layout">

          <div className="product-image-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
          </div>

          <div className="product-info">

            <p className="section-eyebrow">
              {product.category}
            </p>

            <h1>{product.name}</h1>

            <p className="product-price">
              ₹ {product.price.toLocaleString("en-IN")}
            </p>

            <div className="product-divider" />

            <p className="product-description">
              {product.description}
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              Enquire on WhatsApp
              <span>→</span>
            </a>

            <p className="product-note">
              Contact us on WhatsApp to check availability, sizes, and
              additional details.
            </p>

          </div>

        </section>
      </div>
    </main>
  );
}

export default Product;
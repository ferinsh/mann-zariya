import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <Link
      to={`/shop/${product.slug}`}
      className="product-card"
    >
      <div className="product-card-image">
        <img
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-card-content">
        <h3>{product.name}</h3>

        <p className="product-card-price">
          ₹ {product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
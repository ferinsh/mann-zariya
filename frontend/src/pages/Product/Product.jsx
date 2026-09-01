import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BUSINESS } from "../../config/business";
import { getProductByHandle } from "../../services/shopify";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./Product.css";

// const API_URL = import.meta.env.VITE_API_URL;

function Product() {
  const { slug } = useParams();

  const { addItem } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);


  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setNotFound(false);
        setError(null);

        const data = await getProductByHandle(slug);

        if (!data) {
          setNotFound(true);
          return;
        }

        setProduct(data);
        const firstAvailableVariant = data.variants.find(
          (variant) => variant.availableForSale
        );

        setSelectedVariant(firstAvailableVariant || null);

        setSelectedImage(
          data.images && data.images.length > 0
            ? data.images[0].url
            : data.image
        );
      } catch (error) {
        console.error(error);
        setError("Unable to load this product. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="product-page">
        <div className="product-container">
          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  if (notFound) {
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

  if (error) {
    return (
      <main className="product-page">
        <div className="product-container">
          <p>{error}</p>

          <Link to="/shop" className="product-back-link">
            ← Back to Collection
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

  async function handleAddToCart() {
    if (!selectedVariant) {
      return;
    }

    try {
      setAddingToCart(true);

      await addItem(selectedVariant.id, 1);

      alert("Added to cart!");
    } catch (error) {
      console.error(error);
      alert("Unable to add this item to your cart.");
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <main className="product-page">
      <div className="product-container">
        <Link to="/shop" className="product-back-link">
          ← Back to Collection
        </Link>

        <section className="product-layout">
          {/* <div className="product-image-wrapper">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
          </div> */}
          <div className="product-gallery">
            <div className="product-image-wrapper">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="product-image"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    className={`product-thumbnail ${
                      selectedImage === image.url
                        ? "product-thumbnail-active"
                        : ""
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={product.name}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>

            <p className="product-price">
              ₹ {product.price.toLocaleString("en-IN")}
            </p>

            <div className="product-divider" />

            <p className="product-description">
              {product.description}
            </p>

            {/* {product.sizes && product.sizes.length > 0 && (
              <div className="product-sizes">
                <p className="product-sizes-label">Available Sizes</p>

                <div className="product-sizes-list">
                  {product.sizes.map((size) => (
                    <span key={size} className="product-size">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )} */}
            {product.variants && product.variants.length > 0 && (
              <div className="product-sizes">
                <p className="product-sizes-label">Select Size</p>

                <div className="product-sizes-list">
                  {product.variants.map((variant) => {
                    const size = variant.selectedOptions.find(
                      (option) => option.name === "Size"
                    )?.value;

                    if (!size) return null;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        className={`product-size ${
                          selectedVariant?.id === variant.id
                            ? "product-size-selected"
                            : ""
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.availableForSale}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              Enquire on WhatsApp
              <span>→</span>
            </a> */}
            <button
              type="button"
              className="whatsapp-button"
              onClick={handleAddToCart}
              disabled={!selectedVariant || addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
              <span>→</span>
            </button>

            {/* <p className="product-note">
              Contact us on WhatsApp to check availability, sizes, and
              additional details.
            </p> */}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Product;
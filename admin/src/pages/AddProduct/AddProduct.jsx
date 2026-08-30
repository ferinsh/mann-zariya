import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "../../lib/api";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState([]);
  const [available, setAvailable] = useState(true);
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function generateSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleNameChange(event) {
    const value = event.target.value;

    setName(value);
    setSlug(generateSlug(value));
  }

  function handleSizeChange(size) {
    setSizes((currentSizes) =>
      currentSizes.includes(size)
        ? currentSizes.filter((item) => item !== size)
        : [...currentSizes, size]
    );
  }

  function handleImageChange(event) {
    const selectedFiles = Array.from(event.target.files);

    setImages(selectedFiles);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (images.length === 0) {
      setError("Please select at least one product image.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("available", available);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await adminFetch(
        "/admin/products",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      navigate("/products");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <div>
          <p className="add-product-eyebrow">
            CATALOGUE
          </p>

          <h1>Add Product</h1>

          <p>
            Create a new product for your collection.
          </p>
        </div>
      </div>

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >
        <div className="add-product-section">
          <h2>Product Information</h2>

          <div className="form-field">
            <label>Product Name</label>

            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Black Modal Silk Salwar Suit"
              required
            />
          </div>

          <div className="form-field">
            <label>Slug</label>

            <input
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value)
              }
              required
            />

            <span className="form-help">
              Used in the product URL.
            </span>
          </div>

          <div className="form-field">
            <label>Price (₹)</label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              placeholder="3500"
              required
            />
          </div>

          <div className="form-field">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="6"
              placeholder="Describe the product..."
            />
          </div>
        </div>

        <div className="add-product-section">
          <h2>Sizes</h2>

          <div className="size-options">
            {["XS", "S", "M", "L", "XL", "XXL"].map(
              (size) => (
                <label
                  key={size}
                  className="size-option"
                >
                  <input
                    type="checkbox"
                    checked={sizes.includes(size)}
                    onChange={() =>
                      handleSizeChange(size)
                    }
                  />

                  <span>{size}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="add-product-section">
          <h2>Availability</h2>

          <label className="availability-option">
            <input
              type="checkbox"
              checked={available}
              onChange={(event) =>
                setAvailable(event.target.checked)
              }
            />

            <span>Product is available</span>
          </label>
        </div>

        <div className="add-product-section">
          <h2>Product Images</h2>

          <div className="form-field">
            <label>
              Upload Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            <span className="form-help">
              Upload up to 10 images. The first image
              will be used as the cover image.
            </span>
          </div>

          {images.length > 0 && (
            <div className="image-preview-grid">
              {images.map((image, index) => (
                <div
                  className="image-preview"
                  key={`${image.name}-${index}`}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                  />

                  {index === 0 && (
                    <span className="cover-label">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="add-product-error">
            {error}
          </p>
        )}

        <div className="add-product-actions">
          <button
            type="button"
            className="cancel-product-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-product-button"
            disabled={loading}
          >
            {loading
              ? "Creating Product..."
              : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
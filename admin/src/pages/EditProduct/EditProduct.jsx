import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "../../lib/api";
import "./EditProduct.css";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState([]);
  const [available, setAvailable] = useState(true);
  const [newImages, setNewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await adminFetch(
          `/admin/products/${id}`
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.message || "Failed to load product"
          );
        }

        const data = await response.json();

        setProduct(data);
        setName(data.name || "");
        setSlug(data.slug || "");
        setPrice(data.price ?? "");
        setDescription(data.description || "");
        setSizes(data.sizes || []);
        setAvailable(data.available);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

    async function handleDeleteProduct() {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this product? This cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await adminFetch(
            `/admin/products/${id}`,
            {
                method: "DELETE",
            }
            );

            const data = await response.json();

            if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete product"
            );
            }

            navigate("/products");
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

  function handleSizeChange(size) {
    setSizes((currentSizes) =>
      currentSizes.includes(size)
        ? currentSizes.filter((item) => item !== size)
        : [...currentSizes, size]
    );
  }

    async function handleSetCover(imageId) {
    try {
        setError("");

        const response = await adminFetch(
        `/admin/products/${id}/cover/${imageId}`,
        {
            method: "PATCH",
        }
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.message || "Failed to set cover image"
        );
        }

        // Backend returns the updated product.
        setProduct(data);
    } catch (error) {
        console.error(error);
        setError(error.message);
    }
    }

  async function handleDeleteImage(imageId) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
        return;
    }

    try {
        setError("");

        const response = await adminFetch(
        `/admin/products/${id}/images/${imageId}`,
        {
            method: "DELETE",
        }
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.message || "Failed to delete image"
        );
        }

        // Remove the image from the UI immediately.
        setProduct((currentProduct) => {
        const updatedImages =
            currentProduct.images.filter(
            (image) => image.id !== imageId
            );

        // Keep the frontend cover image in sync.
        const updatedCoverImage =
            currentProduct.images.find(
            (image) => image.id !== imageId
            )?.url || currentProduct.image;

        return {
            ...currentProduct,
            image: updatedCoverImage,
            images: updatedImages,
        };
        });
    } catch (error) {
        console.error(error);
        setError(error.message);
    }
    }

    function handleNewImageChange(event) {
        const selectedFiles = Array.from(event.target.files);

        setNewImages(selectedFiles);
    }

    async function handleUploadImages() {
        if (newImages.length === 0) {
            return;
        }

        try {
            setUploadingImages(true);
            setError("");

            const formData = new FormData();

            newImages.forEach((image) => {
            formData.append("images", image);
            });

            const response = await adminFetch(
            `/admin/products/${id}/images`,
            {
                method: "POST",
                body: formData,
            }
            );

            const data = await response.json();

            if (!response.ok) {
            throw new Error(
                data.message || "Failed to upload images"
            );
            }

            // Replace the current product with the updated version
            // returned by the backend.
            setProduct(data);

            // Clear selected files.
            setNewImages([]);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setUploadingImages(false);
        }
    }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await adminFetch(
        `/admin/products/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name,
            slug,
            price: Number(price),
            description,
            sizes,
            available,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product"
        );
      }

      navigate("/products");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error && !product) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-header">
        <div>
          <p className="edit-product-eyebrow">
            CATALOGUE
          </p>

          <h1>Edit Product</h1>

          <p>Editing {product.name}</p>
        </div>
      </div>

      <form
        className="edit-product-form"
        onSubmit={handleSubmit}
      >
        <div className="edit-product-section">
          <h2>Product Information</h2>

          <div className="edit-form-field">
            <label>Product Name</label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </div>

          <div className="edit-form-field">
            <label>Slug</label>

            <input
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value)
              }
              required
            />

            <span className="edit-form-help">
              Used in the product URL.
            </span>
          </div>

          <div className="edit-form-field">
            <label>Price (₹)</label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              required
            />
          </div>

          <div className="edit-form-field">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="6"
            />
          </div>
        </div>

        <div className="edit-product-section">
          <h2>Sizes</h2>

          <div className="edit-size-options">
            {SIZE_OPTIONS.map((size) => (
              <label
                key={size}
                className="edit-size-option"
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
            ))}
          </div>
        </div>

        <div className="edit-product-section">
          <h2>Availability</h2>

          <label className="edit-availability-option">
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

        <div className="edit-product-section">
          <h2>Current Images</h2>

          <div className="edit-image-grid">
            {product.images.map((image, index) => {
            const isCover = image.url === product.image;

            return (
                <div
                key={image.id}
                className={`edit-image ${
                    isCover ? "edit-image-cover" : ""
                }`}
                >
                <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                />

                {isCover ? (
                    <span className="edit-cover-label">
                    Cover
                    </span>
                ) : (
                    <button
                    type="button"
                    className="set-cover-button"
                    onClick={() =>
                        handleSetCover(image.id)
                    }
                    >
                    Set as Cover
                    </button>
                )}

                <button
                    type="button"
                    className="delete-image-button"
                    onClick={() =>
                    handleDeleteImage(image.id)
                    }
                    title="Delete image"
                >
                    ×
                </button>
                </div>
            );
            })}
          </div>
        </div>
        <div className="edit-product-section">
        <h2>Add More Images</h2>

        <div className="edit-form-field">
            <label>Select Images</label>

            <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImageChange}
            />

            <span className="edit-form-help">
            You can upload up to 10 images at a time.
            </span>
        </div>

        {newImages.length > 0 && (
            <>
            <div className="new-image-preview-grid">
                {newImages.map((image, index) => (
                <div
                    key={`${image.name}-${index}`}
                    className="new-image-preview"
                >
                    <img
                    src={URL.createObjectURL(image)}
                    alt={`New preview ${index + 1}`}
                    />
                </div>
                ))}
            </div>

            <button
                type="button"
                className="upload-images-button"
                onClick={handleUploadImages}
                disabled={uploadingImages}
            >
                {uploadingImages
                ? "Uploading Images..."
                : "Upload Images"}
            </button>
            </>
        )}
        </div>

        {error && (
          <p className="edit-product-error">
            {error}
          </p>
        )}

        <div className="edit-product-actions">
        <button
            type="button"
            className="delete-product-button"
            onClick={handleDeleteProduct}
        >
            Delete Product
        </button>

        <div className="edit-product-right-actions">
            <button
            type="button"
            onClick={() => navigate("/products")}
            >
            Cancel
            </button>

            <button type="submit">
            Save Changes
            </button>
        </div>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
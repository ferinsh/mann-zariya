import prisma from "../config/prisma.js";
import supabase from "../config/supabase.js";

export async function getAdminProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching admin products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}

export async function createAdminProduct(req, res) {
  try {
    const {
      name,
      slug,
      price,
      description,
      sizes,
      available,
    } = req.body;

    const files = req.files;

    if (
      !name ||
      !slug ||
      price === undefined ||
      !files ||
      files.length === 0
    ) {
      return res.status(400).json({
        message:
          "Name, slug, price, and at least one image are required",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "A product with this slug already exists",
      });
    }

    // Convert sizes from FormData into an array.
    // The frontend will send sizes as JSON.
    let parsedSizes = [];

    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch {
        parsedSizes = [];
      }
    }

    const uploadedImages = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      const fileExtension =
        file.originalname.split(".").pop();

      const fileName =
        `${slug}/${Date.now()}-${index}.${fileExtension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

      if (uploadError) {
        console.error(
          "Supabase upload error:",
          uploadError
        );

        throw new Error(
          `Failed to upload image: ${file.originalname}`
        );
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      uploadedImages.push({
        url: data.publicUrl,
        position: index,
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: Number(price),
        description: description || null,

        // First uploaded image becomes the cover image.
        image: uploadedImages[0].url,

        sizes: parsedSizes,

        available:
          available === "true" || available === true,

        images: {
          create: uploadedImages,
        },
      },

      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(
      "Error creating product:",
      error
    );

    res.status(500).json({
      message: "Failed to create product",
    });
  }
}

export async function getAdminProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching admin product:", error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
}

export async function updateAdminProduct(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      price,
      description,
      sizes,
      available,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (slug && slug !== existingProduct.slug) {
      const slugInUse = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugInUse) {
        return res.status(409).json({
          message: "Another product already uses this slug",
        });
      }
    }

    const product = await prisma.product.update({
      where: { id },

      data: {
        name,
        slug,
        price: Number(price),
        description: description || null,
        sizes: Array.isArray(sizes)
          ? sizes
          : existingProduct.sizes,
        available:
          typeof available === "boolean"
            ? available
            : existingProduct.available,
      },

      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
}

export async function deleteAdminProductImage(req, res) {
  try {
    const { id, imageId } = req.params;

    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id,
      },
      include: {
        product: {
          include: {
            images: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    // Don't allow deleting the final product image.
    if (image.product.images.length <= 1) {
      return res.status(400).json({
        message:
          "A product must have at least one image",
      });
    }

    // Extract the Storage path from the public URL.
    const storagePath = image.url.split(
      "/storage/v1/object/public/product-images/"
    )[1];

    if (storagePath) {
      const { error: storageError } =
        await supabase.storage
          .from("product-images")
          .remove([storagePath]);

      if (storageError) {
        console.error(
          "Supabase Storage delete error:",
          storageError
        );

        throw new Error(
          "Failed to delete image from storage"
        );
      }
    }

    await prisma.productImage.delete({
      where: {
        id: imageId,
      },
    });

    // If the deleted image was the cover image,
    // use the next image as the new cover.
    if (image.product.image === image.url) {
      const remainingImages =
        image.product.images.filter(
          (productImage) =>
            productImage.id !== imageId
        );

      await prisma.product.update({
        where: {
          id,
        },
        data: {
          image: remainingImages[0].url,
        },
      });
    }

    res.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting product image:",
      error
    );

    res.status(500).json({
      message: "Failed to delete image",
    });
  }
}

export async function addAdminProductImages(req, res) {
  try {
    const { id } = req.params;
    const files = req.files;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "Please select at least one image",
      });
    }

    const uploadedImages = [];

    const startingPosition = product.images.length;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      const fileExtension = file.originalname
        .split(".")
        .pop();

      const fileName =
        `${product.slug}/${Date.now()}-${index}.${fileExtension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("product-images")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

      if (uploadError) {
        console.error(
          "Supabase upload error:",
          uploadError
        );

        throw new Error(
          `Failed to upload ${file.originalname}`
        );
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      uploadedImages.push({
        url: data.publicUrl,
        position: startingPosition + index,
      });
    }

    await prisma.productImage.createMany({
      data: uploadedImages.map((image) => ({
        ...image,
        productId: id,
      })),
    });

    const updatedProduct =
      await prisma.product.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

    res.status(201).json(updatedProduct);
  } catch (error) {
    console.error(
      "Error adding product images:",
      error
    );

    res.status(500).json({
      message: "Failed to add images",
    });
  }
}

export async function setAdminProductCoverImage(req, res) {
  try {
    const { id, imageId } = req.params;

    // Make sure this image belongs to this product.
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id,
      },
    });

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        image: image.url,
      },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(
      "Error setting cover image:",
      error
    );

    res.status(500).json({
      message: "Failed to set cover image",
    });
  }
}

export async function deleteAdminProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Get the Supabase Storage paths for every product image.
    const storagePaths = product.images
      .map((image) => {
        return image.url.split(
          "/storage/v1/object/public/product-images/"
        )[1];
      })
      .filter(Boolean);

    // Delete all images from Supabase Storage.
    if (storagePaths.length > 0) {
      const { error: storageError } =
        await supabase.storage
          .from("product-images")
          .remove(storagePaths);

      if (storageError) {
        console.error(
          "Supabase Storage delete error:",
          storageError
        );

        throw new Error(
          "Failed to delete product images from storage"
        );
      }
    }

    // Delete product.
    // ProductImage records are automatically deleted because
    // the Prisma schema uses onDelete: Cascade.
    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting product:",
      error
    );

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
}
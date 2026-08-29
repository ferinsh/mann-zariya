import prisma from "../config/prisma.js";

export async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
}
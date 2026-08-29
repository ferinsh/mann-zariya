import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const STORAGE_URL =
  "https://penwodoeklvgzeehbuuf.supabase.co/storage/v1/object/public/product-images";

const products = [
  {
    name: "Black Modal Silk Salwar Suit",
    slug: "black-modal-silk-salwar-suit",
    price: 3200,
    description:
      "An elegant black modal silk salwar suit featuring detailed floral embroidery.",
    image: `${STORAGE_URL}/black-modal-silk-salwar-suit/1.jpeg`,
    sizes: ["M", "L", "XL"],
    available: true,
    images: [
      `${STORAGE_URL}/black-modal-silk-salwar-suit/1.jpeg`,
      `${STORAGE_URL}/black-modal-silk-salwar-suit/2.jpeg`,
      `${STORAGE_URL}/black-modal-silk-salwar-suit/3.jpeg`,
    ],
  },

  {
    name: "Maroon H O Silk Salwar",
    slug: "maroon-h-o-silk-salwar",
    price: 3700,
    description:
      "A rich maroon silk salwar designed with elegant embroidery and refined detailing.",
    image: `${STORAGE_URL}/maroon-h-o-silk-salwar/1.jpeg`,
    sizes: [],
    available: true,
    images: [
      `${STORAGE_URL}/maroon-h-o-silk-salwar/1.jpeg`,
      `${STORAGE_URL}/maroon-h-o-silk-salwar/2.jpeg`,
      `${STORAGE_URL}/maroon-h-o-silk-salwar/3.jpeg`,
    ],
  },

  {
    name: "Pink Roman Silk Salwar Suit",
    slug: "pink-roman-silk-salwar-suit",
    price: 2500,
    description:
      "A soft pink Roman silk salwar suit with delicate embroidery and a graceful finish.",
    image: `${STORAGE_URL}/pink-roman-silk-salwar-suit/1.jpeg`,
    sizes: ["M", "XL"],
    available: true,
    images: [
      `${STORAGE_URL}/pink-roman-silk-salwar-suit/1.jpeg`,
      `${STORAGE_URL}/pink-roman-silk-salwar-suit/2.jpeg`,
    ],
  },

  {
    name: "Light Sage Green Roman Silk Salwar Suit",
    slug: "light-sage-green-roman-silk-salwar-suit",
    price: 2500,
    description:
      "A light sage green Roman silk salwar suit with subtle detailing and an elegant silhouette.",
    image: `${STORAGE_URL}/light-sage-green-roman-silk-salwar-suit/1.jpeg`,
    sizes: ["M", "L", "XL"],
    available: true,
    images: [
      `${STORAGE_URL}/light-sage-green-roman-silk-salwar-suit/1.jpeg`,
      `${STORAGE_URL}/light-sage-green-roman-silk-salwar-suit/2.jpeg`,
    ],
  },
];

async function main() {
  console.log("Seeding products...");

  for (const product of products) {
    const { images, ...productData } = product;

    const savedProduct = await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: productData,
      create: productData,
    });

    // Remove existing gallery images so re-running the seed
    // doesn't create duplicates.
    await prisma.productImage.deleteMany({
      where: {
        productId: savedProduct.id,
      },
    });

    // Create the gallery images.
    await prisma.productImage.createMany({
      data: images.map((url, index) => ({
        url,
        position: index,
        productId: savedProduct.id,
      })),
    });
  }

  console.log("Products seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
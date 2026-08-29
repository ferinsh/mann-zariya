import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Black Modal Silk Salwar Suit",
    slug: "black-modal-silk-salwar-suit",
    price: 3200,
    description:
      "An elegant black modal silk salwar suit featuring detailed floral embroidery.",
    image: "https://via.placeholder.com/600x800",
  },

  {
    name: "Maroon H O Silk Salwar",
    slug: "maroon-h-o-silk-salwar",
    price: 3700,
    description:
      "A rich maroon silk salwar designed with elegant embroidery and refined detailing.",
    image: "https://via.placeholder.com/600x800",
  },

  {
    name: "Pink Roman Silk Salwar Suit",
    slug: "pink-roman-silk-salwar-suit",
    price: 2500,
    description:
      "A soft pink Roman silk salwar suit with delicate embroidery and a graceful finish.",
    image: "https://via.placeholder.com/600x800",
  },

  {
    name: "Light Sage Green Roman Silk Salwar Suit",
    slug: "light-sage-green-roman-silk-salwar-suit",
    price: 2500,
    description:
      "A light sage green Roman silk salwar suit with subtle detailing and an elegant silhouette.",
    image: "https://via.placeholder.com/600x800",
  },
];

async function main() {
  console.log("Seeding products...");

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: product,
      create: product,
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
import express from "express";

import {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProductImage,
  addAdminProductImages,
  setAdminProductCoverImage,
  deleteAdminProduct,
} from "../controllers/adminProductController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAdminProducts);

router.get("/:id", getAdminProductById);

router.post(
  "/",
  upload.array("images", 10),
  createAdminProduct
);

router.patch("/:id", updateAdminProduct);

router.patch(
  "/:id/cover/:imageId",
  setAdminProductCoverImage
);

router.post(
  "/:id/images",
  upload.array("images", 10),
  addAdminProductImages
);

router.delete(
  "/:id/images/:imageId",
  deleteAdminProductImage
);

router.delete(
  "/:id",
  deleteAdminProduct
);

export default router;
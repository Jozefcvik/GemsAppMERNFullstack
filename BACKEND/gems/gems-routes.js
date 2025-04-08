const express = require("express");
const { check } = require("express-validator");

const gemsControllers = require("./gems-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", gemsControllers.getAllGems);

router.get("/reserved", gemsControllers.getAllReservedGems);

router.get("/:id", gemsControllers.getGemById);

router.post("/import", gemsControllers.firstImportGems);

router.delete("/", gemsControllers.deleteAllGems);

router.use(checkAuth);

router.post("/import", gemsControllers.firstImportGems);

router.post(
  "/",
  [check("title").not().isEmpty(), check("origin").isLength({ min: 5 })],
  gemsControllers.createGem
);

router.put(
  "/:id",
  [check("title").not().isEmpty(), check("origin").isLength({ min: 5 })],
  gemsControllers.updateGem
);

router.delete("/", gemsControllers.deleteAllGems);

router.delete("/:id", gemsControllers.deleteGem);

module.exports = router;

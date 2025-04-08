const express = require("express");
const { validationResult } = require("express-validator");

const Gem = require("../models/gem");
const firstGemsImport = require("../models/firstImport.js");

const getAllGems = async (req, res) => {
  try {
    const gems = await Gem.find();
    res.json({
      gems: gems.map((g) => g.toObject({ getters: true })),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching gems CONTROL." });
  }
};

const firstImportGems = async (req, res) => {
  try {
    const gemsPromises = firstGemsImport.map(async (gemData) => {
      const gem = new Gem(gemData);
      return gem.save();
    });
    await Promise.all(gemsPromises);
    res.json({ message: "Imported gems has been imported." }); // Send items as JSON
  } catch (err) {
    res.status(500).json({ message: "Error fetching gems." });
  }
};

const getAllReservedGems = async (req, res) => {
  try {
    const gems = await Gem.find({ reserved: true }); // Fetch all items
    res.json({ gems: gems.map((g) => g.toObject({ getters: true })) }); // Send items as JSON
  } catch (err) {
    res.status(500).json({ message: "Error fetching the gems." });
  }
};

const getGemById = async (req, res) => {
  const { id } = req.params;
  try {
    const gem = await Gem.findById(id); // Find item by ID
    if (gem) {
      res.json({ gem: gem.toObject({ getters: true }) });
    } else {
      res.status(404).json({ message: "Gem not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching item" });
  }
};

const createGem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .json({ message: "Invalid inputs passed, please check your data." });
  } else {
    try {
      const gems = await Gem.find();
      if (gems.length > 15) {
        return res
          .status(422)
          .json(
            "The maximum GEM limit has been exceeded (max. 15 Gems in DB)."
          );
      }
    } catch (err) {
      res.status(500).json({ message: "Error fetching the gems." });
    }

    const { title, origin, reserved } = req.body;
    try {
      const newGem = new Gem({
        title,
        origin,
        reserved: reserved || false,
      });

      await newGem.save();
      res.status(201).json({ gem: newGem.toObject({ getters: true }) });
    } catch (err) {
      res.status(500).json({ message: "Error creating gem" });
    }
  }
};

const updateGem = async (req, res) => {
  const { id } = req.params;
  const { title, origin, reserved } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(422)
      .json({ message: "Invalid inputs passed, please check your data." });
  } else {
    try {
      const updatedGem = await Gem.findByIdAndUpdate(id, {
        title,
        origin,
        reserved,
      });

      if (updatedGem) {
        try {
          const afterUpdateGem = await Gem.findById(id);
          res.json({ gem: afterUpdateGem.toObject({ getters: true }) });
        } catch (err) {
          res.status(404).json({ message: "Gem not found" });
        }
      } else {
        res.status(404).json({ message: "Gem not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error updating item" });
    }
  }
};

const deleteAllGems = async (req, res) => {
  try {
    const result = await Gem.deleteMany({});
    if (result) {
      res.json({ message: "All gems has been deleted." });
    } else {
      res.status(500).json({ message: "Error deleting gems." });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting gems." });
  }
};

const deleteGem = async (req, res) => {
  const { id } = req.params;

  try {
    const gems = await Gem.find();
    if (gems.length < 11) {
      return res
        .status(422)
        .json("The minimum GEM limit has been exceeded (min. 10 Gems in DB).");
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching the gems." });
  }

  try {
    try {
      const result = await Gem.findByIdAndDelete(id);
      if (result) {
        res.json({ message: "Gem has been deleted." });
      } else {
        res.status(404).json({ message: "Gem not found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error deleting gem" });
    }
  } catch (err) {
    res.status(404).json({ message: "Gem not found" });
  }
};

exports.getAllGems = getAllGems;
exports.firstImportGems = firstImportGems;
exports.getAllReservedGems = getAllReservedGems;
exports.getGemById = getGemById;
exports.createGem = createGem;
exports.updateGem = updateGem;
exports.deleteAllGems = deleteAllGems;
exports.deleteGem = deleteGem;

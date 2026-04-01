import Package from "../models/packageModel.js";

/*
========================================
CREATE PACKAGE
========================================
*/

export const createPackage = async (req, res) => {
  try {
    const packageData = await Package.create(req.body);

    res.status(201).json({
      success: true,
      packageData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
GET ALL PACKAGES
========================================
*/

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find();

    res.json({
      success: true,
      packages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
UPDATE PACKAGE
========================================
*/

export const updatePackage = async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      updated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
DELETE PACKAGE
========================================
*/

export const deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Package deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
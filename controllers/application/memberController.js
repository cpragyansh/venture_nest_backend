const Member = require("../../models/Members");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

exports.createMember = async (req, res) => {
  try {
    const { name, role, category } = req.body;
    const file = req.file;

    const result = await cloudinary.uploader.upload(file.path);
    fs.unlinkSync(file.path);

    const newMember = new Member({
      name,
      role,
      category,
      imgUrl: result.secure_url,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ message: "Error creating member", error: err.message });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Error fetching members" });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { name, role, category } = req.body;
    const { id } = req.params;

    const updateData = { name, role, category };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path);
      updateData.imgUrl = result.secure_url;
    }

    const updated = await Member.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating member" });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await Member.findByIdAndDelete(id);
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting member" });
  }
};

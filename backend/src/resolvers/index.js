const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Equipment = require("../models/Equipment");
const Request = require("../models/Request");

module.exports = {
  Query: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) throw new Error("Invalid credentials");
      return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    },
    me: async (_, __, { user }) => {
      if (!user || !user.userId) return null;
      return User.findById(user.userId);
    },
    equipmentList: async (_, { q, category, available }) => {
      const filter = {};
      if (q) filter.name = { $regex: q, $options: 'i' };
      if (category) filter.category = category;
      if (typeof available === 'boolean') {
        filter.availableQty = available ? { $gt: 0 } : 0;
      }
      return Equipment.find(filter).sort({ name: 1 });
    },
    myRequests: async (_, __, { user }) => {
      if (!user || !user.userId) return [];
      return Request.find({ userId: user.userId }).sort({ requestDate: -1 });
    },
    allRequests: async (_, { status }, { user }) => {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) throw new Error("Access Denied");
      const filter = {};
      if (status) filter.status = status;
      return Request.find(filter).sort({ requestDate: -1 });
    }
  },

  Mutation: {
    signup: async (_, { name, email, password, role }) => {
      const exists = await User.findOne({ email });
      if (exists) throw new Error("Email already used");
      const hashed = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashed, role: role || 'STUDENT' });
      return "Signup Successful";
    },
    addEquipment: async (_, { input }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Not Authorized");
      const eq = await Equipment.create({ ...input, availableQty: input.totalQty });
      return eq;
    },
    editEquipment: async (_, { id, input }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Not Authorized");
      return Equipment.findByIdAndUpdate(id, { ...input, updatedAt: new Date() }, { new: true });
    },
    deleteEquipment: async (_, { id }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new Error("Not Authorized");
      await Equipment.findByIdAndDelete(id);
      return true;
    },
    requestEquipment: async (_, { equipmentId, quantity, notes }, { user }) => {
      if (!user || !user.userId) throw new Error("Not Authenticated");
      // Basic availability check at request time
      const eq = await Equipment.findById(equipmentId);
      if (!eq) throw new Error("Equipment not found");
      if (quantity <= 0) throw new Error("Quantity must be at least 1");
      // Do not reserve here; reservation happens at issue
      const req = await Request.create({ userId: user.userId, equipmentId, quantity, notes });
      return req;
    },
    approveRequest: async (_, { id }, { user }) => {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) throw new Error("Not Authorized");
      const req = await Request.findByIdAndUpdate(id, { status: 'APPROVED', approvedBy: user.userId, approvedAt: new Date() }, { new: true });
      return req;
    },
    issueRequest: async (_, { id, dueDate }, { user }) => {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) throw new Error("Not Authorized");
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const req = await Request.findById(id).session(session);
        if (!req) throw new Error("Request not found");
        if (req.status !== 'APPROVED') throw new Error("Request must be approved before issuing");
        const eq = await Equipment.findById(req.equipmentId).session(session);
        if (!eq) throw new Error("Equipment not found");
        if (eq.availableQty < req.quantity) throw new Error("Insufficient quantity to issue");
        eq.availableQty = eq.availableQty - req.quantity;
        await eq.save({ session });
        req.status = 'ISSUED';
        req.issuedAt = new Date();
        if (dueDate) req.dueDate = new Date(dueDate);
        await req.save({ session });
        await session.commitTransaction();
        session.endSession();
        return req;
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    },
    returnRequest: async (_, { id }, { user }) => {
      // allow admin/staff or owner to mark returned
      const req = await Request.findById(id);
      if (!req) throw new Error("Request not found");
      const eq = await Equipment.findById(req.equipmentId);
      if (!eq) throw new Error("Equipment not found");
      if (req.status !== 'ISSUED') throw new Error("Request not issued");
      eq.availableQty = eq.availableQty + req.quantity;
      await eq.save();
      req.status = 'RETURNED';
      req.returnedAt = new Date();
      await req.save();
      return req;
    }
  }
};

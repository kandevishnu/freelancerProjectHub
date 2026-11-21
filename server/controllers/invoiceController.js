import Invoice from "../models/Invoice.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";

export const getInvoiceForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const invoice = await Invoice.findOne({ project: projectId });
    if (!invoice) {
      return res.json(null);
    }
    res.json(invoice);
  } catch (err) {
    console.error("Get invoice error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { amount } = req.body;
    const freelancerId = req.user._id;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invoice amount must be greater than zero." });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    if (!project.freelancer || !project.freelancer.equals(freelancerId)) {
      return res
        .status(403)
        .json({ error: "You are not the freelancer for this project." });
    }
    if (project.status !== "in-progress") {
      return res.status(400).json({
        error: "Invoices can only be created for in-progress projects.",
      });
    }

    const newInvoice = new Invoice({
      project: projectId,
      client: project.client,
      freelancer: freelancerId,
      amount: numericAmount,
    });
    await newInvoice.save();

    const notification = new Notification({
      recipient: project.client,
      sender: freelancerId,
      type: "new_invoice", 
      link: `/project/${projectId}`,
    });
    await notification.save();
    const io = getIO();
    io.to(project.client.toString()).emit("newNotification", {
      message: `You have a new invoice from ${req.user.name} for "${project.title}".`,
    });

    res.status(201).json(newInvoice);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "An invoice for this project already exists." });
    }
    console.error("Create invoice error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyEarnings = async (req, res) => {
  try {
    const freelancerId = req.user._id;

    const invoices = await Invoice.find({ freelancer: freelancerId })
      .populate('project', 'title status budget')
      .populate('client', 'name email profilePictureUrl')
      .sort({ createdAt: -1 });

    const totalEarned = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const pendingAmount = invoices
      .filter((inv) => inv.status === 'pending')
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const paidInvoicesCount = invoices.filter((inv) => inv.status === 'paid').length;
    const pendingInvoicesCount = invoices.filter((inv) => inv.status === 'pending').length;

    res.json({
      invoices,
      totalEarned,
      pendingAmount,
      totalInvoices: invoices.length,
      paidInvoicesCount,
      pendingInvoicesCount,
    });
  } catch (err) {
    console.error("Get my earnings error:", err.message);
    res.status(500).json({ error: "Server error while fetching earnings." });
  }
};

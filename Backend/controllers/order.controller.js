import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URI;

  try {
    // Prepare line items for Stripe
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Number(item.price) * 100, // Convert price to paise
      },
      quantity: item.quantity,
    }));

    // Add delivery charges (if applicable)
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200, // ₹2 in paise
      },
      quantity: 1,
    });

    // Calculate total amount
    const totalAmount =
      line_items.reduce(
        (sum, item) => sum + item.price_data.unit_amount * item.quantity,
        0
      ) / 100;

    // Create new order in database
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      amount: totalAmount, // Store the actual amount charged
      address: req.body.address,
    });

    await newOrder.save();

    // Clear user cart after placing the order
    await User.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    const isSuccess = success === "true"; // Convert success string to boolean

    if (isSuccess) {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not paid" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// List all orders for the admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// API for updating order status
const updateStatus = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error in updating status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };

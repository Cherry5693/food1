// Controllers for Auth, User, Product, and Order
const { User, Product, Order } = require('../models/model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Auth Controller
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// User Controller
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Product Controller
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, pricePerKg, image, category, unit, minOrderQty } = req.body;
    const product = new Product({ 
      name, 
      description, 
      price: pricePerKg || price, // Use pricePerKg if provided, fallback to price
      pricePerKg: pricePerKg || price, // Store both for compatibility
      image, 
      category,
      unit,
      minOrderQty,
      supplier: req.user.id 
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier', 'name email');
    
    // Transform the data to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      pricePerKg: product.pricePerKg || product.price,
      supplierId: product.supplier._id,
      supplierName: product.supplier.name,
      category: product.category || 'Other',
      unit: product.unit || 'kg',
      minOrderQty: product.minOrderQty || 1,
      description: product.description,
      imageUrl: product.image
    }));
    
    res.json(transformedProducts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Order Controller
exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const order = new Order({ customer: req.user.id, products });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email').populate('products.product', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}; 
const { User, Product, Order, GroupOrder } = require('../models/model');
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
      price: pricePerKg || price,
      pricePerKg: pricePerKg || price,
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

// NEW Group Order Controller
exports.createGroupOrder = async (req, res) => {
  try {
    const { productId, targetQty, quantity } = req.body;
    const { id: userId } = req.user;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    
    const newGroupOrder = new GroupOrder({
      productId,
      targetQty,
      currentQty: quantity,
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      participants: [{ user: userId, quantity }],
      status: 'open',
    });

    await newGroupOrder.save();
    res.status(201).json(newGroupOrder);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.joinGroupOrder = async (req, res) => {
  try {
    const { groupOrderId, quantity } = req.body;
    const { id: userId } = req.user;

    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) return res.status(404).json({ msg: 'Group order not found' });
    if (groupOrder.status !== 'open') return res.status(400).json({ msg: 'Order is no longer open' });
    if (groupOrder.currentQty + quantity > groupOrder.targetQty) return res.status(400).json({ msg: 'Exceeds max quantity' });

    const participant = groupOrder.participants.find(p => p.user.toString() === userId);
    if (participant) {
      participant.quantity += quantity;
    } else {
      groupOrder.participants.push({ user: userId, quantity });
    }
    
    groupOrder.currentQty += quantity;

    if (groupOrder.currentQty >= groupOrder.targetQty) {
      groupOrder.status = 'closed';
    }
    await groupOrder.save();
    res.status(200).json(groupOrder);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getGroupOrders = async (req, res) => {
  try {
    const userId = req.user.id; 

    const groupOrders = await GroupOrder.find({ 'participants.user': userId })
      .populate('productId')
      .lean();
    
    const transformedOrders = groupOrders.map(order => {
      const product = order.productId;
      let supplierName = 'Unknown Supplier';
      if (product && product.supplier && typeof product.supplier === 'object' && product.supplier.name) {
        supplierName = product.supplier.name;
      }
      return {
        _id: order._id,
        productId: order.productId,
        productName: product ? product.name : 'Unknown Product',
        pricePerKg: product ? product.pricePerKg : 0,
        supplierName,
        targetQty: order.targetQty,
        currentQty: order.currentQty,
        deliveryDate: order.deliveryDate,
        status: order.status,
        participants: order.participants,
      };
    });
    
    res.json({ data: transformedOrders });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
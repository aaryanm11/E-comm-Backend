const Order = require('../model/Order');
const Cart = require('../model/Cart');



exports.placeOrder = async(req, res) => {
    try {
        // Get the user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cannot place an empty order.' });
        }

        // Calculate the total price of the order
        const total = cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        // Create a new order
        const order = new Order({
            user: req.user._id,
            products: cart.products.map(item => ({ product: item.product._id, quantity: item.quantity })),
            total,
        });

        // Save the order
        await order.save();

        // Clear the user's cart
        cart.products = [];
        await cart.save();

        res.json({ message: 'Order placed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getOrderHistory = async(req, res) => {
    try {
        // Get the order history for the authenticated user
        const orders = await Order.find({ user: req.user._id }).populate('products.product');

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getOrderDetails = async(req, res) => {
    try {
        const orderId = req.params.orderId;

        // Get the details of a specific order
        const order = await Order.findById(orderId).populate('products.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
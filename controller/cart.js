const Cart = require('../model/Cart');
const Product = require('../model/Product');

exports.addToCart = async(req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Both productId and quantity are required.' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Get or create a user's cart
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, products: [] });
        }

        // Check if the product is already in the cart
        const existingProduct = cart.products.find(item => item.product.toString() === productId);

        if (existingProduct) {
            // If the product is already in the cart, update the quantity
            existingProduct.quantity += quantity;
        } else {
            // If the product is not in the cart, add it
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();

        res.json({ message: 'Product added to cart successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.viewCart = async(req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');

        if (!cart) {
            return res.json({ message: 'Cart is empty.' });
        }

        res.json(cart.products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateCart = async(req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Both productId and quantity are required.' });
        }

        // Get the user's cart
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Update the quantity of the specified product in the cart
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json({ message: 'Cart updated successfully.' });
        } else {
            res.status(404).json({ message: 'Product not found in the cart.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.removeFromCart = async(req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'productId is required.' });
        }

        // Get the user's cart
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Remove the specified product from the cart
        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.json({ message: 'Product removed from cart successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
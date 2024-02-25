const Product = require("../model/Product");

exports.getProducts = (req, res) => {
    const categoryId = req.params.categoryId;
    Product.find({ category: categoryId }, (err, products) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(products);
    });
};

exports.getProductDetails = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId, (err, product) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(product);
    });
};
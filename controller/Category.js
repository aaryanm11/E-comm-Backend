const Category = require("../model/Categories");

exports.getCategories = (req, res) => {
    Category.find({}, (err, categories) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(categories);
    });
};
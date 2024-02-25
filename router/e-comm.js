const express = require("express");
const router = express.Router();

const {login, signup} = require("../controller/Auth");
const {auth} = require("../middlewares/Auth");

const {getCategories}=require("../controller/Category");
const {getProducts,getProductDetails}=require("../controller/product");
const{addToCart,viewCart,updateCart,removeFromCart}=require("../controller/cart");
const {placeOrder,getOrderHistory,getOrderDetails}=require("../controller/order");


//authentication
router.post("/login", login);
router.post("/signup", signup);


//category listing
router.get('/Category',auth,getCategories);

//Product
router.get('/:categoryId',auth,getProducts);
router.get('/:productId/details',auth,getProductDetails);

// Cart management
router.post('/add',auth,addToCart);
router.get('/view',auth,viewCart);
router.put('/update',auth,updateCart);
router.delete('/remove', auth,removeFromCart);

// Order Placement
router.post('/place',auth,placeOrder);
router.get('/history',auth,getOrderHistory);
router.get('/:orderId/details',auth,getOrderDetails);



module.exports = router;

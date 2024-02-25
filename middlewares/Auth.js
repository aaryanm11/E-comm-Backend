const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next) => {
    try{
        //extracting JWT token
        // console.log("header", req.header("Authorization"));


        const tokenHeader = req.body.token || req.header("Authorization");

        // const tokenHeader =req.header("Authorization").replace("Bearer ", "");
        if(!tokenHeader) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        const token = tokenHeader.replace("Bearer ", "");    

        //verifying the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(payload);
            req.user = payload;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    } 
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        });
    }
   
}
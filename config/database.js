const moongoose=require("mongoose")
require("dotenv").config()
exports.connect=()=>{
moongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{console.log("Db connection successfull")})
.catch((err)=>{
    console.log("DB connection unsuccess");
    console.log(err)
    process.exit(1)
})
}
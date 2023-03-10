const express = require('express');
var app = express();
const cors=require('cors');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const sellersRouter = require('./routes/sellers');
const orderRouters=require('./routes/order')



//middleware//
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.body);
    next()
})

app.use("/products",productsRouter)
app.use("/sellers",sellersRouter)
app.use("/users",usersRouter)
app.use ("/orders",orderRouters)


app.use((err,req,res,next)=>{

res.status(500).json({message:err.message})

})
/////////port/////////////
app.listen(9999, () => {
    console.log("server started listening successfully on port 9999 ");
})







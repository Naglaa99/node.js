const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {checkToken} = require('../authantication/validate-token');
require("dotenv").config();
var {
  createSeller,
  getAllproducts,
  updateproductById,
  getproductsByName,
  createproduct,
  deleteproductById,
  getproductsBySellerName,
  getSellerByEmail
} = require("../controllers/sellersControlers");

// /////////////////////Create a new seller///////////////
router.post("/", (req, res, next) => {
  createSeller(req.body)
    .then((result) => {
      res.status(201).json({ message: "seller created!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//////////////login///////////////
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  //Check if the user exists in the database
  getSellerByEmail(email).then(result => {
      if (result[0].length === 0){
          res.status(404).json({ message: 'User not found' });
      } else {
          const user = result[0][0];
          // console.log(user.password);        
          const isPasswordMatch = bcryptjs.compareSync(password, user.password);
         
          if(isPasswordMatch){
              console.log(user);
              const payload = {email: user.email };
              console.log(payload);
              const token = jwt.sign(payload, 'secretkeyWMF', { expiresIn: '1h' });
              res.status(200).json({message: "Success login", token: token });
          } else {
              console.log('not ok');
              res.status(401).json({ message: 'Invalid email or password' });
          }
      }
  })
  .catch(err => {
      res.status(500).json({ error: 'err' });
  });
});

///////////////get all Products///////////////
router.get("/Products",checkToken, (req, res, next) => {
  getAllproducts()
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//get Products by productName 
router.get("/getProductsbyName/:productname",checkToken,  (req, res, next) => {
  // var { productname } = req.body;
  var productname = req.params.productname;

  getproductsByName(productname)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//get products By Seller Name 
router.get("/getproductsBySellerName/:sellername",checkToken,  (req, res, next) => {
  // var { sellername } = req.body;
  var sellername = req.params.sellername;

  getproductsBySellerName(sellername)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
//create product by seller
router.post("/createProduct",checkToken, (req, res, next) => {
  var product = req.body;
  createproduct(product)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(422).json({ message: err.message });
    });
});

//update product By Id
router.patch("/updateProduct/:id",checkToken, (req, res, next) => {
  var productId = req.params.id;
  var product = req.body;
  updateproductById(productId, product)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//delete product
router.delete("/deleteProduct/:id",checkToken, (req, res, next) => {
  var productId = req.params.id;
  var { sellerID } = req.body;
  deleteproductById(productId, sellerID)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;

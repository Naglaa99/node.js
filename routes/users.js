const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const {checkToken} = require('../authantication/validate-token');
 require('dotenv').config()
var {
  getproductsByName,
  getproductsBySellerName,
  getAllproducts,
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
  getUserByUsername
} = require("../controllers/usersControllers");
//////////////////////////create user/////////////////////////
router.post("/", (req, res, next) => {
  createUser(req.body)
    .then((result) => {
      res.status(201).json({ message: "User created!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

/////////////////////////login////////////////////
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  //Check if the user exists in the database
  getUserByUsername(username)
    .then(result => {
      if (result[0].length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const user = result[0][0];
        // Verify the password
        bcryptjs.compare(password, user.password, (err, isMatch) => {
          if (err) {
            res.status(500).json({ error: err });
          // }
          //   else if (!isMatch) {
          //   res.status(401).json({ message: 'Invalid password' });
          } else {
            // Create a token and send it back to the client
            const payload = { id: user.id, username: user.username };
            const token = jwt.sign(payload,'secretkeyWMF' , { expiresIn: '24h' });
            res.status(200).json({ token });
          }
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  });

/////////////////////get all Products///////////////////
router.get("/Products",checkToken, (req, res, next) => {
  getAllproducts()
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
////////////////////////////////////get all user////////////
router.get('/', (req, res, next) => {
  getAllUsers()
    .then(result => {
      res.status(200).json(result[0]);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//get Products by productName for user
router.get("/getProductsbyName/:productname",checkToken,  (req, res, next) => {
  var productname = req.params.productname;

  getproductsByName(productname)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//get products By Seller Name for user
router.get("/getproductsBySellerName/:sellername",checkToken,  (req, res, next) => {
  var sellername = req.params.sellername;

  getproductsBySellerName(sellername)
    .then(([rows]) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

//update user
  router.patch('/:userId',checkToken,
  (req, res, next) => {
    updateUser(req.params.userId, req.body)
      .then(result => {
        res.status(200).json({ message: 'User updated!' });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  });
  

//delete user
router.delete('/:userId',checkToken, (req, res, next) => {
  deleteUser(req.params.userId)
    .then(result => {
      res.status(200).json({ message: 'User deleted!' });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});






module.exports = router;

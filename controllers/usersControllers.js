const db = require("../utlis/db");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');



//register
function createUser(user) {
  var salt = bcryptjs.genSaltSync(10);
  var hashedPassword = bcryptjs.hashSync(user.password, salt);
  return db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [
    user.username,
    hashedPassword,
  ]);
}




//get all products
function getAllproducts() {
  return db.execute("SELECT * FROM products ");
}

//getproductsByName serch by product name for  user
function getproductsByName(name) {
  return db.execute("SELECT * FROM products WHERE name=? ", [name]);
}

//getproductsBySellerName serch by seller name for  user
function getproductsBySellerName(name) {
  return db.execute(
    "SELECT * FROM products p INNER JOIN sellers S on p.seller_id=s.id WHERE s.name=? ",
    [name]
  );
}

//delete User
function deleteUser(id) {
  return db.execute("DELETE FROM users WHERE id = ?", [id]);
}

//update user
function updateUser(id, user) {
  var salt = bcryptjs.genSaltSync(10);
  var hashedPassword = bcryptjs.hashSync(user.password, salt);
  return db.execute(
    "UPDATE users SET username = ?, password = ? WHERE id = ?",
    [user.username, hashedPassword, id]
  );
}

//Get a user by username
function getUserByUsername(username) {
    return db.execute('SELECT * FROM users WHERE username = ?', [username]);
  }

//////////////////////////make order///////////////////


module.exports = {
  getAllproducts,
  getproductsByName,
  getproductsBySellerName,
  updateUser,
  deleteUser,
  createUser,
  getUserByUsername
};

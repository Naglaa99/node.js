const db = require("../utlis/db");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');

//register///////////////
function createSeller(seller) {
    var salt = bcryptjs.genSaltSync(10);
    var hashedPassword = bcryptjs.hashSync(seller.password, salt);
    return db.execute("INSERT INTO sellers (name ,email, password) VALUES (?,?, ?)", [
        seller.name,
        seller.email,
      hashedPassword
    ]);
  }
  
  
  //login/////////////
  const loginSeller = async (email, password) => {
    const [rows] = await db.execute(
      "SELECT id, email, password FROM sellers WHERE email = ?",
      [email]
    );
    const seller = rows[0];
  
    if (!seller) {
      throw new Error("Invalid email or password");
    }
  
    const isPasswordValid = await bcryptjs.compare(password, seller.password);
  
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
  
    const token = jwt.sign({ id: seller.id }, process.env.JWT_KEY);
  
    return { token };
  };
  
  
//get all products///////////////////
function getAllproducts() {
  return db.execute("SELECT * FROM products ");
}

//getproductsByName serch by name for  seller
function getproductsByName(name) {
  return db.execute("SELECT * FROM products WHERE name=? ", [name]);
}

//getproductsBySellerName serch by name for  seller
function getproductsBySellerName(name) {
  return db.execute(
    "SELECT * FROM products p INNER JOIN sellers S on p.seller_id=s.id WHERE s.name=? ",
    [name]
  );
}

//getAllproducts sea all products for a spasific sellers//////////////////
function getAllproductsForSeller(sellerId) {
  return db.execute(
    "SELECT * FROM products p INNER JOIN sellers S on p.seller_id=? ",
    [sellerId]
  );
}

//updateproductById  edit a product by id for sellers///////////
function updateproductById(productId, product) {
  return db.execute(
    "UPDATE products SET name=? , description=?, photo=? WHERE id=? &&  seller_id=? ",
    [
      product.name,
      product.description,
      product.photo,
      productId,
      product.seller_id,
    ]
  );
}

//deleteproductById delete a product by id for sellers
function deleteproductById(productId, sellerId) {
return db.execute("DELETE FROM products WHERE id = ? AND seller_id = ? ", [
    productId,
    sellerId,
  ]);
}

//create  a product for sellers
function createproduct(product) {
  return db.execute(
    "INSERT into products  ( name, description, photo, seller_id) VALUES (?,?,?,?) ",
    [product.name, product.description, product.photo, product.seller_id]
  );
}
////////////////////////////////////////getsellerContrpller////////
function getSellerByEmail(email) {
    return db.execute('SELECT * FROM sellers WHERE email = ?', [email]);
  }

//////////////////git all sellers/////////////
function getAllSellers() {
  return db.execute('SELECT * FROM sellers');
}


module.exports = {
  getAllproducts,
  updateproductById,
  getproductsByName,
  createproduct,
  deleteproductById,
  getproductsBySellerName,
  getAllproductsForSeller,
  createSeller,
  loginSeller,
  getSellerByEmail,
  getAllSellers
};

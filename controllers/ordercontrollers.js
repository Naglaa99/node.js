const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce'
});

// Get all orders/////////////////////
const getAllOrders = (req, res) => {
  connection.query('SELECT * FROM orders', (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    res.json(results);
  });
};

// Create a new order/////////////////////

const createOrder = (req, res) => {
    const { userId, products } = req.body;
  
    if (!Array.isArray(products)) {
      res.status(400).json({ error: 'Products must be an array' });
      return;
    }
  
    connection.query(
      'INSERT INTO orders (user_id) VALUES (?)',
      [userId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Server error' });
          return;
        }
        if (results) {
          const orderId = results.insertId;
          const values = products.map(({ id, quantity }) => [orderId, id, quantity]);
          connection.query(
            'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?',
            [values],
            (error, results, fields) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: 'Server error' });
                return;
              }
              res.json({ id: orderId });
            }
          );
        } else {
          res.status(500).json({ error: 'Server error: no order ID returned' });
        }
      }
    );
  };
  
// Delete an order
const deleteOrder = (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM orders WHERE id = ?', [id], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    res.json({ message: 'Order deleted successfully' });
  });
};

//////////////////////////////update////////////////////


module.exports = {
  getAllOrders,
  createOrder,
  deleteOrder,
};




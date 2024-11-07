/* ---------------------------- CONSTANTES ---------------------------- */
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('http');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const app = express();
const { exec } = require('child_process');
const createDB = require(path.join(__dirname, 'configDB.js'));
const port = process.env.PORT;
/* ---------------------------- VARIABLES ---------------------------- */
var orders = [];
var products = [];
/* ---------------------------- CONEXIÓN A LA BASE DE DATOS ---------------------------- */
// // CREAR UNA BASE DE DATOS
// // Ejecuta la función createDB que se encuentra en el archivo configDB.js
// (async () => {
//   await createDB();
// })();

// CONEXIÓN A LA BASE DE DATOS
// Hace una conexión a la base de datos usando los datos del archivo .env
const dataConnection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true
};

async function connectDB() {
  try {
    const connection = await mysql.createConnection(dataConnection);
    console.log('Conexión a la base de datos exitosa.');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
}
/* ---------------------------- SERVER APP ---------------------------- */
app.use(cors());
app.use(express.json());
/* ---------------------------- SOCKETS ---------------------------- */
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin"],
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

async function sendOrders() {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM orders');
    console.log("Orders: ", rows);
    orders = rows;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return;
  } finally {
    io.emit('orders', orders);
    connection.end();
    console.log("Connection closed.");
  }
}

async function sendProducts() {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM products');
    console.log("Products: ", rows);
    products = rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    return;
  } finally {
    io.emit('products', products);
    connection.end();
    console.log("Connection closed.");
  }
}
/* ---------------------------- CONFIG HASH ---------------------------- */
const salt = bcrypt.genSaltSync(10);
/* ---------------------------- GUARDADO DE IMAGEN ---------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
/* ---------------------------- RUTAS ---------------------------- */
app.use('/assets', express.static('public'));

// Login
// Hace un SELECT de la tabla usuarios, verifica si existe un usuario con el email y password dados
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    const passwordCrypt = bcrypt.hashSync(password, salt);
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, passwordCrypt]);
    console.log("User: ", rows);

    if (rows.length == 0) {
      return res.status(404).send('Usuario no encontrado.');
    }

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching user.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// CRUD DE PRODUCTOS
// VER TODOS LOS PRODUCTOS PARA EMPRESA
// Hace un SELECT de la tabla productos, muestra todos los productos
app.get('/product', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM products');
    console.log("Products: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// VER TODOS LOS PRODUCTOS PARA USUARIO
// Hace un SELECT de la tabla productos, muestra todos los productos activados
app.get('/productUser', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM products WHERE activated = 1');
    console.log("Products: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// VER UN PRODUCTO ESPECÍFICO
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de un producto en especifico, muestra el producto
app.get('/productUser/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const productId = parseInt(cleanedId, 10); // Convertir a entero

  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);
    console.log("Product: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// AÑADIR UN PRODUCTO A LA BASE DE DATOS
// Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de un producto en especifico, añade el producto
app.post('/product', upload.single('image'), async (req, res) => {
  const { categoryId, name, description, size, price, color, stock, activated } = req.body;
  if (categoryId == undefined || !name || !description || !size || price == undefined || !color || stock == undefined || activated == undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    const imagePath = "assets/" + req.file.filename;
    console.log('Image path:', imagePath);
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO products (categoryId, name, description, size, price, imagePath, color, stock, activated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [categoryId, name, description, size, price, imagePath, color, stock, activated]
    );
    let message = {
      message: `Producto añadido con éxito.`,
      productId: result.insertId
    }
    sendProducts(); // Función de socket
    res.status(201).send(JSON.stringify(message));
    console.log()
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Error adding product.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// ELIMINAR UN PRODUCTO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un DELETE de un producto en especifico, borra el producto
app.delete('/product/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const productId = parseInt(cleanedId, 10);
  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT imagePath FROM products WHERE id = ?', [productId]);
    if (rows.length === 0) return res.status(404).send('Producto no encontrado.');

    const imagePath = "public/" + rows[0].imagePath.split('/').slice(1).join('/');
    const [result] = await connection.query('DELETE FROM products WHERE id = ?', [productId]);

    if (result.affectedRows > 0) {
      fs.unlink(imagePath, (err) => {
        if (err) return res.status(500).send('Error al eliminar la imagen del sistema de archivos.');

        sendProducts(); // Función de socket
        const message = { message: `Producto con ID ${productId} eliminado con éxito, junto con la imagen asociada.` };
        res.status(200).send(JSON.stringify(message));
      });
    } else {
      res.status(404).send('Producto no encontrado.');
    }
  } catch (error) {
    res.status(500).send('Error al eliminar el producto.');
  } finally {
    connection.end();
  }
});

// EDITAR UN PRODUCTO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de un producto en especifico, edita el producto
app.put('/product/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const productId = parseInt(cleanedId, 10); // Convertir a entero
  const { categoryId, name, description, size, price, color, stock, activated } = req.body;
  let connection;

  // Validación de campos
  if (categoryId == undefined || !name || !description || !size || price == undefined || !color || stock == undefined || activated == undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    // Conectar a la base de datos
    connection = await connectDB();

    // Obtener la ruta de la imagen actual
    const [currentProduct] = await connection.query('SELECT imagePath FROM products WHERE id = ?', [productId]);
    if (currentProduct.length === 0) {
      return res.status(404).send('Producto no encontrado.');
    }

    // Determinar la ruta de la imagen
    const imagePath = req.file ? `assets/${req.file.filename}` : currentProduct[0].imagePath;

    // Ejecutar consulta de actualización
    const [result] = await connection.query(
      `UPDATE products SET categoryId = ?, name = ?, description = ?, size = ?, price = ?, imagePath = ?, color = ?, stock = ?, activated = ? WHERE id = ?`,
      [categoryId, name, description, size, price, imagePath, color, stock, activated, productId]
    );

    if (result.affectedRows > 0) {
      sendProducts(); // Función de socket
      let message = {
        message: `Producto con ID ${productId} actualizado con éxito.`
      }
      res.status(200).send(JSON.stringify(message));
    } else {
      res.status(404).send('Producto no encontrado.');
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error al actualizar el producto.');
  } finally {
    if (connection) connection.end();
    console.log("Connection closed.");
  }
});

// CRUD DE CATEGORIAS
// VER TODAS LAS CATEGORIAS
// Hace un SELECT de la tabla categorias, muestra todas las categorias
app.get('/category', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM categories');
    console.log("Categories: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Error fetching categories.');
  } finally {
    connection.end();
  }
});

// VER UNA CATEGORIA ESPECÍFICA
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de una categoria en especifico, muestra la categoria
app.get('/category/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const categoryId = parseInt(cleanedId, 10); // Convertir a entero

  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    console.log("Category: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).send('Error fetching category.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// AÑADIR UNA CATEGORIA A LA BASE DE DATOS
// Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de una categoria en especifico, añade la categoria
app.post('/category', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );
    res.status(201).send('Categoria añadida con éxito.');
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).send('Error adding category.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// ELIMINAR UNA CATEGORIA POR ID
// Requiere un parametro 'id' el cual usamos para hacer un DELETE de una categoria en especifico, borra la categoria
app.delete('/category/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const categoryId = parseInt(cleanedId, 10); // Convertir a entero
  let connection;

  try {
    // Ejecutar consulta de eliminación con 'await'
    connection = await connectDB();
    const [result] = await connection.query('DELETE FROM categories WHERE id = ?', [categoryId]);

    console.log('Resultado de la eliminación:', result); // Imprimir el resultado de la consulta

    if (result.affectedRows > 0) {
      res.status(200).send(`Categoria con ID ${categoryId} eliminada con éxito.`);
    } else {
      res.status(404).send('Categoria no encontrada.');
    }
  } catch (error) {
    console.error('Error al eliminar la categoria:', error);
    res.status(500).send('Error al eliminar la categoria.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// EDITAR UNA CATEGORIA POR ID
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de una categoria en especifico, edita la categoria
app.put('/category/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const categoryId = parseInt(cleanedId, 10); // Convertir a entero
  const { name } = req.body;
  let connection;

  if (!name) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    connection = await connectDB();
    // Ejecutar consulta de actualización con 'await'
    const [result] = await connection.query(
      `UPDATE categories SET name = ? WHERE id = ?`,
      [name, categoryId]
    );

    if (result.affectedRows > 0) {
      res.status(200).send(`Categoria con ID ${categoryId} actualizada con éxito.`);
    } else {
      res.status(404).send('Categoria no encontrada.');
    }
  } catch (error) {
    console.error('Error al actualizar la categoria:', error);
    res.status(500).send('Error al actualizar la categoria.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// CRUD DE PEDIDOS
// VER TODOS LOS PEDIDOS
// Hace un SELECT de la tabla pedidos, muestra todos los pedidos
app.get('/orders', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const [orders] = await connection.query('SELECT * FROM orders');

    const ordersWithCounts = await Promise.all(orders.map(async (order) => {
      const [orderLineCount] = await connection.query('SELECT COUNT(*) as count FROM orderlines WHERE orderID = ?', [order.id]);
      return {
        ...order,
        productCount: orderLineCount[0].count
      };
    }));

    console.log("Orders with product counts: ", ordersWithCounts);
    res.json(ordersWithCounts);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders.');
  } finally {
    if (connection) connection.end();
    console.log("Connection closed.");
  }
});

// VER UN PEDIDO ESPECÍFICO
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de un pedido en especifico, muestra el pedido
app.get('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const orderId = parseInt(cleanedId, 10); // Convertir a entero

  let connection;

  try {
    connection = await connectDB();
    const [orderRows] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);

    if (orderRows.length == 0) {
      return res.status(404).send('Order not found.');
    }

    const [orderLineRows] = await connection.query('SELECT * FROM orderlines WHERE orderId = ?', [orderId]);

    const products = [];
    for (let i = 0; i < orderLineRows.length; i++) {
      const product = await connection.query('SELECT * FROM products WHERE id = ?', [orderLineRows[i].productId]);
      products.push(product[0][0]);
    }

    const userId = orderRows[0].userId; // Asumiendo que la tabla orders tiene una columna userId
    const [userRows] = await connection.query('SELECT firstName, lastName, email FROM users WHERE id = ?', [userId]);

    const orderDetails = {
      order: orderRows[0],
      orderLines: orderLineRows,
      products: products,
      user: userRows[0] // Añadir información del usuario
    };

    console.log("Order Details: ", orderDetails);
    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).send('Error fetching order.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// VER PEDIDOS DE UN USUARIO
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de los pedidos de un usuario en especifico, muestra los pedidos
app.get('/ordersUser/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const userId = parseInt(cleanedId, 10);
  let connection;

  try {
    connection = await connectDB();
    const [orders] = await connection.query('SELECT * FROM orders WHERE userId = ?', [userId]);

    const ordersWithDetails = await Promise.all(orders.map(async (order) => {
      const [orderLines] = await connection.query('SELECT ol.*, p.name, p.description, p.price, p.size, p.color FROM orderlines ol JOIN products p ON ol.productId = p.id WHERE ol.orderID = ?', [order.id]);
      const productCount = orderLines.length;

      return {
        ...order,
        productCount,
        orderLines
      };
    }));

    console.log("Orders with details: ", ordersWithDetails);
    res.json(ordersWithDetails);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders.');
  } finally {
    if (connection) connection.end();
    console.log("Connection closed.");
  }
});

// AÑADIR UN PEDIDO A LA BASE DE DATOS
// Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de un pedido en especifico, añade el pedido
app.post('/orders', async (req, res) => {
  const { total, products } = req.body;
  const { totalPrice, userId, pay } = total;

  if (totalPrice == undefined || !Array.isArray(products)) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    await connection.beginTransaction();

    // Insertar el pedido en la tabla orders
    const [result] = await connection.query(
      'INSERT INTO orders (userId, total, pay) VALUES (?, ?, ?)',
      [userId, totalPrice, pay]
    );

    const orderId = result.insertId;

    // Insertar las líneas de pedido en la tabla orderlines
    for (const product of products) {
      const { id: productId, price: productPrice, quantity } = product;
      if (productId == undefined || productPrice == undefined || quantity == undefined) {
        await connection.rollback();
        return res.status(400).send('Datos incompletos en products.');
      }

      const [productResult] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);

      for (let i = 0; i < quantity; i++) {
        await connection.query(
          'INSERT INTO orderlines (orderID, productId, productCategory, productName, productDescription, productSize, productPrice, productImagePath, productColor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [orderId, productId, productResult[0].categoryId, productResult[0].name, productResult[0].description, productResult[0].size, productResult[0].price, productResult[0].imagePath, productResult[0].color]
        );

        if (productResult[0].stock == 1) {
          await connection.query('UPDATE products SET stock = stock - 1, activated = 0 WHERE id = ?', [productId]);
        } else {
          await connection.query('UPDATE products SET stock = stock - 1 WHERE id = ?', [productId]);
        }
      }
    }

    sendOrders(); // Función de socket
    sendProducts(); // Función de socket
    await connection.commit();
    res.status(201).json({ message: 'Pedido añadido con éxito.', orderId });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error adding order:', error);
    res.status(500).send('Error adding order.');
  } finally {
    if (connection) connection.end();
    console.log("Connection closed.");
  }
});

// ELIMINAR UN PEDIDO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un DELETE de un pedido en especifico, borra el pedido
app.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const orderId = parseInt(cleanedId, 10); // Convertir a entero
  let connection;

  try {
    // Ejecutar consulta de eliminación con 'await'
    connection = await connectDB();
    await connection.beginTransaction();

    const [orderLinesResult] = await connection.query('DELETE FROM orderlines WHERE orderID = ?', [orderId]);
    console.log('Resultado de la eliminación de líneas de pedido:', orderLinesResult);

    const [orderResult] = await connection.query('DELETE FROM orders WHERE id = ?', [orderId]);
    console.log('Resultado de la eliminación del pedido:', orderResult);

    if (orderResult.affectedRows > 0) {
      sendOrders(); // Función de socket
      await connection.commit();
      res.status(200).send(`Pedido con ID ${orderId} eliminado con éxito.`);
    } else {
      await connection.rollback();
      res.status(404).send('Pedido no encontrado.');
    }
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error al eliminar el pedido:', error);
    res.status(500).send('Error al eliminar el pedido.');
  } finally {
    if (connection) connection.end();
    console.log("Connection closed.");
  }
});

// EDITAR UN PEDIDO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de un pedido en especifico, edita el pedido
app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const orderId = parseInt(cleanedId, 10); // Convertir a entero
  const { status } = req.body;
  let connection;

  if (!status || status != 'Pendent de confirmació' && status != 'Confirmat' && status != 'Cancelat' && status != 'Entregat' && status != 'Preparant' && status != 'Llest per recollir') {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    connection = await connectDB();
    let result;
    switch (status) {
      case 'Preparant':
        [result] = await connection.query(
          `UPDATE orders SET status = ?, dateStart = ? WHERE id = ?`,
          [status, new Date(), orderId]
        );
        break;
      case 'Llest per recollir':
        [result] = await connection.query(
          `UPDATE orders SET status = ?, dateReady = ? WHERE id = ?`,
          [status, new Date(), orderId]
        );
        break;
      case 'Entregat':
        [result] = await connection.query(
          `UPDATE orders SET status = ?, pay = ?, dateEnd = ? WHERE id = ?`,
          [status, 1, new Date(), orderId]
        );
        break;
      default:
        [result] = await connection.query(
          `UPDATE orders SET status = ? WHERE id = ?`,
          [status, orderId]
        );
        break;
    }

    const [order] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);

    if (result.affectedRows > 0) {
      sendOrders(); // Función de socket
      let message = {
        message: `Pedido con ID ${orderId} actualizado con éxito.`,
        order: order[0]
      }
      res.status(200).send(JSON.stringify(message));
    } else {
      res.status(404).send('Pedido no encontrado.');
    }
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).send('Error al actualizar el pedido.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// CRUD DE USUARIOS
// VER TODOS LOS USUARIOS
// Hace un SELECT de la tabla usuarios, muestra todos los usuarios
app.get('/user', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM users');
    console.log("Users: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users.');
  } finally {
    connection.end();
  }
});

// VER UN USUARIO ESPECÍFICO
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de un usuario en especifico, muestra el usuario
app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const userId = parseInt(cleanedId, 10); // Convertir a entero

  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    console.log("User: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching user.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// AÑADIR UN USUARIO A LA BASE DE DATOS
// Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de un usuario en especifico, añade el usuario
app.post('/user', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const passwordCrypt = bcrypt.hashSync(password, salt);
    const [result] = await connection.query(
      'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, passwordCrypt]
    );
    res.status(201).send('Usuario añadido con éxito.');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// ELIMINAR UN USUARIO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un DELETE de un usuario en especifico, borra el usuario
app.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const userId = parseInt(cleanedId, 10); // Convertir a entero
  let connection;

  try {
    // Ejecutar consulta de eliminación con 'await'
    connection = await connectDB();
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);

    console.log('Resultado de la eliminación:', result); // Imprimir el resultado de la consulta

    if (result.affectedRows > 0) {
      res.status(200).send(`Usuario con ID ${userId} eliminado con éxito.`);
    } else {
      res.status(404).send('Usuario no encontrado.');
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Error al eliminar el usuario.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// EDITAR UN USUARIO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de un usuario en especifico, edita el usuario
app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const userId = parseInt(cleanedId, 10); // Convertir a entero
  const { firstName, lastName, email, password } = req.body;
  let connection;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    connection = await connectDB();
    // Ejecutar consulta de actualización con 'await'
    const [result] = await connection.query(
      `UPDATE users SET firstName = ?, lastName = ?, email = ?, password = ? WHERE id = ?`,
      [firstName, lastName, email, password, userId]
    );

    if (result.affectedRows > 0) {
      res.status(200).send(`Usuario con ID ${userId} actualizado con éxito.`);
    } else {
      res.status(404).send('Usuario no encontrado.');
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).send('Error al actualizar el usuario.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// CRUD DE TARJETAS DE CREDITO
// VER TODAS LAS TARJETAS DE CREDITO
// Hace un SELECT de la tabla tarjetas de credito, muestra todas las tarjetas de credito
app.get('/creditCard', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM cards');
    console.log("Cards: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Cards:', error);
    res.status(500).send('Error fetching Cards.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// VER UNA TARJETA DE CREDITO ESPECÍFICA
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de una tarjeta de credito en especifico, muestra la tarjeta de credito
app.get('/creditCard/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const cardId = parseInt(cleanedId, 10); // Convertir a entero

  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM cards WHERE id = ?', [cardId]);
    console.log("Card: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).send('Error fetching card.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// VER UNA TARJETA DE CREDITO POR USUARIO ID
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de las tarjetas de credito de un usuario en especifico, muestra las tarjetas de credito
app.get('/creditCardUser/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const userId = parseInt(cleanedId, 10); // Convertir a entero

  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM cards WHERE userId = ?', [userId]);
    console.log("Cards: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).send('Error fetching cards.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// AÑADIR UNA TARJETA DE CREDITO A LA BASE DE DATOS
// Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de una tarjeta de credito en especifico, añade la tarjeta de credito
app.post('/creditCard', async (req, res) => {
  const { userId, cardName, cardNumber, expirationDate, cvv } = req.body;
  if (userId == undefined || !cardName || !cardNumber || !expirationDate || !cvv) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO cards (userId, cardName, cardNumber, expirationDate, cvv) VALUES (?, ?, ?, ?, ?)',
      [userId, cardName, cardNumber, expirationDate, cvv]
    );
    res.status(201).send('Tarjeta de credito añadida con éxito.');
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).send('Error adding card.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// ELIMINAR UNA TARJETA DE CREDITO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un DELETE de una tarjeta de credito en especifico, borra la tarjeta de credito
app.delete('/creditCard/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const cardId = parseInt(cleanedId, 10); // Convertir a entero
  let connection;

  try {
    // Ejecutar consulta de eliminación con 'await'
    connection = await connectDB();
    const [result] = await connection.query('DELETE FROM cards WHERE id = ?', [cardId]);

    console.log('Resultado de la eliminación:', result); // Imprimir el resultado de la consulta

    if (result.affectedRows > 0) {
      res.status(200).send(`Tarjeta de credito con ID ${cardId} eliminada con éxito.`);
    } else {
      res.status(404).send('Tarjeta de credito no encontrada.');
    }
  } catch (error) {
    console.error('Error al eliminar la tarjeta de credito:', error);
    res.status(500).send('Error al eliminar la tarjeta de credito.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// EDITAR UNA TARJETA DE CREDITO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de una tarjeta de credito en especifico, edita la tarjeta de credito
app.put('/creditCard/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, '');
  const cardId = parseInt(cleanedId, 10); // Convertir a entero
  const { userId, cardName, cardNumber, expirationDate, cvv } = req.body;
  let connection;

  if (userId == undefined || !cardName || !cardNumber || !expirationDate || !cvv) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    connection = await connectDB();
    // Ejecutar consulta de actualización con 'await'
    const [result] = await connection.query(
      `UPDATE cards SET cardName = ?, cardNumber = ?, expirationDate = ?, cvv = ? WHERE id = ? AND userId = ?`,
      [cardName, cardNumber, expirationDate, cvv, cardId, userId]
    );

    if (result.affectedRows > 0) {
      res.status(200).send(`Tarjeta de credito con ID ${cardId} actualizada con éxito.`);
    } else {
      res.status(404).send('Tarjeta de credito no encontrada.');
    }
  } catch (error) {
    console.error('Error al actualizar la tarjeta de credito:', error);
    res.status(500).send('Error al actualizar la tarjeta de credito.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// Ruta para ejecutar el primer script (Client.ipynb)
app.get('/ejecutar-client', (req, res) => {
  const notebookPath = path.join(__dirname, '..', 'python', 'Client.ipynb');
  exec(`jupyter nbconvert --to notebook --execute ${notebookPath} --output resultado_cliento.ipynb`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando el notebook Client.ipynb: ${error}`);
      return res.status(500).send(`Error ejecutando el notebook Client.ipynb: ${error}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    res.send({ message: 'Notebook Client ejecutado correctamente', result: stdout });
  });
});

// Ruta para ejecutar el segundo script (clients.ipynb)
app.get('/ejecutar-clients', (req, res) => {
  const notebookPath = path.join(__dirname, '..', 'python', 'clients.ipynb');
  exec(`jupyter nbconvert --to notebook --execute ${notebookPath} --output resultado_clients.ipynb`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando el notebook clients.ipynb: ${error}`);
      return res.status(500).send(`Error ejecutando el notebook clients.ipynb: ${error}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    res.send({ message: 'Notebook Clients ejecutado correctamente', result: stdout });
  });
});

// Levantar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
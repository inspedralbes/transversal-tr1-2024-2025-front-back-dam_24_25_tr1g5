const mysql = require('mysql2/promise');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();
const createDB = require(path.join(__dirname, 'configDB.js')); 
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

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
  database: process.env.DB_NAME
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

app.use('/assets', express.static('public'));

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
    const imagePath = req.file.path;
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO products (categoryId, name, description, size, price, imagePath, color, stock, activated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [categoryId, name, description, size, price, imagePath, color, stock, activated]
    );
    res.status(201).send('Producto añadido con éxito.');
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
  const productId = parseInt(cleanedId, 10); // Convertir a entero
  let connection;

  try {
    // Ejecutar consulta de eliminación con 'await'
    connection = await connectDB();
    const [result] = await connection.query('DELETE FROM products WHERE id = ?', [productId]);

    console.log('Resultado de la eliminación:', result); // Imprimir el resultado de la consulta

    if (result.affectedRows > 0) {
      res.status(200).send(`Producto con ID ${productId} eliminado con éxito.`);
    } else {
      res.status(404).send('Producto no encontrado.');
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error al eliminar el producto.');
  } finally {
    connection.end();
    console.log("Connection closed.");
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

  if ( categoryId == undefined || !name || !description || !size || price == undefined || !color || stock == undefined || activated == undefined ) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    const imagePath = req.file.path;
    connection = await connectDB();
    // Ejecutar consulta de actualización con 'await'
    const [result] = await connection.query(
      `UPDATE products SET categoryId = ?, name = ?, description = ?, size = ?, price = ?, imagePath = ?, color = ?, stock = ?, activated = ? WHERE id = ?`, 
      [categoryId, name, description, size, price, imagePath, color, stock, activated, productId]
    );

    if (result.affectedRows > 0) {
      res.status(200).send(`Producto con ID ${productId} actualizado con éxito.`);
    } else {
      res.status(404).send('Producto no encontrado.');
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error al actualizar el producto.');
  } finally {
    connection.end();
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
app.delete('/category/:id', async ( req, res ) => {
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
    const [rows] = await connection.query('SELECT * FROM orders');
    console.log("Orders: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error); 
    res.status(500).send('Error fetching orders.');
  } finally {
    connection.end();
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
    const [rows] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    console.log("Order: ", rows); 
    res.json(rows);
  } catch (error) {
    console.error('Error fetching order:', error); 
    res.status(500).send('Error fetching order.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// AÑADIR UN PEDIDO A LA BASE DE DATOS
// Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de un pedido en especifico, añade el pedido
app.post('/orders', async (req, res) => {
  const { userId, total } = req.body;
  if (userId == undefined || total == undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO orders (userId, total) VALUES (?, ?)', 
      [userId, total]
    );
    res.status(201).send('Pedido añadido con éxito.');
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).send('Error adding order.');
  } finally {
    connection.end();
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
    const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [orderId]);

    console.log('Resultado de la eliminación:', result); // Imprimir el resultado de la consulta

    if (result.affectedRows > 0) {
      res.status(200).send(`Pedido con ID ${orderId} eliminado con éxito.`);
    } else {
      res.status(404).send('Pedido no encontrado.');
    }
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).send('Error al eliminar el pedido.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// EDITAR UN PEDIDO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de un pedido en especifico, edita el pedido
app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const orderId = parseInt(cleanedId, 10); // Convertir a entero
  const { userId, total, status } = req.body;
  let connection;

  if (userId == undefined || total == undefined || !status) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    connection = await connectDB();
    // Ejecutar consulta de actualización con 'await'
    const [result] = await connection.query(
      `UPDATE orders SET userId = ?, total = ?, status = ? WHERE id = ?`, 
      [userId, total, status, orderId]
    );

    if (result.affectedRows > 0) {
      res.status(200).send(`Pedido con ID ${orderId} actualizado con éxito.`);
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

// CRUD DE LINEA DE PEDIDO
// VER TODAS LAS LINEAS DE PEDIDO
// Hace un SELECT de la tabla lineas de pedido, muestra todas las lineas de pedido
app.get('/orderLine', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM orderlines');
    console.log("orderlines: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orderlines:', error); 
    res.status(500).send('Error fetching orderlines.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// VER UNA LINEA DE PEDIDO ESPECÍFICA
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de una linea de pedido en especifico, muestra la linea de pedido
app.get('/orderLine/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const orderLineId = parseInt(cleanedId, 10); // Convertir a entero

  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM orderlines WHERE id = ?', [orderLineId]);
    console.log("orderlines: ", rows); 
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orderlines:', error); 
    res.status(500).send('Error fetching orderlines.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// AÑADIR UNA LINEA DE PEDIDO A LA BASE DE DATOS
// Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de una linea de pedido en especifico, añade la linea de pedido
app.post('/orderLine', async (req, res) => {
  const { orderId, productId, productPrice} = req.body;
  if (orderId == undefined || productId == undefined || productPrice == undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO orderlines (orderId, productId, productPrice) VALUES (?, ?, ?)', 
      [orderId, productId, productPrice]
    );
    res.status(201).send('Linea de pedido añadida con éxito.');
  } catch (error) {
    console.error('Error adding orderlines:', error);
    res.status(500).send('Error adding orderlines.');
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
  const { firstName, lastName, email, password, typeUserId } = req.body;
  if (!firstName || !lastName || !email || !password || !typeUserId) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO users (firstName, lastName, email, password, typeUserId) VALUES (?, ?, ?, ?, ?)', 
      [firstName, lastName, email, password, typeUserId]
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

// CRUD DE TIPOS DE USUARIOS
// VER TODOS LOS TIPOS DE USUARIOS
// Hace un SELECT de la tabla tipos de usuarios, muestra todos los tipos de usuarios
app.get('/typeUser', async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM typesusers');
    console.log("TypesUsers: ", rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching typesUsers:', error); 
    res.status(500).send('Error fetching typesUsers.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// VER UN TIPO DE USUARIO ESPECÍFICO
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de un tipo de usuario en especifico, muestra el tipo de usuario
app.get('/typeUser/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const typeUserId = parseInt(cleanedId, 10); // Convertir a entero

  let connection;

  try {
    connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM typesUsers WHERE id = ?', [typeUserId]);
    console.log("TypesUsers: ", rows); 
    res.json(rows);
  } catch (error) {
    console.error('Error fetching typesUsers:', error); 
    res.status(500).send('Error fetching typesUsers.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// AÑADIR UN TIPO DE USUARIO A LA BASE DE DATOS
// Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de un tipo de usuario en especifico, añade el tipo de usuario
app.post('/typeUser', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO typesusers (name) VALUES (?)', 
      [name]
    );
    res.status(201).send('Tipo de usuario añadido con éxito.');
  } catch (error) {
    console.error('Error adding typesUsers:', error);
    res.status(500).send('Error adding typesUsers.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// ELIMINAR UN TIPO DE USUARIO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un DELETE de un tipo de usuario en especifico, borra el tipo de usuario
app.delete('/typeUser/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const typeUserId = parseInt(cleanedId, 10); // Convertir a entero
  let connection;

  try {
    // Ejecutar consulta de eliminación con 'await'
    connection = await connectDB();
    const [result] = await connection.query('DELETE FROM typesusers WHERE id = ?', [typeUserId]);

    console.log('Resultado de la eliminación:', result); // Imprimir el resultado de la consulta

    if (result.affectedRows > 0) {
      res.status(200).send(`Tipo de usuario con ID ${typeUserId} eliminado con éxito.`);
    } else {
      res.status(404).send('Tipo de usuario no encontrado.');
    }
  } catch (error) {
    console.error('Error al eliminar el tipo de usuario:', error);
    res.status(500).send('Error al eliminar el tipo de usuario.');
  } finally {
    connection.end();
    console.log("Connection closed.");
  }
});

// EDITAR UN TIPO DE USUARIO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de un tipo de usuario en especifico, edita el tipo de usuario
app.put('/typeUser/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const typeUserId = parseInt(cleanedId, 10); // Convertir a entero
  const { name } = req.body;
  let connection;

  if (!name) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    connection = await connectDB();
    // Ejecutar consulta de actualización con 'await'
    const [result] = await connection.query(
      `UPDATE typesusers SET name = ? WHERE id = ?`, 
      [name, typeUserId]
    );

    if (result.affectedRows > 0) {
      res.status(200).send(`Tipo de usuario con ID ${typeUserId} actualizado con éxito.`);
    } else {
      res.status(404).send('Tipo de usuario no encontrado.');
    }
  } catch (error) {
    console.error('Error al actualizar el tipo de usuario:', error);
    res.status(500).send('Error al actualizar el tipo de usuario.');
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
      `UPDATE cards SET userId = ?, cardName = ?, cardNumber = ?, expirationDate = ?, cvv = ? WHERE id = ?`, 
      [userId, cardName, cardNumber, expirationDate, cvv, cardId]
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
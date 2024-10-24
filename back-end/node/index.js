const createDB = require('./configDB.js');
const mysql = require('mysql2/promise');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// CREAR UNA BASE DE DATOS
// Ejecuta la función createDB que se encuentra en el archivo configDB.js
(async () => {
  await createDB();
})();

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

app.use('/assets', express.static('public'));

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
  }
});

// VER UN PRODUCTO ESPECÍFICO
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de un producto en especifico, muestra el producto
app.get('/product/:id', async (req, res) => {
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
app.post('/product', async (req, res) => {
  const { categoryId, name, description, size, price, imagePath, colors, stock, activated } = req.body;
  if (categoryId == undefined || !name || !description || !size || price == undefined || !imagePath || !colors || stock == undefined || activated == undefined) {
    return res.status(400).send('Datos incompletos.');
  }

  let connection;

  try {
    connection = await connectDB();
    const [result] = await connection.query(
      'INSERT INTO products (categoryId, name, description, size, price, imagePath, colors, stock, activated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [categoryId, name, description, size, price, imagePath, colors, stock, activated]
    );
    res.status(201).send('Producto añadido con éxito.');
    console.log()
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Error adding product.');
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
  }
});

// EDITAR UN PRODUCTO POR ID
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de un producto en especifico, edita el producto
app.put('/product/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const productId = parseInt(cleanedId, 10); // Convertir a entero
  const { categoryId, name, description, size, price, imagePath, colors, stock, activated } = req.body;
  let connection;

  if ( categoryId == undefined || !name || !description || !size || price == undefined || !imagePath || !colors || stock == undefined || activated == undefined ) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    connection = await connectDB();
    // Ejecutar consulta de actualización con 'await'
    const [result] = await connection.query(
      `UPDATE products SET categoryId = ?, name = ?, description = ?, size = ?, price = ?, imagePath = ?, colors = ?, stock = ?, activated = ? WHERE id = ?`, 
      [categoryId, name, description, size, price, imagePath, colors, stock, activated, productId]
    );
    console.log("Product: ", rows); 

    if (result.affectedRows > 0) {
      res.status(200).send(`Producto con ID ${productId} actualizado con éxito.`);
    } else {
      res.status(404).send('Producto no encontrado.');
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error al actualizar el producto.');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
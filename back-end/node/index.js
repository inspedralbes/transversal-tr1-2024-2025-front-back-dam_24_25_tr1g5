const express = require('express');
const mysql = require('mysql2/promise'); // Importa la versión con promesas
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const connection = require('./connectionDB');
const port = 3000;
const JSON = 'productos.json';
const JSONPath = path.join(__dirname, JSON);

app.use(cors());
app.use(express.json());

connection((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

connection((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});


//
// VER TODOS LOS PRODUCTOS
//
// Hace un SELECT de la tabla productos, muestra todos los productos
app.get('/product', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM products');
    console.log("Products: ", rows);
  } catch (error) {
    console.error('Error fetching products:', error); 
    res.status(500).send('Error fetching products.');
  }
});

//
// VER UN PRODUCTO ESPECÍFICO
//
// Requiere un parametro 'id' el cual usamos para hacer un SELECT de un producto en especifico, muestra el producto
app.get('/product/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const productId = parseInt(cleanedId, 10); // Convertir a entero

  
  try {
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);
    console.log("Product: ", rows); 

  } catch (error) {
    console.error('Error fetching product:', error); 
    res.status(500).send('Error fetching product.');
  }
});


//
// AÑADIR UN PRODUCTO A LA BASE DE DATOS
//
// // Requiere un parametro 'body', provenienet de un JSON, el cual usamos para hacer un INSERT de un producto en especifico, añade el producto
app.post('/product', async (req, res) => {
  const { categoryId, name, description, size, price, imagePath, colors, stock, activated } = req.body;
  if (
    categoryId === undefined || 
    !name || 
    !description || 
    !size || 
    price === undefined || 
    !imagePath || 
    !colors || 
    stock === undefined || 
    activated === undefined
  ) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
    const [result] = await connectionDB.query(
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


//
// ELIMINAR UN PRODUCTO POR ID
//
// Requiere un parametro 'id' el cual usamos para hacer un DELETE de un producto en especifico, borra el producto
app.delete('/product/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const productId = parseInt(cleanedId, 10); // Convertir a entero
  try {
    // Ejecutar consulta de eliminación con 'await'
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

//
// EDITAR UN PRODUCTO POR ID
//
// Requiere un parametro 'id' el cual usamos para hacer un UPDATE de un producto en especifico, edita el producto
app.put('/product/:id', async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.replace(/[^0-9]/g, ''); 
  const productId = parseInt(cleanedId, 10); // Convertir a entero
  const { categoryId, name, description, size, price, imagePath, colors, stock, activated } = req.body;

  if (
    categoryId === undefined || 
    !name || 
    !description || 
    !size || 
    price === undefined || 
    !imagePath || 
    !colors || 
    stock === undefined || 
    activated === undefined
  ) {
    return res.status(400).send('Datos incompletos.');
  }

  try {
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

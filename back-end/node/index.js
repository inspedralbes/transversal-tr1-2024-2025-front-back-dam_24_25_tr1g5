const express = require('express');
const mysql = require('mysql2/promise'); // Importa la versión con promesas
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const connectionDB = require('./connectionDB'); // Pool de conexiones
const port = 3000;
const JSON = 'productos.json';
const JSONPath = path.join(__dirname, JSON);

app.use(cors());
app.use(express.json());

// Leer el archivo JSON
const readEntireFile = () => {
  if (!fs.existsSync(JSONPath)) {
    console.error('El archivo no existe:', JSONPath);
    return []; // Devuelve un array vacío si el archivo no existe
  }
  try {
    const data = fs.readFileSync(JSONPath, 'utf8');
    console.log('Contenido del archivo:', data); // Verifica el contenido
    return JSON.parse(data).preguntes; // Devuelve directamente el array de preguntas
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    throw new Error('Error al leer las preguntas.');
  }
};

const writeQuestionsToFile = (questions) => {
  try {
    const data = JSON.stringify({ preguntes: questions }, null, 2);
    fs.writeFileSync(JSONPath, data);
  } catch (error) {
    console.error('Error al escribir el archivo:', error);
    throw new Error('Error al guardar las preguntas.');
  }
};

// VER TODOS LOS PRODUCTOS
app.get('/product', (req, res) => {
  try {
    const rows = connectionDB.query('SELECT * FROM products'); // Cambiado a 'products'
    console.log("Products: ", rows); // Imprime solo los datos de los productos
    res.json(rows); // Envía los productos como respuesta
  } catch (error) {
    console.error('Error fetching products:', error); // Imprimir el error
    res.status(500).send('Error fetching products.');
  }
});

// VER UN PRODUCTO ESPECIFICO
app.get('/product/:id', (req, res) => {
  const { id } = req.params;
  try {
    const rows = connectionDB.query('SELECT * FROM products WHERE id = ?', [id]);
    console.log("Product: ", rows); // Imprime solo el producto
    if (rows.length > 0) {
      res.json(rows[0]); // Devuelve solo el producto encontrado
    } else {
      res.status(404).send('Producto no encontrado.');
    }
  } catch (error) {
    console.error('Error fetching product:', error); // Imprimir el error
    res.status(500).send('Error fetching product.');
  }
});

// AÑADIR UN PRODUCTO A LA BASE DE DATOS
app.post('/product',(req, res) => {
  const { categoryId, name, description, size, price, imagePath, colors, stock, activated } = req.body;

  // Verificamos si alguna de las constantes obligatorias está ausente o es undefined
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
    // Ejecuta la consulta de inserción
    const result = connectionDB.query(
      'INSERT INTO products (categoryId, name, description, size, price, imagePath, colors, stock, activated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [categoryId, name, description, size, price, imagePath, colors, stock, activated]
    );
  } catch (error) {
    console.error('Error fetching product:', error); // Imprimir el error
    res.status(500).send('Error fetching product.');
  }
});

// Eliminar un producto por ID
app.delete('/product/:id', (req, res) => {
  const { id } = req.params;

  try {
    const result = connectionDB.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows > 0) {
      res.status(200).send(`Producto con ID ${id} eliminado con éxito.`);
    } else {
      res.status(404).send('Producto no encontrado.');
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error al eliminar el producto.');
  }
});

// Editar un producto por ID
app.put('/product/:id', (req, res) => {
  const { id } = req.params;
  const { categoryId, name, description, size, price, imagePath, colors, stock, activated } = req.body;

  // Verificar si los datos obligatorios están presentes
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
    const result = connectionDB.query(
      `UPDATE products SET categoryId = ?, name = ?, description = ?, size = ?, price = ?, imagePath = ?, colors = ?, stock = ?, activated = ? WHERE id = ?`, 
      [categoryId, name, description, size, price, imagePath, colors, stock, activated, id]
    );

    if (result.affectedRows > 0) {
      res.status(200).send(`Producto con ID ${id} actualizado con éxito.`);
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

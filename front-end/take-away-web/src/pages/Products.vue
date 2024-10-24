<template>
  <!-- Contenedor principal que agrupa todos los elementos -->
  <v-container>
    <h1>Productos</h1> <!-- Título de la sección -->
    <v-row>
      <!-- Itera sobre cada producto en la lista de productos -->
      <v-col v-for="product in products" :key="product.id" cols="12" md="4">
        <v-card>
          <!-- Imagen del producto, con la ruta obtenida de la función getImagePath -->
          <v-img :src="getImagePath(product.imagePath)" height="200px"></v-img>
          <v-card-title>{{ product.name }}</v-card-title> <!-- Nombre del producto -->
          <v-card-subtitle>{{ product.category }} - {{ product.color }}</v-card-subtitle> <!-- Categoría y color del producto -->
          <v-card-text>
            <p>{{ product.description }}</p> <!-- Descripción del producto -->
            <p><strong>Tamaño:</strong> {{ product.size }}</p> <!-- Tamaño del producto -->
            <p><strong>Precio:</strong> ${{ product.price.toFixed(2) }}</p> <!-- Precio del producto formateado a dos decimales -->
            <p><strong>Stock:</strong> {{ product.stock }}</p> <!-- Cantidad en stock -->
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Edit</v-btn> <!-- Botón para editar el producto -->
            <v-btn color="red">Delete</v-btn> <!-- Botón para eliminar el producto -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'; // Importa funciones de Vue
import productsData from '@/assets/products.json'; // Importa datos de productos desde un archivo JSON
import imageImports from '@/assets/images/imageImports.js'; // Importa las imágenes

export default defineComponent({
  name: 'Products', // Nombre del componente
  setup() {
    const products = ref([]); // Define una referencia reactiva para los productos

    // Función para cargar los productos desde el archivo JSON
    const loadProducts = () => {
      products.value = productsData; // Asigna los datos a la referencia
      console.log('Productos cargados:', products.value); // Muestra los productos en la consola
    };

    // Función para obtener la ruta de la imagen según el nombre del archivo
    const getImagePath = (imagePath) => {
      return imageImports[imagePath] || ''; // Devuelve la ruta de la imagen o una cadena vacía si no se encuentra
    };

    // Carga los productos cuando el componente se monta
    onMounted(loadProducts);

    return {
      products, // Expone la referencia de productos
      getImagePath, // Expone la función para obtener la ruta de la imagen
    };
  },
});
</script>

<style scoped>
/* Estilos para el contenedor principal */
.v-container {
  margin-top: 20px; /* Espacio superior */
}

/* Espaciado entre cada tarjeta */
.v-row {
  margin-bottom: 20px; /* Espacio inferior */
}

/* Estilo de la tarjeta */
.v-card {
  transition: transform 0.2s; /* Efecto de transición al escalar */
}

.v-card:hover {
  transform: scale(1.05); /* Escala al pasar el mouse */
}

/* Estilos para la imagen de la tarjeta */
.v-img {
  border-top-left-radius: 4px; /* Esquinas redondeadas en la parte superior izquierda */
  border-top-right-radius: 4px; /* Esquinas redondeadas en la parte superior derecha */
}

/* Estilo del título de la tarjeta */
.v-card-title {
  font-weight: bold; /* Texto en negrita */
}

/* Estilo para el subtítulo */
.v-card-subtitle {
  color: #666; /* Color gris para el subtítulo */
}

/* Espacio entre texto y botón */
.v-card-text {
  padding-bottom: 10px; /* Espacio inferior en el texto */
}
</style>

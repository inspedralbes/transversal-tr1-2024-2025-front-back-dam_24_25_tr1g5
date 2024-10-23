<template>
    <v-container>
      <h1>Productos</h1>
      <v-row>
        <v-col v-for="product in products" :key="product.id" cols="12" md="4">
          <v-card>
            <v-img :src="getImagePath(product.imagePath)" height="200px"></v-img>
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-subtitle>{{ product.category }} - {{ product.color }}</v-card-subtitle>
            <v-card-text>
              <p>{{ product.description }}</p>
              <p><strong>Tamaño:</strong> {{ product.size }}</p>
              <p><strong>Precio:</strong> ${{ product.price.toFixed(2) }}</p>
              <p><strong>Stock:</strong> {{ product.stock }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary">Edit</v-btn>
              <v-btn color="red">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import productsData from '@/assets/products.json';
  import imageImports from '@/assets/images/imageImports.js'; // Importa las imágenes
  
  export default defineComponent({
    name: 'Products',
    setup() {
      const products = ref([]);
  
      const loadProducts = () => {
        products.value = productsData;
        console.log('Productos cargados:', products.value);
      };
  
      const getImagePath = (imagePath) => {
        return imageImports[imagePath] || ''; // Obtiene la ruta de la imagen del objeto
      };
  
      onMounted(loadProducts);
  
      return {
        products,
        getImagePath,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Estilos para el contenedor principal */
  .v-container {
    margin-top: 20px;
  }
  
  /* Espaciado entre cada tarjeta */
  .v-row {
    margin-bottom: 20px;
  }
  
  /* Estilo de la tarjeta */
  .v-card {
    transition: transform 0.2s;
  }
  
  .v-card:hover {
    transform: scale(1.05);
  }
  
  /* Estilos para la imagen de la tarjeta */
  .v-img {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  
  /* Estilo del título de la tarjeta */
  .v-card-title {
    font-weight: bold;
  }
  
  /* Estilo para el subtítulo */
  .v-card-subtitle {
    color: #666;
  }
  
  /* Espacio entre texto y botón */
  .v-card-text {
    padding-bottom: 10px;
  }
  </style>
  
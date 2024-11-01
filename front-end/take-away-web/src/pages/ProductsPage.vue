<template>
  <v-container>
    <h1>Productes</h1>
    <v-row>
      <v-col v-for="product in products" :key="product.id" cols="12" md="4">
        <v-card>
          <v-img :src="getImagePath(product.imagePath)" height="200px"></v-img>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle>{{ product.categoryId }} - {{ product.color }}</v-card-subtitle>
          <v-card-text>
            <p>{{ product.description }}</p>
            <p><strong>Talla:</strong> {{ product.size }}</p>
            <p><strong>Preu:</strong> ${{ Number(product.price).toFixed(2) }}</p>
            <p><strong>Stock:</strong> {{ product.stock }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary">Editar</v-btn>
            <v-btn color="red">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <p v-if="products.length == 0">No hi ha productes disponibles</p>

  <!-- Diálogo de editar producto -->
  <v-dialog >
    <v-card>
      <v-card-title class="headline">Editar Producte</v-card-title>
      <v-card-text>
        <v-text-field label="Nom" v-model="selectedProduct.name"></v-text-field>
        <v-text-field label="Descripció" v-model="selectedProduct.description"></v-text-field>
        <v-text-field label="Preu" v-model="selectedProduct.price"></v-text-field>
        <v-text-field label="Talla" v-model="selectedProduct.size"></v-text-field>
        <v-text-field label="Color" v-model="selectedProduct.color"></v-text-field>
        <v-text-field label="Stock" v-model="selectedProduct.stock"></v-text-field>
        <v-file-input
          label="Imatge"
          v-model="selectedProduct.imagePath"
          accept="image/*"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary">Guardar</v-btn>
        <v-btn color="red">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { getAllProducts } from '@/services/communicationManager.js';
import { ref, onMounted } from 'vue';

const products = ref([]);

const loadProducts = async () => {
  try {
    products.value = await getAllProducts();
    console.log('Productos cargados:', products.value);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
};

const getImagePath = (imagePath) => {
  let apiUrl = import.meta.env.VITE_URL_BACK;
  let imageUrl = apiUrl + imagePath;
  console.log(imageUrl);
  return imageUrl;
};

onMounted(loadProducts);
</script>

<style scoped>
.v-container {
  margin-top: 20px;
}

.v-row {
  margin-bottom: 20px;
}

.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: scale(1.05);
}

.v-img {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.v-card-title {
  font-weight: bold;
}

.v-card-subtitle {
  color: #666;
}

.v-card-text {
  padding-bottom: 10px;
}
</style>
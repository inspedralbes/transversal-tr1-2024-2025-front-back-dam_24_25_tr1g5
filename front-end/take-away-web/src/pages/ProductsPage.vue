<template>
  <v-container>
    <h1 class="mb-4">Productes</h1>
    <v-btn class="mb-5" color="green" @click="createProductModal = true">Crear nou producte</v-btn>
    <v-row>
      <v-col v-for="product in products" :key="product.id" cols="12" md="4">
        <v-card class="bg-grey-lighten-3">
          <div class="mt-3">
            <v-img :src="getImagePath(product.imagePath)" height="200px"></v-img>
          </div>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle>{{ product.categoryId }} - {{ product.color }}</v-card-subtitle>
          <v-card-text>
            <p>{{ product.description }}</p>
            <p><strong>Talla:</strong> {{ product.size }}</p>
            <p><strong>Preu:</strong> {{ Number(product.price).toFixed(2) }}€</p>
            <p><strong>Stock:</strong> {{ product.stock }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="editProductShowModal(product.id)">Editar</v-btn>
            <v-btn color="red" @click="deleteProductShowModal(product.id)">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <p v-if="products.length == 0">No hi ha productes disponibles</p>

  <!-- Diálogo de editar producto -->
  <v-dialog v-model="editProductModal" width="600">
    <v-card>
      <v-card-title class="headline">Editar Producte</v-card-title>
      <v-card-text>
        <v-text-field label="Nom" v-model="selectedProduct.name"></v-text-field>
        <v-text-field label="Descripció" v-model="selectedProduct.description"></v-text-field>
        <v-text-field label="Preu" v-model="selectedProduct.price"></v-text-field>
        <v-text-field label="Talla" v-model="selectedProduct.size"></v-text-field>
        <v-text-field label="Color" v-model="selectedProduct.color"></v-text-field>
        <v-text-field label="Stock" v-model="selectedProduct.stock"></v-text-field>
        <v-select
          label="Categoria"
          v-model="selectedProduct.categoryId"
          :items="typeCategories.map((category) => `${category.id} - ${category.name}`)"
        ></v-select>
        <v-select
          label="Actiu"
          v-model="selectedProduct.activated"
          :items="['Sí', 'No']"
          ></v-select>
        <v-file-input
          label="Imatge"
          v-model="selectedProduct.imagePath"
          accept="image/*"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="sendUpdateProduct(selectedProduct.id, selectedProduct)">Desar</v-btn>
        <v-btn color="red" @click="editProductModal = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo de eliminar producto -->
  <v-dialog v-model="deleteProductModal" width="400">
    <v-card>
      <v-card-title class="headline">Eliminar Producte</v-card-title>
      <v-card-text>
        <p>Estàs segur que vols eliminar aquest producte?</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="warning" @click="deleteProductModal = false">Cancelar</v-btn>
        <v-btn color="red" @click="sendDeleteProduct(selectedProduct.id)">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  ></v-dialog>

  <!-- Diálogo de crear producto -->
  <v-dialog v-model="createProductModal" width="600">
    <v-card>
      <v-card-title class="headline">Crear Producte</v-card-title>
      <v-card-text>
        <v-text-field label="Nom" v-model="newProduct.name"></v-text-field>
        <v-text-field label="Descripció" v-model="newProduct.description"></v-text-field>
        <v-text-field label="Preu" v-model="newProduct.price"></v-text-field>
        <v-text-field label="Talla" v-model="newProduct.size"></v-text-field>
        <v-text-field label="Color" v-model="newProduct.color"></v-text-field>
        <v-text-field label="Stock" v-model="newProduct.stock"></v-text-field>
        <v-select
          label="Categoria"
          v-model="newProduct.categoryId"
          :items="typeCategories.map((category) => `${category.id} - ${category.name}`)"
        ></v-select>
        <v-select
          label="Actiu"
          v-model="newProduct.activated"
          :items="['Sí', 'No']"
          ></v-select>
        <v-file-input
          label="Imatge"
          v-model="newProduct.imagePath"
          accept="image/*"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="sendCreateProduct(newProduct)">Crear</v-btn>
        <v-btn color="red" @click="createProductModal = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getAllCategories } from '@/services/communicationManager.js';
import { ref } from 'vue';

const products = ref([]);
const deleteProductModal = ref(false);
const createProductModal = ref(false);
const editProductModal = ref(false);
const selectedProduct = ref({});
const typeCategories = ref([]);
const newProduct = ref({});

const loadProducts = async () => {
  try {
    products.value = await getAllProducts();
    products.value.forEach((product) => {
      product.categoryId = product.categoryId + ' - ' + typeCategories.value.find((category) => category.id == product.categoryId).name;
    });
    console.log('Productos cargados:', products.value);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  } 
};

const loadCategories = async () => {
  try {
    typeCategories.value = await getAllCategories();
    console.log('Categorias cargadas:', typeCategories.value);
  } catch (error) {
    console.error('Error al cargar categorias:', error);
  }
};

loadCategories();
loadProducts();

const getImagePath = (imagePath) => {
  let apiUrl = import.meta.env.VITE_URL_BACK;
  let imageUrl = apiUrl + imagePath;
  console.log(imageUrl);
  return imageUrl;
};

const editProductShowModal = async (productId) => {
  console.log('Editando producto:', productId);
  getProductById(productId).then((data) => {
    selectedProduct.value = data[0];
    editProductModal.value = true;
    selectedProduct.value.categoryId = selectedProduct.value.categoryId + ' - ' + typeCategories.value.find((category) => category.id == selectedProduct.value.categoryId).name;
    selectedProduct.value.activated = selectedProduct.value.activated == 1 ? 'Sí' : 'No';
    console.log('Producto seleccionado:', data[0]);
  });
};

const sendUpdateProduct = async (productId, product) => {
  product.categoryId = parseInt(product.categoryId.split(' - ')[0], 10);
  product.activated = product.activated == 'Sí' ? 1 : 0;
  const imageInput = document.querySelector('input[type="file"]');
  console.log('Guardando producto:', productId, product);
  updateProduct(productId, product, imageInput.files[0]).then((data) => {
    console.log('Producto guardado:', data);
    editProductModal.value = false;
    loadProducts();
  });
};

const deleteProductShowModal = (productId) => {
  console.log('Eliminando producto:', productId);
  selectedProduct.value.id = productId;
  console.log('Producto seleccionado:', selectedProduct.value.id);
  deleteProductModal.value = true;
};

const sendCreateProduct = async (product) => {
  product.categoryId = parseInt(product.categoryId.split(' - ')[0], 10);
  product.activated = product.activated == 'Sí' ? 1 : 0;
  const imageInput = document.querySelector('input[type="file"]');
  console.log('Creando producto:', product);
  addProduct(product, imageInput.files[0]).then((data) => {
    console.log('Producto creado:', data);
    createProductModal.value = false;
    loadProducts();
  });
};

const sendDeleteProduct = async (productId) => {
  console.log('Eliminando producto:', productId);
  deleteProduct(productId).then((data) => {
    console.log('Producto eliminado:', data);
    deleteProductModal.value = false;
    loadProducts();
  });
};
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

.v-card-text {
  padding-bottom: 10px;
}


</style>
<template>
  <v-container>
    <h1>Productos</h1>
    <v-row>
      <v-col v-for="product in products" :key="product.id" cols="12" md="4">
        <v-card>
          <!-- Condicional: Muestra el formulario si está en modo edición -->
          <div if v-if="product.isEditing">
            <v-card-title>Editar Producto</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field v-model="product.editData.name" label="Nombre" ></v-text-field>
                <v-text-field v-model="product.editData.category" label="Categoría" ></v-text-field>
                <v-text-field v-model="product.editData.color" label="Color" ></v-text-field>
                <v-textarea v-model="product.editData.description" label="Descripción" ></v-textarea>
                <v-text-field v-model="product.editData.size" label="Tamaño" ></v-text-field>
                <v-text-field v-model="product.editData.price" label="Precio" type="number"></v-text-field>
                <v-text-field v-model="product.editData.stock" label="Stock" type="number"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="saveProduct(product)">Guardar</v-btn>
              <v-btn color="grey" @click="cancelEdit(product)">Cancelar</v-btn>
            </v-card-actions>
          </div>

          <!-- Muestra la tarjeta si no está en modo edición -->
          <div v-else>
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
              <v-btn color="primary" @click="editProduct(product)">Editar</v-btn>
              <v-btn color="red">Eliminar</v-btn>
            </v-card-actions>
          </div>
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
      // Al cargar los productos, agrega un campo para manejar el estado de edición
      products.value = productsData.map(product => ({
        ...product,
        isEditing: false, // Controla si el producto está en modo edición
        editData: { ...product } // Almacena los datos de edición temporalmente
      }));
      console.log('Productos cargados:', products.value);
    };

    const getImagePath = (imagePath) => {
      return imageImports[imagePath] || ''; // Obtiene la ruta de la imagen del objeto
    };

    const editProduct = (product) => {
      product.isEditing = true; // Activa el modo edición
    };

    const cancelEdit = (product) => {
      product.isEditing = false; // Desactiva el modo edición
      product.editData = { ...product }; // Restaura los datos originales
    };

    const saveProduct = (product) => {
      // Actualiza los datos del producto con los valores del formulario de edición
      product.name = product.editData.name;
      product.category = product.editData.category;
      product.color = product.editData.color;
      product.description = product.editData.description;
      product.size = product.editData.size;
      product.price = product.editData.price;
      product.stock = product.editData.stock;
      
      product.isEditing = false; // Sale del modo edición
    };

    onMounted(loadProducts);

    return {
      products,
      getImagePath,
      editProduct,
      cancelEdit,
      saveProduct,
    };
  },
});
</script>

<style >
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

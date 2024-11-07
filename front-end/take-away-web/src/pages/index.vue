<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1 class="text-h1 font-weight-black">Gestió de NAME?</h1>
    </div>
    <div class="button-group">
      <v-btn @click="goToProduct" size="x-large" color="indigo-darken-1"> 
        <v-icon style="margin-right: 3px;">mdi-shoe-sneaker</v-icon>
        Gestió Productes
      </v-btn>
      <v-btn @click="goToOrder" size="x-large" color="teal-darken-1">
        <v-icon style="margin-right: 3px;">mdi-cube</v-icon>
        Gestió Comandes
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goToProduct = () => router.push('/productsPage');
const goToOrder = () => router.push('/ordersPage');
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 100px;
  height: 100px;
}

.text-h1 {
  margin-top: 10px;
  text-shadow: 8px 4px 2px #959595;;
}

.button-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.v-btn {
  margin: 10px;
  margin-top: 20px;
}
</style>
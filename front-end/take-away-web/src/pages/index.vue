<template>
  <div class="container">
    <div class="header">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1 class="title">Gestió de NAME?</h1>
    </div>
    <div class="button-group">
      <button class="button">Gestió Productes</button>
      <button class="button">Gestió Comandes</button>
    </div>
  </div>
</template>

<script setup>
// Importamos la función useRouter
</script>

<style scoped>
/* Centramos la página */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #000000; /* Fondo suave */
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
}

/* Estilo de los botones */
.button-group {
  display: flex;
  gap: 15px;
}

.button {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #4d7c4e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #45a049;
}
</style>
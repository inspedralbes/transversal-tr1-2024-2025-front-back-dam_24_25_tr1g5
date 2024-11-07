<template>
    <v-app>
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="6" md="4">
            <v-card>
              <v-card-title>{{ titulo }}</v-card-title>
              <v-card-subtitle>{{ mensajeAleatorio }}</v-card-subtitle>
              <v-card-actions>
                <v-btn @click="generarMensajeAleatorio" color="primary">Generar mensaje</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'RandomMessage',
    data() {
      return {
        titulo: 'Aplicación de Vuetify',
        mensajes: [
          '¡Hola, Mundo!',
          'Vue.js y Vuetify son geniales',
          '¡Esta es una app increíble!',
          '¡Generando mensajes aleatorios!',
          'Aprendiendo Vue y Vuetify'
        ],
        mensajeAleatorio: '',
      };
    },
    methods: {
      generarMensajeAleatorio() {
        const randomIndex = Math.floor(Math.random() * this.mensajes.length);
        this.mensajeAleatorio = this.mensajes[randomIndex];
      },
    },
    mounted() {
      this.generarMensajeAleatorio();
    },
  };
  </script>
  
  <style scoped>
  /* Estilos específicos para este componente */
  v-card {
    max-width: 400px;
    margin: 20px auto;
  }
  
  v-btn {
    font-size: 16px;
  }
  </style>
  
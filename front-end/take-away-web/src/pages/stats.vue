<template>
  <v-container>
    <!-- ... otros elementos ... -->
    <v-btn @click="obtenerResumenVentas">Cargar Resumen</v-btn>
    <v-data-table
      v-if="resumenVentas.length > 0"
      :headers="headersResumen"
      :items="resumenVentas"
      :items-per-page="10"
    ></v-data-table>
    <p v-else-if="errorResumen">{{ errorResumen }}</p>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      resumenVentas: [],
      errorResumen: null,
      headersResumen: [
        { text: 'ID', value: 'ID' },
        { text: 'Cliente', value: 'Cliente' },
        { text: 'Ventas', value: 'Ventas' },
        { text: 'Total', value: 'Total' },
      ],
    };
  },
  methods: {
    async obtenerResumenVentas() {
      try {
        this.errorResumen = null;
        const response = await axios.get('/resumen-ventas');
        
        // Intenta parsear la respuesta como JSON
        const data = JSON.parse(response.data);
        
        if (Array.isArray(data)) {
          this.resumenVentas = data;
        } else {
          throw new Error('La respuesta no es un array válido');
        }
      } catch (error) {
        console.error('Error al obtener el resumen de ventas:', error);
        this.errorResumen = 'Error al obtener el resumen de ventas. Por favor, intente de nuevo.';
        this.resumenVentas = [];
      }
    },
  },
};
</script>
<template>
    <div class="orders-page">
        <v-container>
            <h1>Comandes</h1>
            <v-row>
                <!-- Recorre cada orden y la muestra como una tarjeta -->
                <v-col v-for="order in orders" :key="order.id" cols="12" md="4">
                    <v-card class="order-card">
                        <v-card-title class="order-title">
                            Comanda #{{ order.id }}
                        </v-card-title>
                        <v-card-subtitle class="order-subtitle">
                            <strong>Estat:</strong> {{ order.status }}
                        </v-card-subtitle>
                        <v-card-text class="order-details">
                            <p><strong>Data:</strong> {{ new Date(order.date).toLocaleString() }}</p>
                            <p><strong>Total:</strong> ${{ Number(order.total).toFixed(2) }}</p>
                            <p><strong>ID Usuari:</strong> {{ order.userId }}</p>
                            <p><strong>Productes:</strong> {{ order.productCount }}</p>
                        </v-card-text>
                        <v-card-actions class="action-buttons">
                            <v-btn color="primary">Editar</v-btn>
                            <v-btn color="info">Consultar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <p v-if="orders.length === 0" class="no-orders">No orders available</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAllCommands } from '@/services/communicationManager'

const orders = ref([])

getAllCommands().then((data) => {
    orders.value = data
    console.log(data)
})
</script>

<style scoped>
/* Estilo principal */
.orders-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
}

.v-container {
  margin-top: 20px; /* Espacio superior */
}

/* Título alineado a la izquierda */
.page-title {
    align-self: flex-start;
    margin-left: 40px;
    margin-top: 30px;
    /* Ajusta el margen según tus preferencias */
    color: #fff;
    font-size: 1.5em;
}

/* Contenedor y diseño de la tarjeta */
.order-card {
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;
    color: white;
    padding: 5%;
}

.order-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.order-title {
    font-weight: bold;
    color: #fff;
    text-align: center;
}

.order-subtitle {
    color: #ddd;
    text-align: center;
    font-size: 0.9em;
    margin-bottom: 10px;
}

.order-details {
    padding: 10px;
    color: #eee;
}

/* Botones de acción */
.action-buttons {
    display: flex;
    justify-content: space-around;
    padding: 10px;
}

/* Mensaje si no hay órdenes */
.no-orders {
    color: #999;
    font-size: 1.2em;
    text-align: center;
    margin-top: 20px;
}
</style>
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
                            <p><strong>Total:</strong>{{ Number(order.total).toFixed(2) }}€</p>
                            <p><strong>ID Usuari:</strong> {{ order.userId }}</p>
                            <p><strong>Productes:</strong> {{ order.productCount }}</p>
                        </v-card-text>
                        <v-card-actions class="action-buttons">
                            <v-btn @click="editarComanda(order.id)" color="primary">Editar</v-btn>
                            <v-btn @click="consultarComanda(order.id)" color="warning">Consultar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <p v-if="orders.length === 0" class="no-orders">No orders available</p>

        <!-- Diálogo de detalles de la comanda -->
        <v-dialog v-model="dialog" width="600">
            <v-card>
                <v-card-title class="headline">Detalls de la Comanda</v-card-title>
                <v-card-subtitle v-if="selectedOrder">
                    <p><strong>Comanda #{{ selectedOrder.order.id }}</strong></p>
                    <p><strong>Data:</strong> {{ new Date(selectedOrder.order.date).toLocaleString() }}</p>
                    <p><strong>Estat:</strong> {{ selectedOrder.order.status }}</p>
                    <p><strong>Total:</strong>{{ Number(selectedOrder.order.total).toFixed(2) }}€</p>
                    <p><strong>ID Usuari:</strong> {{ selectedOrder.order.userId }}</p>
                </v-card-subtitle>

                <v-card-text v-if="selectedOrder">
                    <h3>Productes</h3>
                    <v-list>
                        <v-list-item v-for="(product, index) in selectedOrder.products" :key="index">
                            <v-img :src="`${url}${product.imagePath}`" style="height: 100px; width: 100px;" />
                            <v-list-item-content>
                                <v-list-item-title>{{ product.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ product.description }}</v-list-item-subtitle>
                                <p><strong>Preu:</strong>{{ Number(product.price).toFixed(2) }}€</p>
                                <p><strong>Mida:</strong> {{ product.size }}</p>
                                <p><strong>Color:</strong> {{ product.color }}</p>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>

                <v-card-actions>
                    <v-btn class="ms-auto" text="Ok" @click="dialog = false">Tancar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAllCommands, getCommandById } from '@/services/communicationManager'

const orders = ref([])
const selectedOrder = ref(null) // Variable para guardar la comanda seleccionada
let dialog = ref(false)
let url = import.meta.env.VITE_URL_BACK

getAllCommands().then((data) => {
    orders.value = data
    console.log(data)
})

const editarComanda = (id) => {
    console.log('Editar comanda', id)
}

const consultarComanda = (id) => {
    console.log('Consultar comanda', id)
    getCommandById(id).then((data) => {
        selectedOrder.value = data
        dialog.value = true
    })
}
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
    margin-top: 20px;
    /* Espacio superior */
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
    margin-top: 5px;
}

/* Mensaje si no hay órdenes */
.no-orders {
    color: #999;
    font-size: 1.2em;
    text-align: center;
    margin-top: 20px;
}

.v-list-item {
    border-top: #ddd solid 1px;
    display: flex;
    align-items: center;
    margin: 10px;
}
</style>
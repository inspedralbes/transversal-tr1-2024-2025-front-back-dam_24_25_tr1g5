<template>
    <div class="orders-page">
        <v-container>
            <h1 class="mb-4">Comandes</h1>
            <v-btn class="mb-5 mr-4" color="indigo" @click="showAllOrders()">Totes les comandes</v-btn>
            <v-btn class="mb-5 mr-4" color="brown" @click="showOnlyOrdersPendentConfirmacio()">Llistat de noves comandes</v-btn>
            <v-btn class="mb-5 mr-4" color="warning" @click="showOnlyOrdersPreparant()">Preparant comandes</v-btn>
            <v-btn class="mb-5 mr-4" color="deep-purple" @click="showOnlyOrdersLlestPerRecollir()">Comandes per recollir</v-btn>
            <v-alert
                text="Si la comanda està en verd, vol dir que s'ha començat ha preparar fa menys d'un dia. Si està en groc, vol dir que s'ha començat ha preparar fa menys de tres dies. Si està en vermell, vol dir que s'ha començat ha preparar fa més de tres dies."
                title="Informació"
                type="info"
                variant="tonal"
                class="mb-4"
            ></v-alert>
            <v-row>
                <!-- Recorre cada orden y la muestra como una tarjeta -->
                <v-col v-for="order in orders" :key="order.id" cols="12" md="4">                    
                    <v-card class="order-card" :class="[order.status == 'Preparant' ? getOrderCardColor(order.date) : 'bg-grey-lighten-3' ]">
                        <v-card-title class="order-title">
                            Comanda #{{ order.id }}
                        </v-card-title>
                        <div class="d-flex justify-center" v-if="order.status == 'Pendent de confirmació'">
                            <v-btn class="mb-3 mr-3" color="green" @click="sendEditOrder(order.id, 'Confirmat')">Acceptar</v-btn>
                            <v-btn class="mb-3 mr-3" color="red" @click="sendEditOrder(order.id, 'Cancelat')">Denegar</v-btn>
                        </div>
                        <v-card-subtitle class="order-subtitle">
                            <strong>Estat:</strong> {{ order.status }}
                        </v-card-subtitle>
                        <v-card-text class="order-details">
                            <p><strong>Data:</strong> {{ new Date(order.date).toLocaleString() }}</p>
                            <p><strong>Total:</strong>{{ Number(order.total).toFixed(2) }}€</p>
                            <p><strong>Pagament:</strong> {{ order.pay == 0 ? 'Pendent' : 'Fet' }}</p>
                            <p><strong>ID Usuari:</strong> {{ order.userId }}</p>
                            <p><strong>Productes:</strong> {{ order.productCount }}</p>
                        </v-card-text>
                        <v-card-actions class="action-buttons">
                            <v-btn @click="editOrder(order.id)" color="primary">Editar</v-btn>
                            <v-btn @click="orderDetails(order.id)" color="warning">Consultar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <p v-if="orders.length == 0" class="no-orders">No hi ha ordres disponibles</p>
        <!-- Diálogo de detalles de la comanda -->
        <v-dialog v-model="orderDetailsModal" width="600">
            <v-card>
                <v-card-title class="headline">Detalls de la Comanda</v-card-title>
                <v-card-subtitle v-if="selectedOrder">
                    <p><strong>Comanda #{{ selectedOrder.order.id }}</strong></p>
                    <p><strong>Data:</strong> {{ new Date(selectedOrder.order.date).toLocaleString() }}</p>
                    <p><strong>Estat:</strong> {{ selectedOrder.order.status }}</p>
                    <p><strong>Total:</strong> {{ Number(selectedOrder.order.total).toFixed(2) }}€</p>
                    <p><strong>Pagament:</strong> {{ selectedOrder.order.pay === 0 ? 'Pendent' : 'Fet' }}</p>
                    <p><strong>ID Usuari:</strong> {{ selectedOrder.order.userId }}</p>
                    <p><strong>Nom:</strong> {{ selectedOrder.user.firstName }} {{ selectedOrder.user.lastName }}</p>
                    <p><strong>Email:</strong> {{ selectedOrder.user.email }}</p>
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
                    <v-btn class="ms-auto" text="Ok" @click="orderDetailsModal = false"
                        color="teal-accent-3">Tancar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Diálogo de editar status -->
        <v-dialog v-model="editOrderModal" width="600">
            <v-card>
                <v-card-title class="headline">Editar Comanda</v-card-title>
                <v-card-text>
                    <p>Selecciona el nou estat de la comanda</p>
                    <v-select v-model="selectedOrder.status" :items="['Pendent de confirmació', 'Confirmat', 'Preparant', 'Llest per recollir', 'Entregat', 'Cancelat']"
                        label="Estat" />
                </v-card-text>
                <v-card-actions>
                    <v-btn class="ms-auto" text="Ok"
                        @click="sendEditOrder(selectedOrder.order.id, selectedOrder.status)"
                        color="teal-accent-3">Desar</v-btn>
                    <v-btn text="Cancel" @click="editOrderModal = false" color="red">Cancel·lar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAllCommands, getCommandById, updateCommand } from '@/services/communicationManager'

const allOrders = ref([])   
const selectedOrder = ref(null) 
let orders = ref([])
let orderDetailsModal = ref(false)
let editOrderModal = ref(false)
let url = import.meta.env.VITE_URL_BACK

const loadOrders = () => {
    getAllCommands().then((data) => {
        orders.value = data
        allOrders.value = data
        console.log(data)
    })
}

loadOrders()

const editOrder = (id) => {
    console.log('Editar comanda', id)
    getCommandById(id).then((data) => {
        selectedOrder.value = data
        editOrderModal.value = true
    })
}

const orderDetails = (id) => {
    console.log('Consultar comanda', id)
    getCommandById(id).then((data) => {
        selectedOrder.value = data
        orderDetailsModal.value = true
    })
}

const sendEditOrder = (id, status) => {
    console.log('Enviar edición de comanda', id, status)
    const editStatus = {
        status: status
    }
    updateCommand(id, editStatus).then(() => {
        editOrderModal.value = false
        loadOrders()
    })
}

const showAllOrders = () => {
    orders.value = allOrders.value
}

const showOnlyOrdersPendentConfirmacio = () => {
    orders.value = allOrders.value
    orders.value = orders.value.filter((order) => order.status == 'Pendent de confirmació')
}

const showOnlyOrdersPreparant = () => {
    orders.value = allOrders.value
    orders.value = orders.value.filter((order) => order.status == 'Preparant')

    orders.value.forEach((order) => {
        order.color = getOrderCardColor(order.dateStart)
    })
}

const getOrderCardColor = (orderDate) => {
    const date = new Date(orderDate);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
        return 'bg-green-lighten-4';
    } else if (diffDays <= 3) {
        return 'bg-yellow-lighten-4';
    } else {
        return 'bg-red-lighten-4';
    }
}

const showOnlyOrdersLlestPerRecollir = () => {
    orders.value = allOrders.value
    orders.value = orders.value.filter((order) => order.status == 'Llest per recollir')
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
    font-size: 1.5em;
}

/* Contenedor y diseño de la tarjeta */
.order-card {
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;
    padding: 5%;
}

.order-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.order-title {
    font-weight: bold;
    text-align: center;
}

.order-subtitle {
    text-align: center;
    font-size: 0.9em;
    margin-bottom: 10px;
}

.order-details {
    padding: 10px;
}

/* Botones de acción */
.action-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 5px;
}

/* Mensaje si no hay órdenes */
.no-orders {
    font-size: 1.2em;
    text-align: center;
    margin-top: 20px;
}

.headline {
    margin-top: 10px;
}

.v-list-item {
    border-top: #000000 solid 1px;
    display: flex;
    align-items: center;
    margin: 10px;
    padding-top: 20px;
}

.v-img {
    margin-bottom: 20px;
}

.v-select {
    margin-top: 20px;
}
</style>
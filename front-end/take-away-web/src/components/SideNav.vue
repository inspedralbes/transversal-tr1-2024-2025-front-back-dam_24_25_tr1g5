<template>
  <v-navigation-drawer app permanent width="80" class="grey lighten-3">
    <v-list-item class="d-flex justify-center">
      <v-icon large>mdi-alpha-n-box</v-icon>
    </v-list-item>

    <v-divider></v-divider>
    <v-list dense>
      <v-list-item-group>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="handleClick(item.path)"
        >
          <v-list-item-icon>
            <v-btn icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-spacer></v-spacer>

    <v-list-item class="d-flex justify-center">
      <v-btn icon @click="handleProfileClick">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SideNav',
  setup() {
    const router = useRouter();
    
    const items = ref([
      { icon: 'mdi-home', path: '/home' },
      { icon: 'mdi-shoe-sneaker', path: '/products' },
      { icon: 'mdi-cube', path: '/cube' },
      { icon: 'mdi-cog', path: '/settings' },
      { icon: 'mdi-format-list-bulleted', path: '/list' },
      
    ]);

    const handleClick = (path) => {
      router.push(path); // Navega a la ruta
    };

    const handleProfileClick = () => {
      console.log('Perfil clickeado');
    };

    return {
      items,
      handleClick,
      handleProfileClick,
    };
  },
});
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid #e0e0e0;
}
.v-btn {
  margin: 0;
  padding: 0;
}
</style>

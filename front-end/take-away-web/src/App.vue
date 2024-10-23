<template>
  <v-app>
    <SideNav />
    <!-- Contenido principal -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SideNav from '@/components/SideNav.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    SideNav,
  },
});
</script>

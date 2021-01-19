<template>
  <div id="app">
        <keep-alive v-if="$route.meta.keepAlive">
        <router-view />
        </keep-alive>
      <router-view class="router" v-else></router-view>
  </div>
</template>

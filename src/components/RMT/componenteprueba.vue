<template>
  <div>
    <h2>Prueba Componente global, prop: {{parametro}}</h2>
  </div>
</template>
<script>
export default {
  props: ["parametro"],
  data() {
    return {};
  }
};
</script>
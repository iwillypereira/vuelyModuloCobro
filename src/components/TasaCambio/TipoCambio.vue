<template>
  <v-text-field
    :value="value"
    :append-icon="'mdi-refresh'"
    label="Tipo de Cambio"
    @click:append="changeTipoCambio"
    @input="handleInput"
  ></v-text-field>
  <!-- <tasa-cambio :changeTasaCambio="valorcambiado"></tasa-cambio> -->
  <!-- https://es-vuejs.github.io/vuejs.org/v2/guide/components.html -->
</template>

<script>
export default {
  name: "tipo-cambio",
  props: ["value"],
  data() {
    return {};
  },
  methods: {
    changeTipoCambio() {
      this.$http
        .post(
          'https://www.rutamayatravel.com/' + this.sur4 + "/contabilidad/comprobantesPago/modificarTipoCambio",
          {
            importe: this.value
          },
          {
            emulateJSON: true
          }
        )
        .then(
          function(response) {
            this.$emit("success-change", response.body);
          }
        );
    },
    handleInput(e) {
      this.$emit("input", e);
    }
  }
};
</script>

<style scoped>
</style>
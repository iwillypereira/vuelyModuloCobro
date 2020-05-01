<template>
  <div>
    <v-container>
      <h3>{{numero}}</h3>
      <v-card>
        <the-mask :mask="['+## (##)-####-####', '+## (##)-####-####']" v-model="numero" />
        <money v-model="price" v-bind="money"></money> {{price}}
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      array_notificaciones: [],
      numero: "",
      price: 123.45,
      money: {
        decimal: ".",
        thousands: ",",
        prefix: "$ ",
        suffix: "",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  mounted() {
    this.loadPaquetes();
  },
  methods: {
    formatDate(date) {
      if (!date) {
        return null;
      }
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    formatPrice(value) {
      var redondear = Math.ceil(value);
      let val = (redondear / 1).toFixed(2).replace(",", ".");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    loadPaquetes() {
      this.loader = true;
    }
  }
};
</script>

<style>
</style>
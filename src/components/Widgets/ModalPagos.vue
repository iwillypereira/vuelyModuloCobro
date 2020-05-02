<template>
  <v-dialog
    :value="value"
    @input="$emit('input')"
    fullscreen
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="pink">
        <v-toolbar-title>PAGAR ORDEN DE PAGO #{{jsonOrdenPago.id_orden_pago}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click.native="toggleModal" class="pt-0">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <!-- props['cerrarmodal','abrirmodal','total_saldo','total_saldo_usd'] -->
        <v-btn color="blue darken-1" text @click.native="toggleModal">Cancelar</v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "modal-pagos",
  props: ["value", "saldo", "saldoUSD", "jsonOrdenPago"],
  data() {
    return {};
  },
  methods: {
    toggleModal() {
      this.$emit("input", false);
      this.$emit("hideModal");
    }
  }
};
</script>

<style lang="stylus" scoped></style>
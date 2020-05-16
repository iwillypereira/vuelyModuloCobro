<template>
  <div>
    <v-skeleton-loader v-show="skeleton_hidden" max-width="500" type="text@5"></v-skeleton-loader>
    <v-simple-table v-show="tableShow">
      <template v-slot:default>
        <tbody>
          <tr>
            <td>
              <b>Total Habitaciones:</b>
            </td>
            <td>$ {{ $RMT.formatoPrecio(array_saldoBloqueo.totaHabitaciones) }}</td>
          </tr>
          <tr>
            <td>
              <b>Total Neto:</b>
            </td>
            <td>$ {{ $RMT.formatoPrecio(array_saldoBloqueo.totalNeto) }}</td>
          </tr>
          <tr>
            <td>
              <b>- Comisión Agencia</b>
            </td>
            <td>$ {{ $RMT.formatoPrecio(array_saldoBloqueo.comisionAgencia) }}</td>
          </tr>
          <tr>
            <td>
              <b>Total Agencia:</b>
            </td>
            <td>$ {{ $RMT.formatoPrecio(array_saldoBloqueo.totalAgencia) }}</td>
          </tr>
          <tr>
            <td>
              <b>- Notas de Crédito:</b>
            </td>
            <td>$ {{ $RMT.formatoPrecio(array_saldoBloqueo.notasCredito) }}</td>
          </tr>
          <tr>
            <td>
              <b>- Recibos Aplicados:</b>
            </td>
            <td>$ {{ $RMT.formatoPrecio(array_saldoBloqueo.recibosAplicados) }}</td>
          </tr>
          <tr>
            <td>
              <b>Saldo por pagar a RMT:</b>
            </td>
            <td>$ {{ $RMT.formatoPrecio(array_saldoBloqueo.saldoPagar) }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
    /* puedo pasar cualquier variable por medio de los props, por ejemplo en el 
    <saldos-bloqueo :bloqueo="$route.params.id"></saldos-bloqueo> pase el id del bloqueo por el props
    el props lo toma del componente padre y lo vuelve una variable en el componente hijo para ser usado por esta
    */
  name: "saldo-bloqueo",
  inject: ["theme"],
  props: ["bloqueo"],
  data() {
    return {
      array_saldoBloqueo: [],
      skeleton_hidden: true,
      tableShow: false,
      idBloqueo: ""
    };
  },
  created() {
    this.idBloqueo = this.bloqueo;
    this.getTablaSaldo();
  },
  methods: {
    getTablaSaldo() {
      this.$http
        .get(
          "https://www.rutamayatravel.com/sur4dev/admin/contabilidad/ordenPago/bloqueoSaldo/idBloqueo/" +
            this.idBloqueo
        )
        .then(
          function(response) {
            this.array_saldoBloqueo = response.body;
            this.skeleton_hidden = false;
            this.tableShow = true;
            console.log(response.body);
          },
          function() {
            console.log("Error");
          }
        );
    },
    formatoPrecio(num) {
        var redondear = Math.ceil(num);
      let val = (redondear / 1).toFixed(2).replace(",", ".");
      // console.log(value);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //   return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    changeUsername() {
      this.$emit("changeUsername");
    }
  }
};
</script>

<style lang="stylus" scoped></style>
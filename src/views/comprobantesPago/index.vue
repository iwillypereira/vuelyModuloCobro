<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid>
      <v-row class="mt-0">
        <app-card
          colClasses="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 "
          customClasses="mb-0 mt-0"
        >
          <h3>Comprobantes de Pago</h3>
          <v-data-table
            :headers="headers_comprobantes"
            :items="array_comprobantes"
            item-key="name"
            class="elevation-1"
            :loading="loader"
            loading-text="Cargando... Espere"
          >
            <template v-slot:item="props">
              <tr>
                <td class="text-right">
                  <a
                    :href="redirectRMT + sur4 + '/contabilidad/ordenPago/GeneratePdf/idOrden/' + props.item.id_orden_pago"
                    target="_blank"
                  >{{ props.item.id_comprobante_pago }}</a>
                </td>
                <td>{{ props.item.descripcion }}</td>
                <td class="text-right">$ {{ formatPrice(props.item.importe) }}</td>
                <td class="text-center">{{ formatDate(props.item.log) }}</td>
                <td>{{ props.item.nombre_agencia }}</td>
                <td>{{ props.item.nombre_usuario }}</td>
                <td class="text-right">{{ props.item.comision }}</td>
                <td>
                  <v-chip
                    :color="getEstatus(props.item.estatus,'color')"
                    dark
                  >{{ getEstatus(props.item.estatus,'estatus') }}</v-chip>
                </td>
                <td class="text-center">
                  <!-- agregar en facturacion y en el metodo crear factura el tipo comprobante -->
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <a
                        v-if="props.item.facturacion==true"
                        v-on="on"
                        :href="redirectRMT + 'sur4test/facturacionCfdi/factura/idrecibo/' + props.item.id_comprobante_pago + '/tipo/comprobante'"
                        target="_blank"
                        style="color:black; padding-right:5px;"
                      >
                        <v-icon>fas fa-file-alt</v-icon>
                      </a>
                    </template>
                    <span>Facturar Comprobante</span>
                  </v-tooltip>
                  <!-- <v-icon
                    v-if="props.item.estatus=='P'"
                    @click="ponerFacturado(props.item.id_comprobante_pago)"
                  >far fa-check-square</v-icon>-->
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-snackbar
            v-model="snackbar"
            :bottom="true"
            :right="true"
            :color="'success'"
            :timeout="1000"
          >
            {{ text }}
            <v-btn color="white" text @click="snackbar = false">Cerrar</v-btn>
          </v-snackbar>
        </app-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      loader: false,
      array_comprobantes: [],
      headers_comprobantes: [
        {
          text: "Folio",
          value: "id_comprobante_pago",
          sortable: true
        },
        { text: "Tipo de Pago", value: "descripcion", sortable: true },
        { text: "Importe", value: "importe", sortable: true },
        { text: "Fecha Creación", value: "log", sortable: true },
        { text: "Agencia", value: "nombre_agencia", sortable: true },
        { text: "Usuario Elaboró", value: "nombre_usuario", sortable: true },
        { text: "% Comisión", value: "comision", sortable: true },
        { text: "Estatus", value: "estatus", sortable: true },
        { text: "Facturación", value: "actions", sortable: false }
      ],
      snackbar: false,
      text: "Comprobante Facturado"
    };
  },
  methods: {
    loadComprobantes() {
      // alert("mounted");
      this.loader = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/" +
            this.sur4 +
            "/contabilidad/comprobantesPago/obtenerComprobantesPago"
        )
        .then(
          function(response) {
            this.array_comprobantes = response.data;
            this.loader = false;
          },
          function() {
            console.log("Error");
          }
        );
    },
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY");
    },
    formatPrice(value) {
      var redondear = Math.ceil(value);
      let val = (redondear / 1).toFixed(2).replace(",", ".");
      // console.log(value);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getEstatus(estatus, peticion) {
      var valor = "";
      switch (estatus) {
        case "C":
          if (peticion == "estatus") {
            valor = "Cancelado";
          } else {
            valor = "red";
          }
          break;
        case "AP":
          if (peticion == "estatus") {
            valor = "Aplicado";
          } else {
            valor = "orange";
          }
          break;
        case "P":
        default:
          if (peticion == "estatus") {
            valor = "Pagado";
          } else {
            valor = "green";
          }
          break;
      }

      return valor;
    },
    ponerFacturado: function(item) {
      this.snackbar = true;
      console.log(item);
      //   this.$http
      //     .post(redirectRMt + sur4 + "/pagos/quitarRecibo", {
      //       id: item,
      //       tipo: "comprobante"
      //     })
      //     .then(function(response) {});
    }
  },
  computed: {},
  mounted() {
    this.loadComprobantes();
  }
};
</script>
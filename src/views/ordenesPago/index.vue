<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid>
      <v-row class="mt-0">
        <app-card
          colClasses="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 "
          customClasses="mb-0 mt-0"
        >
          <!-- <h3>Ordenes de Pago</h3> -->
          <v-card-title>
            Ordenes de Pago
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers_ordenes"
            :items="array_ordenes"
            :search="search"
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
                  >{{ props.item.id_orden_pago }}</a>
                </td>
                <td>{{ props.item.nombre_agencia }}</td>
                <td class="text-center">{{ formatDate(props.item.log) }}</td>
                <td class="text-right">$ {{ formatPrice(props.item.importe_total) }}</td>
                <td>{{ props.item.observaciones }}</td>
                <td>{{ props.item.nombre_usuario }}</td>
                <td>
                  <v-chip
                    :color="getEstatus(props.item.estatus,'color')"
                    dark
                  >{{ getEstatus(props.item.estatus,'estatus') }}</v-chip>
                </td>
                <td class="text-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" @click="OpenDialog(props.item.id_orden_pago)">fas fa-list-ol</v-icon>
                    </template>
                    <span>Detalles de la Orden</span>
                  </v-tooltip>
                  <a
                    :href="redirectRMT + sur4 + '/contabilidad/ordenPago/GeneratePdf/idOrden/' + props.item.id_orden_pago"
                    target="_blank"
                    style="color:black;padding-left:4px;"
                  >
                    <v-icon>fas fa-file-pdf</v-icon>
                  </a>
                </td>
              </tr>
            </template>
            <!-- <template v-slot:body.append="{ items }">
              <tr>
                <td :colspan="3">Total:</td>
                <td>{{items}}</td>
              </tr>
            </template>-->
          </v-data-table>
        </app-card>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialog">
          <v-card>
            <v-card-title>
              <span class="headline">Folio: #{{ folio_orden_pago }}</span>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers_detalles"
                :items="array_detalles"
                item-key="nameD"
                class="elevation-1"
                :loading="loaderD"
                loading-text="Cargando... Espere"
              >
                <template v-slot:item="props">
                  <tr>
                    <td class="text-right">{{ props.item.id_orden_pago_detalles }}</td>
                    <td class="text-right">
                      <span v-if="props.item.tipo_producto=='Reservacion'">
                        <a
                          :href="redirectRMT + sur4 + '/reservacion/view/id/' + props.item.identificador"
                          target="_blank"
                        >H{{ props.item.identificador }}</a>
                      </span>
                      <span v-else-if="props.item.tipo_producto=='Actividad'">
                        <a
                          :href="redirectRMT + sur4 + '/activities/view/id/' + props.item.identificador"
                          target="_blank"
                        >A{{ props.item.identificador }}</a>
                      </span>
                      <span v-else-if="props.item.tipo_producto=='Tour'">
                        <a
                          :href="redirectRMT + sur4 + '/tourReservacion/view/id/' + props.item.identificador"
                          target="_blank"
                        >T{{ props.item.identificador }}</a>
                      </span>
                      <span v-else-if="props.item.tipo_producto=='Grupo'">
                        <a
                          :href="redirectRMT + sur4 + '/bloqueos/view/id/' + props.item.identificador"
                          target="_blank"
                        >G{{ props.item.identificador }}</a>
                      </span>
                      <span v-else-if="props.item.tipo_producto=='Boda'">
                        <a
                          :href="redirectRMT + sur4 + '/bloqueos/view/id/' + props.item.identificador"
                          target="_blank"
                        >B{{ props.item.identificador }}</a>
                      </span>
                      <span v-else>
                        <a
                          :href="redirectRMT + sur4 + '/bloqueos/view/id/' + separarHabitacion(props.item.identificador,0)"
                          target="_blank"
                        >{{ props.item.identificador }}</a>
                      </span>
                    </td>
                    <td>{{ props.item.descripcion }}</td>
                    <td>{{ props.item.tipo_producto }}</td>
                    <td class="text-right">$ {{ formatPrice(props.item.importe) }}</td>
                    <td>
                      <v-btn
                        class="ma-2"
                        outlined
                        fab
                        small
                        color="error"
                        @click="DialogQuitItem(props.item)"
                      >
                        <v-icon>fas fa-trash-alt</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog_eliminar_detalle" max-width="600">
          <v-card>
            <v-card-title class="headline">¿Estas seguro de eliminar la orden {{ idEliminar }}?</v-card-title>

            <v-card-text>Estas a punto de eliminar un detalle de la orden.</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="red darken-1"
                text
                @click="dialog_eliminar_detalle = false; idEliminar = ''; itemEliminar = [];"
              >CANCELAR</v-btn>

              <v-btn color="error darken-1" dark @click="quitItem();">Eliminar</v-btn>
              <!-- <v-btn color="green darken-1" dark @click="dialog_guardar_pagar=true">GUARDAR</v-btn> -->
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      search: "",
      array_ordenes: [],
      headers_ordenes: [
        {
          text: "Folio",
          value: "id_orden_pago",
          sortable: true
        },
        { text: "Agencia", value: "nombre_agencia", sortable: true },
        { text: "Fecha Creación", value: "log", sortable: true },
        { text: "Importe", value: "importe_total", sortable: true },
        { text: "Observaciones", value: "observaciones", sortable: true },
        { text: "Usuario Elaboró", value: "nombre_usuario", sortable: true },
        { text: "Estatus", value: "estatus", sortable: true },
        { text: "Acciones", value: "actions", sortable: false }
      ],
      dialog: false,
      folio_orden_pago: 0,
      loaderD: false,
      array_detalles: [],
      headers_detalles: [
        {
          text: "ID",
          value: "id_orden_pago_detalles",
          sortable: true
        },
        { text: "Identificador", value: "identificador", sortable: true },
        { text: "Descripción", value: "descripcion", sortable: true },
        { text: "Tipo", value: "tipo_producto", sortable: true },
        { text: "Importe", value: "importe", sortable: true },
        { text: "Acciones", value: "actions", sortable: false }
      ],
      dialog_eliminar_detalle: false,
      idEliminar: "",
      itemEliminar: []
    };
  },
  methods: {
    loadOrdenes() {
      // alert("mounted");
      this.loader = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/"+this.sur4+"/contabilidad/ordenPago/obtenerOrdenesPago"
        )
        .then(
          function(response) {
            this.array_ordenes = response.data;
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
    OpenDialog: function(item) {
      this.dialog = true;
      this.array_detalles = [];
      this.folio_orden_pago = item;
      this.ObtenerOrdenDetalles(item);
    },
    ObtenerOrdenDetalles: function(item) {
      this.loaderD = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/"+this.sur4+"/contabilidad/ordenPago/obtenerOrdenesDetalles?idOrden=" +
            item
        )
        .then(
          function(response) {
            this.array_detalles = response.data.row;
            this.loaderD = false;
          },
          function() {
            console.log("Error");
          }
        );
    },
    separarHabitacion: function(item, posicion) {
      var items = item.split("-");
      return items[posicion];
    },
    getEstatus(estatus, peticion) {
      var valor = "";
      switch (estatus) {
        case "PE":
          if (peticion == "estatus") {
            valor = "Pendiente";
          } else {
            valor = "orange";
          }
          break;
        case "C":
          if (peticion == "estatus") {
            valor = "Cancelado";
          } else {
            valor = "red";
          }
          break;
        case "PP":
          if (peticion == "estatus") {
            valor = "Pago Parcial";
          } else {
            valor = "blue";
          }
          break;
        case "PA":
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
    sumaImporte(key) {
      return this.array_ordenes.reduce((a, b) => a + (b[key] || 0), 0);
    },
    DialogQuitItem(item) {
      this.dialog_eliminar_detalle = true;
      this.itemEliminar = item;
      this.idEliminar = this.prefijoIdentificador(
        item.tipo_producto,
        item.identificador
      );
    },
    prefijoIdentificador(tipo, identificador) {
      var prefijo = "";
      switch (tipo) {
        case "Reservacion":
          prefijo = "H" + identificador;
          break;
        case "Actividad":
          prefijo = "A" + identificador;
          break;
        case "Tour":
          prefijo = "T" + identificador;
          break;
        case "Grupo":
          prefijo = "G" + identificador;
          break;
        case "Boda":
          prefijo = "B" + identificador;
          break;
        default:
          prefijo = identificador;
          break;
      }
      return prefijo;
    },
    quitItem() {
      var data = {
        id_orden_pago_detalles: this.itemEliminar.id_orden_pago_detalles
      };
      this.$http
        .post("https://www.rutamayatravel.com/"+this.sur4+"/contabilidad/ordenPago/eliminarDetalle", data, {
          emulateJSON: true
        })
        .then(function(response) {
          console.log(response);
          this.dialog_eliminar_detalle = false;
        });
    }
  },
  computed: {},
  mounted() {
    this.loadOrdenes();
  }
};
</script>
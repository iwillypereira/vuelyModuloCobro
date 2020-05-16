<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid>
      <v-row class="mt-0">
        <v-col cols="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
          <multiselect
            v-model="selected_agencia"
            :options="listaAgencias"
            id="ajax"
            track-by="id_agencia"
            label="nombre_agencia"
            placeholder="Buscar Agencia"
            open-direction="bottom"
            :searchable="true"
            :loading="isLoading"
            :internal-search="false"
            :clear-on-select="false"
            :close-on-select="true"
            :options-limit="50"
            :max-height="600"
            @search-change="asyncFind"
            :preserve-search="true"
            :show-labels="false"
            autocomplete="off"
            @select="changeTables"
          >
            <template slot="tag" slot-scope="{ option, remove }">
              <span class="custom__tag">
                <span>{{ option.nombre_agencia }}</span>
                <span class="custom__remove" @click="remove(option)">❌</span>
              </span>
            </template>
            <span slot="noResult">Oops! No se encontraron resultados. Considere cambiar la búsqueda.</span>
            <span slot="noOptions">No hay agencia seleccionada.</span>
          </multiselect>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <app-card
          colClasses="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 "
          customClasses="mb-0 mt-0"
        >
          <h3>Recibos</h3>
          <v-data-table
            :headers="headers_recibo"
            :items="array_recibos"
            item-key="name"
            class="elevation-1"
            :loading="loader"
            loading-text="Cargando... Espere"
            :locale="'es-MX'"
          >
            <template v-slot:item="props">
              <tr>
                <td class="text-xs-right">{{ props.item.id_recibo }}</td>
                <td class="text-xs-right">{{ props.item.descripcion }}</td>
                <td class="text-xs-right">$ {{ formatPrice(props.item.importe) }}</td>
                <td class="text-xs-right">{{ formatDate(props.item.log) }}</td>
              </tr>
            </template>
            <!-- <template v-slot:body.append="{ headers }">
              <tr>
                <td :colspan="headers.length">This is an appended row</td>
              </tr>
            </template> -->
          </v-data-table>
        </app-card>
        <app-card
          colClasses="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 "
          customClasses="mb-0 mt-0"
        >
          <h3>Notas de Crédito</h3>
          <v-data-table
            :headers="headers_notas_credito"
            :items="array_notas_credito"
            item-key="nameNC"
            class="elevation-1"
            :loading="loaderNC"
            loading-text="Cargando... Espere"
          >
            <template v-slot:item="props">
              <tr>
                <td class="text-xs-right">{{ props.item.id_nota_credito }}</td>
                <td class="text-xs-right">{{ props.item.descripcion }}</td>
                <td class="text-xs-right">$ {{ formatPrice(props.item.importe) }}</td>
                <td class="text-xs-right">{{ formatDate(props.item.fecha_realizada) }}</td>
              </tr>
            </template>
          </v-data-table>
        </app-card>
        <app-card
          colClasses="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 "
          customClasses="mb-0 mt-0"
        >
          <h3>Comisión de Agencia</h3>
          <v-data-table
            :headers="headers_comision_agencias"
            :items="array_comision_agencias"
            item-key="nameCA"
            class="elevation-1"
            :loading="loaderCA"
            loading-text="Cargando... Espere"
          >
            <template v-slot:item="props">
              <tr>
                <td class="text-xs-right">{{ props.item.id }}</td>
                <td class="text-xs-right">{{ props.item.id_reservacion }}</td>
                <td class="text-xs-right">{{ props.item.tipo_pago }}</td>
                <td class="text-xs-right">$ {{ formatPrice(props.item.importe) }}</td>
                <td class="text-xs-right">{{ formatDate(props.item.fecha) }}</td>
              </tr>
            </template>
          </v-data-table>
        </app-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// var Vue = require("vue");
import Multiselect from "vue-multiselect";
import moment from "moment";
export default {
  components: {
    Multiselect
  },
  data() {
    return {
      options: [],
      loader: false,
      array_recibos: [],
      headers_recibo: [
        {
          text: "Folio",
          value: "id_recibo",
          sortable: true
        },
        { text: "Tipo de Pago", value: "descripcion", sortable: true },
        { text: "Importe", value: "importe", sortable: true },
        { text: "Fecha", value: "log", sortable: true }
      ],
      loaderNC: false,
      array_notas_credito: [],
      headers_notas_credito: [
        {
          text: "Folio",
          value: "id_nota_credito",
          sortable: true
        },
        { text: "Tipo de Pago", value: "descripcion", sortable: true },
        { text: "Importe", value: "importe", sortable: true },
        { text: "Fecha", value: "fecha_realizada", sortable: true }
      ],
      loaderCA: false,
      array_comision_agencias: [],
      headers_comision_agencias: [
        {
          text: "Folio",
          value: "id",
          sortable: true
        },
        { text: "Reservación", value: "id_reservacion", sortable: true },
        { text: "Tipo de pago", value: "id_tipo_pago", sortable: true },
        { text: "Monto", value: "importe", sortable: true },
        { text: "Fecha de Creación", value: "fecha", sortable: true }
      ],
      selected_agencia: "",
      listaAgencias: [],
      isLoading: false,
      idAgencia: ""
    };
  },
  methods: {
    loadRecibos() {
      // alert("mounted");
      this.loader = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/sur4/admin/pagos/consultaRecibos?agencia=" +
            this.idAgencia
        )
        .then(
          function(response) {
            this.array_recibos = response.data;
            this.loader = false;
          },
          function() {
            console.log("Error");
          }
        );
    },
    loadNotasCredito() {
      // alert("mounted");
      this.loaderNC = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/sur4/admin/pagos/consultaNotasCredito?agencia=" +
            this.idAgencia
        )
        .then(
          function(response) {
            this.array_notas_credito = response.data;
            this.loaderNC = false;
          },
          function() {
            console.log("Error");
          }
        );
    },
    loadComisionAgencias() {
      // alert("mounted");
      this.loaderCA = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/sur4/admin/pagos/consultaComisionAgencias?agencia=" +
            this.idAgencia
        )
        .then(
          function(response) {
            this.array_comision_agencias = response.data;
            this.loaderCA = false;
          },
          function() {
            console.log("Error");
          }
        );
    },
    limitText(count) {
      return "and " + count + " other countries";
    },
    asyncFind(query) {
      this.isLoading = true;
      if (query.length > 0) {
        // this.queryData = JSON.parse(JSON.stringify(query));
        this.isLoading = true;
        this.$http
          .get(
            "https://www.rutamayatravel.com/sur4/admin/produccionesVentas/busquedaAgencias?search=" +
              query,
            {
              before(request) {
                // abort previous request, if exists
                if (this.previousRequest) {
                  this.previousRequest.abort();
                }
                // set previous request on Vue instance
                this.previousRequest = request;
              }
            }
          )
          .then(
            function(response) {
              var response_var = response.body;
              this.listaAgencias = response_var;
              // console.log(this.listaAgencias);
              //   if (this.limit_options == 20) this.limit_options = 30;
              this.isLoading = false;
            },
            function() {
              console.log("Error");
            }
          );
      }
    },
    clearAll() {
      this.selected_agencia = "";
    },
    changeTables: function(selectedOption) {
      // console.log(id);
      this.array_recibos = [];
      this.array_notas_credito = [];
      this.array_comision_agencias = [];
      this.idAgencia = selectedOption.id_agencia;
      // console.log(this.idAgencia);
      this.loadRecibos();
      this.loadNotasCredito();
      this.loadComisionAgencias();
    },
    formatDate(value) {
      return moment(value).format("DD/MM/YYYY");
    },
    formatPrice(value) {
      var redondear = Math.ceil(value);
      let val = (redondear / 1).toFixed(2).replace(",", ".");
      // console.log(value);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  computed: {},
  mounted() {
    // this.loadRecibos();
    // this.loadNotasCredito();
    // this.loadComisionAgencias();
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.multiselect__single {
  padding: 9px 0 9px 40px;
}

.multiselect__content-wrapper {
  width: auto;
  min-width: 100%;
}

.multiselect__option--highlight {
  background: #57b2ce;
}

.multiselect__option--disabled {
  color: #393737;
  font-weight: 700;
}
</style>
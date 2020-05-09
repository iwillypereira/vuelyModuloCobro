<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid>
      <v-card-title>
        Pólizas
        <v-spacer></v-spacer>
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
        dense
        :headers="headers"
        :items="polizas"
        sort-by="id_poliza"
        class="elevation-1"
        :loading="loader"
        loading-text="Cargando... Espere"
        :search="search"
      >
        <template v-slot:item="props">
          <tr>
            <td class="text-right">{{ props.item.num_poliza }}</td>
            <td>{{ tipoPoliza(props.item.tipo) }}</td>
            <td>{{ $formatDate(props.item.fecha) }}</td>
            <td>$ {{$RMT.formatoPrecio(props.item.importe)}}</td>
            <td class="text-right">{{ props.item.referencia }}</td>
            <td>{{ tipoRef(props.item.tipo_ref) }}</td>
            <td>{{ props.item.concepto }}</td>
            <td>{{ estatusPoliza(props.item.estatus) }}</td>
            <td>{{ props.item.observaciones }}</td>
            <td>{{ props.item.elaboro }}</td>
          </tr>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
      <v-snackbar
        v-model="snackbar"
        :color="'green'"
        :multi-line="'multi-line'"
        :timeout="3000"
        :right="true"
        :bottom="true"
      >
        {{text_snackbar}}
        <v-btn dark text @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    loader: false,
    snackbar: false,
    search: "",
    text_snackbar: "",
    headers: [
      {
        text: "Núm. Póliza",
        value: "num_poliza"
      },
      { text: "Tipo", value: "tipo" },
      { text: "Fecha", value: "fecha" },
      { text: "Importe", value: "importe" },
      { text: "Referencia", value: "referencia" },
      { text: "Tipo Referencia", value: "tipo_ref" },
      { text: "Concepto", value: "concepto" },
      { text: "Estatus", value: "estatus" },
      { text: "Observaciones", value: "observaciones" },
      { text: "Elaboró", value: "elaboro" },
      { text: "Opciones", value: "actions" }
    ],
    polizas: [],
    editedIndex: -1
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Cuenta" : "Editar";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.loader = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/" +
            this.sur4 +
            "/contabilidad/contPoliza/obtenerPolizas"
        )
        .then(
          function(response) {
            this.polizas = response.data;
            this.loader = false;
          },
          function() {
            console.log("Error");
          }
        );
    },

    tipoPoliza(tipo) {
      var tipoPoliza = "";
      switch (tipo) {
        case "D":
          tipoPoliza = "Diario";
          break;
        case "E":
          tipoPoliza = "Egreso";
          break;
        case "I":
          tipoPoliza = "Ingreso";
          break;
        default:
          tipoPoliza = "Indefinido";
          break;
      }

      return tipoPoliza;
    },
    tipoRef(referencia) {
      var tipoRef = "";
      switch (referencia) {
        case "0":
          tipoRef = "Cheque";
          break;
        case "1":
          tipoRef = "Transferencia";
          break;
        default:
          tipoRef = "Indefinido";
          break;
      }

      return tipoRef;
    },
    estatusPoliza(estatus) {
      var estatusPoliza = "";
      switch (estatus) {
        case "Pd":
          estatusPoliza = "Pendiente";
          break;
        case "P":
          estatusPoliza = "Pagado";
          break;
        case "C":
          estatusPoliza = "Cancelado";
          break;
        default:
          estatusPoliza = "Indefinido";
          break;
      }

      return estatusPoliza;
    }
  }
};
</script>
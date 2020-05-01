<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container>
      <v-card class="pa-5">
        <v-row>
          <v-col cols="12">

            <input type="text" name="city" list="cityname" v-model="busqueda">
            {{busqueda}}
            <datalist id="cityname">
              <option :value="data" v-for="(data,index) in fruits" :key="index"></option>
            </datalist>
          </v-col>
          <v-col cols="6">
            <h3>Filtros</h3>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="array_proximos_pagos"
          :search="search"
          item-key="name"
          class="elevation-1"
          :loading="loader"
          loading-text="Cargando... Espere"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      busqueda: "",
      fruits: [
        "Apples",
        "Apricots",
        "Avocado",
        "Bananas",
        "Blueberries",
        "Blackberries",
        "Boysenberries",
        "Bread fruit",
        "Cantaloupes (cantalope)",
        "Cherries",
        "Cranberries",
        "Cucumbers",
        "Currants",
        "Dates",
        "Eggplant",
        "Figs",
        "Grapes",
        "Grapefruit",
        "Guava",
        "Honeydew melons",
        "Huckleberries",
        "Kiwis",
        "Kumquat",
        "Lemons",
        "Limes",
        "Mangos",
        "Mulberries",
        "Muskmelon",
        "Nectarines",
        "Olives",
        "Oranges",
        "Papaya",
        "Peaches",
        "Pears",
        "Persimmon",
        "Pineapple",
        "Plums",
        "Pomegranate",
        "Raspberries",
        "Rose Apple",
        "Starfruit",
        "Strawberries",
        "Tangerines",
        "Tomatoes",
        "Watermelons",
        "Zucchini"
      ],

      loader: true,
      array_proximos_pagos: [],
      search: "",
      headers: [
        {
          text: "Bloqueo",
          align: "start",
          value: "id_bloqueo",
          sortable: true
        },
        { text: "Importe", value: "importe", sortable: true },
        { text: "Hotel", value: "id_hotel", sortable: true },
        { text: "Pago", value: "pago", sortable: true },
        { text: "Inico", value: "fecha_inicio", sortable: true },
        { text: "Final", value: "fecha_final", sortable: true },
        { text: "Titulo", value: "titulo", sortable: true }
      ]
    };
  },
  mounted() {
    this.getProjectData();
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
    getProjectData() {
      this.loader = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/sur4/admin/apivue/listaProximosPagosAllBloqueos"
        )
        .then(
          function(response) {
            this.array_proximos_pagos = response.data;
            console.log(this.array_proximos_pagos);
            this.loader = false;
          },
          function() {
            console.log("Error");
          }
        );
    }
  },
};
</script>

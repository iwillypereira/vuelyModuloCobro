<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid class="grid-list-xl pt-0">
      <v-row class="align-items-center search-wrap">
        <v-col cols="12" md="12" lg="12" class="align-items-center pt-0">
          <app-card customClasses="mb-0 py-12">
            <v-row>
              <v-col cols="12" md="12" lg="3" class="align-center">
                <h2 class="mb-0">Filtros de Busqueda:</h2>
              </v-col>
              <v-col cols="12" md="12" lg="9" class="pb-0">
                <div class="d-flex search-field-wrap">
                  <div class="w-75">
                    <v-text-field class="pt-0 pr-3" v-model="busqueda" label="Buscar Hotel/Agencia"></v-text-field>
                  </div>
                  <div>
                    <v-select v-model="orderArray" :items="selectfecha" class="pt-0 pr-3"></v-select>
                  </div>
                </div>
              </v-col>
            </v-row>
          </app-card>
        </v-col>
      </v-row>
      <div class="d-flex justify-space-between align-items-center pa-6 project-grid-title">
        <div class="title">
          <h3 class="mb-0">{{titleMSJ}}</h3>
        </div>
        <div class="text-right project-icon">
          <v-icon
            class="mr-2"
            :class="{active: isActive == 'grid'}"
            style="cursor: pointer;"
            @click="girdView(1)"
          >apps</v-icon>
          <v-icon
            :class="{active: isActive == 'list'}"
            style="cursor: pointer;"
            @click="listView(2)"
          >list</v-icon>
        </div>
      </div>

      <div class="text-center">
        <v-progress-circular
          :size="150"
          :width="17"
          color="purple"
          indeterminate
          v-if="loader == true"
        ></v-progress-circular>
      </div>
      <div v-show="loader == false">
        <v-row>
          <app-card
            v-for="(data,index) in busquedaPaquetes"
            :key="index"
            :heading="data.tarifa.precio"
            colClasses="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12"
            customClasses="mb-0"
            :fullBlock="true"
            :fullScreen="true"
            :reloadable="true"
            :closeable="true"
            v-show="selectedView == 'grid'"
          >
            <!-- <h3>{{data.tarifa.precio}}</h3> -->
            <h5 class="app-card-content pb-0">{{'Hotel: '+data.hotel.nombre_hotel}}</h5>
            <h5
              class="app-card-content pb-0"
            >Del {{moment(data.fecha_inicio).format('LL')}} al {{moment(data.fecha_final).format('LL')}}</h5>
            <h5 class="app-card-content pb-">Agencia: {{data.nombre_agencia}}</h5>
            <ProjectGridView :managementData="data"></ProjectGridView>
          </app-card>
        </v-row>
        <v-row v-show="selectedView == 'list'">
          <app-card colClasses="col-xl-12 col-lg-12 col-md-12 col-12 col-12" customClasses="mb-0">
            <!-- <ProjectListView :managementData="busqueda"></ProjectListView> -->
            <v-data-table
              :headers="headers"
              :items="busquedaPaquetes"
              item-key="name"
              class="elevation-1"
              :loading="loader"
              loading-text="Cargando... Espere"
            ></v-data-table>
          </app-card>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import ProjectGridView from "Components/Widgets/ProjectGrid";
export default {
  components: {
    ProjectGridView
  },
  data() {
    return {
      loader: true,
      projectData: [],
      headers: [
        {
          text: "ID",
          align: "start",
          value: "id_bloqueo",
          sortable: true
        },
        { text: "Tipo", value: "tarifa.precio", sortable: true },
        { text: "Hotel", value: "hotel.nombre_hotel", sortable: true },
        { text: "Agencia", value: "agencia.nombre_agencia", sortable: true },
        { text: "Titulo", value: "titulo", sortable: true }
      ],
      viewType: "projectGrid",
      selectedView: "grid",
      isActive: "grid",
      busqueda: "",
      titleMSJ: "Vista Cuadriculada",
      orderArray: "Recientes",
      selectfecha: ["Recientes", "Proxixmos"]
    };
  },
  mounted() {
    this.getProjectData();
  },
  methods: {
    getProjectData() {
      this.loader = true;
      this.$http
        .get("https://www.rutamayatravel.com/sur4/admin/apivue/grupoBodas")
        .then(
          function(response) {
            this.projectData = response.data;
            console.log(this.projectData);

            this.loader = false;
          },
          function() {
            console.log("Error");
          }
        );
    },
    listView() {
      this.viewType = "vistaList";
      this.selectedView = "list";
      this.isActive = "list";
      this.titleMSJ = "Vista en Lista";
    },
    girdView() {
      this.viewType = "vistaGrid";
      this.selectedView = "grid";
      this.isActive = "grid";
      this.titleMSJ = "Vista Cuadriculada";
    }
  },
  computed: {
    busquedaPaquetes: function() {
      var self = this;
      var array_interno = this.projectData;
      if (this.orderArray == "Recientes" || this.orderArray == "") {
        array_interno.sort(function(a, b) {
          a = new Date(a.fecha_inicio);
          b = new Date(b.fecha_inicio);
          return a > b ? 1 : a < b ? -1 : 0;
        });
      } else {
        array_interno.sort(function(a, b) {
          a = new Date(a.fecha_inicio);
          b = new Date(b.fecha_inicio);
          return a > b ? -1 : a < b ? 1 : 0;
        });
      }
      return array_interno.filter(data => {
        // if (data.novios != null) {
        return (
          data.nombre_hotel
            .toLowerCase()
            .includes(self.busqueda.toLowerCase()) ||
          data.nombre_agencia
            .toLowerCase()
            .includes(self.busqueda.toLowerCase())
        );
        // }
      });
    }
  }
};
</script>
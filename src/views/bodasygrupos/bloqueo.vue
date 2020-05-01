<template>
  <div>
    <app-section-loader :status="loader"></app-section-loader>
    <page-title-bar></page-title-bar>
    <v-container fluid>
      <div class="pa-6 project-detail-title">
        <h3 class="mb-0">{{array_bloqueo.hotel.nombre_hotel}}</h3>
      </div>
      <v-row>
        <app-card
          colClasses="col-xl-8 col-lg-8 col-md-7 col-sm-12 col-12 "
          customClasses="mb-0"
          :height="300"
        >
          <!-- Description Details -->
          <div class="sec-title mb-4">
            <h3>Políticas de pago desglose</h3>
          </div>
          <div class="sec-content">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Desc. Pago</th>
                    <th class="text-left">Fecha</th>
                    <th class="text-left">Importe</th>
                    <th class="text-left">Observaciones</th>
                    <th class="text-left">Pagado</th>
                    <!-- <th class="text-left">Enviar Correo</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(pago, index) in array_bloqueo.pagos" :key="index">
                    <td>{{ pago.descripcion_pago }}</td>
                    <td>{{ formatDate(pago.fecha) }}</td>
                    <td
                      v-if="pago.importe != null"
                      class="text-right"
                    >$ {{ formatPrice(pago.importe) }}</td>
                    <td v-else class="text-right">$ {{formatPrice(0)}}</td>
                    <td v-if="pago.observaciones != ''">{{ pago.observaciones }}</td>
                    <td v-else>Sin Observación</td>
                    <td>
                      <v-chip
                        class="ma-2"
                        color="green"
                        text-color="white"
                        v-if="pago.pagado == 1"
                      >Pagado</v-chip>
                      <v-chip class="ma-2" color="red" text-color="white" v-else>Sin pagar</v-chip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="sec-title mt-10">
              <h3>Saldo</h3>
            </div>
            <v-row>
              <v-col cols="12" md="8">
                <saldos-bloqueo
                  :bloqueo="$route.params.id"
                ></saldos-bloqueo>
              </v-col>
            </v-row>
          </div>
        </app-card>
        <!--selectedProject -->
        <app-card colClasses="col-xl-4 col-lg-4 col-md-5 col-sm-12 col-12 ">
          <h3>Condición Contrato</h3>
          <p class="mb-2 fw-bold fs-14">Condiciones contrato Hotel</p>
          <p>{{array_politicas.condiciones_contrato_hotel}}</p>
          <p class="mb-2 fw-bold fs-14">Fecha contratación</p>
          <p>{{array_politicas.fecha_contratacion}}</p>
          <p class="mb-2 fw-bold fs-14">Fecha contratación</p>
          <p>{{array_politicas.fecha_limite_pago_hotel}}</p>
          <p class="mb-2 fw-bold fs-14">Fecha contratación</p>
          <p>{{array_politicas.penalidades}}</p>
        </app-card>
      </v-row>
    </v-container>
  </div>
</template> 

<script>
// import {formatPrice} from './helpers/helpers.js'
export default {
  data() {
    return {
      id: this.$route.params.id,
      array_bloqueo: [],
      array_politicas: []
    };
  },
  created() {
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
    loadPaquetes() {
      this.loader = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/sur4/admin/apivue/detalleBodaGrupo/" +
            this.id
        )
        .then(
          function(response) {
            this.loader = false;

            this.array_bloqueo = response.data;
            this.array_politicas = response.data.politicas[0];

            console.log(this.array_bloqueo);
          },
          function() {
            console.log("Error");
          }
        );
    },
    formatPrice(value) {
      var redondear = Math.ceil(value);
      let val = (redondear / 1).toFixed(2).replace(",", ".");
      // console.log(value);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
</script>

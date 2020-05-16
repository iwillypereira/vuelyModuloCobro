<template>
  <div class="app-card-content pt-0">
    <div class="desc-wrap" v-if="managementData.tarifa.precio =='BODA'">
      <h6>Novios :</h6>
      <p>{{ managementData.bloqueo.novios }}</p>
    </div>
    <div class="desc-wrap">
      <h6>Habitaciones :</h6>
      <p>{{managementData.numero_habitaciones}}</p>
    </div>
    <div class="desc-wrap">
      <h6>Tipo de Habitación :</h6>
      <p>{{managementData.habitacion.tipo_habitacion}}</p>
    </div>
    <!-- <div class="desc-wrap" v-if="managementData.tarifa.precio =='BODA' && managementData.pagos !='undefined'">
      <div :key="index" v-for="(data,index) in  managementData.pagos">
        <h2>{{data.importe}}</h2>
        <h2>{{data.pagado}}</h2>
      </div>
    </div> -->

    <!-- <div class="mb-4 project-team">
         <h6>Team Members :</h6>
         <div>
            <img class="img-circle thumb-gap rounded-circle" width="30px" height="30px" 
               v-for="(img,index) in managementData.teamImage" :key="index"
               :src="img"/>            
         </div>
      </div>   
      <div class="deadline-info mb-4">
         <h6>Deadline :</h6>
         <p>{{ managementData.deadline }}</p>
    </div>-->
    <div class="progress-bar mb-5">
      <h6 class="v-input__prepend-outer mb-5">Progress : {{ managementData.progreso_de_pago }} %</h6>
      <div class="d-flex justify-space-between text-center pa-0">
        <v-progress-linear v-model="managementData.progreso_de_pago" color="black" height="7" v-if="managementData.progreso_de_pago == 0"></v-progress-linear>               
        <v-progress-linear v-model="managementData.progreso_de_pago" color="red" height="7" v-else-if="managementData.progreso_de_pago <= 25"></v-progress-linear>    
        <v-progress-linear v-model="managementData.progreso_de_pago" color="deep-orange" height="7" v-else-if="managementData.progreso_de_pago <= 50"></v-progress-linear>
        <v-progress-linear v-model="managementData.progreso_de_pago" color="light-green" height="7" v-else-if="managementData.progreso_de_pago <= 75"></v-progress-linear>
        <v-progress-linear v-model="managementData.progreso_de_pago" color="green" height="7" v-else-if="managementData.progreso_de_pago <= 100"></v-progress-linear>
        
      </div>
    </div>
    <div class="button-wrap text-right">
      <v-btn
        color="primary"
        medium
        :to="`/${getCurrentAppLayoutHandler() + '/bloqueo/'+ managementData.bloqueo.id_bloqueo}`"
      >Ver más</v-btn>
    </div>
  </div>
</template>
<script>
// import api from "Api";
import { getCurrentAppLayout } from "Helpers/helpers";

export default {
  props: ["managementData"],
  data() {
    return {};
  },
  methods: {
    getCurrentAppLayoutHandler() {
      return getCurrentAppLayout(this.$router);
    }
  }
};
</script>
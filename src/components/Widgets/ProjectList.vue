<template>
  <div class="table-responsive">
    {{busquedaPaquetes}}
   <div :key="index" v-for="(data,index) in busquedaPaquetes">
     <h3>{{data.id_bloqueo}}</h3>
   </div>
  </div>
</template>
<script>
export default {
  props: ["managementData"],
  data() {
    return {
      projectData: [],
      busqueda: 'managementData'
    };
  },
  mounted() {
    this.getProjectData();
  },
  methods: {
    getProjectData() {
      this.loader = true;
      this.$http
        .get("https://www.rutamayatravel.com/sur4/admin/bloqueos/grupoBodas")
        .then(
          function(response) {
            this.loader = false;
            this.projectData = response.data;
            console.log(this.projectData);
          },
          function() {
            console.log("Error");
          }
        );
    }
  },
  computed: {
    busquedaPaquetes: function() {
      var self = this;
      // return this.projectData.filter(function(agencia) {return agencia.novios.toLowerCase().includes(self.busqueda.toLowerCase());});
      return this.projectData.filter(data => {
        // if (data.novios != null) {
        return (
          data.idHotel.nombre_hotel
            .toLowerCase()
            .includes(self.busqueda.toLowerCase()) ||
          data.idAgencia.nombre_agencia
            .toLowerCase()
            .includes(self.busqueda.toLowerCase())
        );
        // }
      });
    }
  }
};
</script>


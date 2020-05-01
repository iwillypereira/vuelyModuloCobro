// import $ from 'jquery';
export default {
    data() {
        return {
            loader: true,
            headers: [
                {
                    text: "Dessert (100g serving)",
                    align: "start",
                    sortable: false,
                    value: "name"
                },
                { text: "Calories", value: "calories" }
            ],
            array_agencias: [],
            busqueda: "",
            NUM_RESULTS: 9, // Numero de resultados por pÃ¡gina
            pag: 1, // PÃ¡gina inicial
            id: this.$route.params.id,
        };
    },
    mounted() {
        this.loadAgencias();
    },
    methods: {
        formatPrice(value) {
            var redondear = Math.ceil(value);
            let val = (redondear / 1).toFixed(2).replace(',', '.')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        redondearArriba(value) {
            var redondear = Math.ceil(value);

            return redondear;
        },
        loadAgencias() {
            this.loader = true;
            this.$http
                .get("https://www.rutamayatravel.com/sur4/admin/apivue/listadoAgenciasConBloqueo")
                .then(
                    function (response) {

                        this.array_agencias = response.data;
                        this.array_agencias = response.data;
                        // console.log(this.array_agencias);


                        // $("#customJquery").keyup(function (e) {
                        //     e.preventDefault();
                        //     var variable = $("#customJquery").val();
                        //     console.log(variable);
                        // });


                        this.loader = false;
                    },
                    function () {
                        console.log("Error");

                    }
                );
        }

    },
    computed: {
        busquedaAgencia: function () {
            var self = this;

            //   if (this.orderArray == "Ascendiente" || this.orderArray == "") {
            //     self.projectData.sort(function(a, b) {
            //       a = new Date(a.fecha_inicio);
            //       b = new Date(b.fecha_inicio);
            //       return a > b ? 1 : a < b ? -1 : 0;
            //     });
            //   } else {
            //     self.projectData.sort(function(a, b) {
            //       a = new Date(a.fecha_inicio);
            //       b = new Date(b.fecha_inicio);
            //       return a > b ? -1 : a < b ? 1 : 0;
            //     });
            //   }
            return this.array_agencias.filter(data => {
                // if (data.novios != null) {

                return (
                    data.nombre_agencia
                        .toLowerCase()
                        .includes(self.busqueda.toLowerCase()) ||
                    data.municipio_agencia
                        .toLowerCase()
                        .includes(self.busqueda.toLowerCase()) ||
                    data.tel_agencia
                        .toLowerCase()
                        .includes(self.busqueda.toLowerCase()) ||
                    data.email_agencia
                        .toLowerCase()
                        .includes(self.busqueda.toLowerCase()) ||
                    data.contacto.toLowerCase().includes(self.busqueda.toLowerCase()) ||
                    data.id_agencia.toLowerCase().includes(self.busqueda.toLowerCase())
                );
                // }
            });
        }
    }
};
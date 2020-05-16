export default {
    data() {
        return {
            array_agencia: [],
            loader: false,
            array_paquetes_agencia: [],
            array_proximos_pagos: [],
            array_pagos: [],
            headers_paquetes: [
                {
                    text: "Id",
                    align: "start",
                    value: "id_bloqueo",
                    sortable: true
                },
                { text: "Tipo", value: "idTarifa.precio", sortable: true },
                { text: "Fecha Inicio", value: "fecha_inicio", sortable: true },
                { text: "Hotel", value: "id_hotel", sortable: true },
                { text: "Cant.Habs.", value: "numero_habitaciones", sortable: true },
                { text: "Novios", value: "novios", sortable: true },                
                { text: "Estatus", value: "estatus", sortable: true }
            ],
            id: this.$route.params.id,
        };
    },
    created() {

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
                .get("https://www.rutamayatravel.com/sur4/admin/apivue/infoAgencia/"+ this.id)
                .then(
                    function (response) {
                        this.array_agencia = response.data;
                        this.loadListadoPaquetesAgencia();
                        this.loadlistaProimosPagosAgencia();
                        console.log(this.array_paquetes_agencia);
                        console.log(this.array_proximos_pagos);
                        this.loader = false;
                    },
                    function () {
                        console.log("Error");
                    }
                );
        },
        loadListadoPaquetesAgencia() {
            this.$http
                .get("//www.rutamayatravel.com/sur4/admin/apivue/listadoPaquetesAgencia/"+ this.id)
                .then(
                    function (response) {
                        this.array_paquetes_agencia = response.data;

                    },
                    function () {
                        console.log("Error");
                    }
                );
        },
        loadlistaProimosPagosAgencia() {
            console.log(this.array_proximos_pagos);
            this.$http
                .get("//www.rutamayatravel.com/sur4/admin/apivue/listadoProximosPagos/"+ this.id)
                .then(
                    function (response) {
                        this.array_proximos_pagos = response.data;
                        this.array_pagos = response.data[0].gruposPoliticasPagosDesgloses;

                        

                    },
                    function () {
                        console.log("Error");
                    }
                );
        },
    },
};
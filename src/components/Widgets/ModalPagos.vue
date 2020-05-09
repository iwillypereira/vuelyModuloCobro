<template>
  <div>
    <v-dialog
      :value="value"
      @input="$emit('input')"
      fullscreen
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="pink">
          <v-toolbar-title>PAGAR ORDEN DE PAGO #{{comprobantesPago.id_orden_pago}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click.native="toggleModal" class="pt-0">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-form id="form-buy" v-model="validForm" ref="form" lazy-validation>
            <v-row>
              <v-col cols="6" md="4">
                <tasa-cambio
                  v-model="tasaCambio.importe"
                  v-on:success-change.native="modificarTipoCambio"
                ></tasa-cambio>
              </v-col>
              <v-col cols="6" md="8" class="text-right">
                <v-list-item ripple>
                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-bold display-1"
                      v-html="'$ '+$RMT.formatoPrecio(saldo)+' MXN'"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      class="headline"
                      v-html="'$ '+$RMT.formatoPrecio(saldoUSD) + ' USD'"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" class="paymentCont mb-3">
                <div
                  v-for="(radioButtons,indexRadio) in apiForms.metodos"
                  :key="indexRadio"
                  v-show="showMetodoPago(radioButtons.id_tipo)"
                >
                  <input
                    type="radio"
                    :id="'control_'+indexRadio"
                    v-model="comprobantesPago.id_tipo"
                    :value="radioButtons.id_tipo"
                    name="tipo_pago"
                    @change="resetCampos(); getPolizas();"
                  />
                  <label :for="'control_'+indexRadio">
                    <p style="font-size:12px;">{{radioButtons.descripcion}}</p>
                    <v-icon>{{iconoTipoPago(radioButtons.id_tipo)}}</v-icon>
                  </label>
                </div>
              </v-col>
              <v-col cols="12" md="6" v-show="comprobantesPago.id_tipo == '15'">
                <v-text-field v-model="itemPolizas.concepto" label="Concepto" filled readonly></v-text-field>
                <!-- cuenta de fondo -->
              </v-col>
              <v-col cols="12" md="6" v-show="comprobantesPago.id_tipo == '15'">
                <v-text-field
                  v-model="itemPolizas.importe"
                  label="Cuenta de Fondo"
                  prefix="$"
                  filled
                  readonly
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="12"
                v-show="comprobantesPago.id_tipo == '1' || comprobantesPago.id_tipo == '7'"
              >
                <header>Facturar</header>
                <v-radio-group v-model="comprobantesPago.efectivo_facturable" row>
                  <v-radio
                    v-for="(optionsFact,indexFact) in facturable"
                    :key="indexFact"
                    color="success"
                    :value="optionsFact.valor"
                    :label="optionsFact.text"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col
                cols="12"
                md="6"
                v-show="comprobantesPago.id_tipo == '2' || comprobantesPago.id_tipo == '6' || comprobantesPago.id_tipo == '7'"
              >
                <v-text-field v-model="comprobantesPago.referencia" label="Referencia"></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="6"
                v-show="comprobantesPago.id_tipo == '2' || comprobantesPago.id_tipo == '6' || comprobantesPago.id_tipo == '7' || comprobantesPago.id_tipo == '8' || comprobantesPago.id_tipo == '9'"
              >
                <v-text-field v-model="comprobantesPago.cliente" label="Cuenta Habiente"></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="8"
                v-show="comprobantesPago.id_tipo == '2' || comprobantesPago.id_tipo == '6' || comprobantesPago.id_tipo == '7' || comprobantesPago.id_tipo == '8' || comprobantesPago.id_tipo == '9'"
              >
                <v-select
                  v-model="comprobantesPago.id_banco"
                  :items="apiForms.bancos"
                  item-value="id_banco"
                  item-text="nombre"
                  label="Banco"
                  :rules="(comprobantesPago.id_tipo == 8 || comprobantesPago.id_tipo == 9) ? bancoRules : []"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                md="4"
                v-show="comprobantesPago.id_tipo == '2' || comprobantesPago.id_tipo == '6' || comprobantesPago.id_tipo == '7' || comprobantesPago.id_tipo == '8' || comprobantesPago.id_tipo == '9'"
              >
                <v-text-field
                  v-model="comprobantesPago.tarjeta"
                  label="4 Dígitos"
                  :rules="(comprobantesPago.id_tipo == 8 || comprobantesPago.id_tipo == 9) ? bancoRules : []"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                v-show="comprobantesPago.id_tipo == '2' || comprobantesPago.id_tipo == '6' || comprobantesPago.id_tipo == '7' || comprobantesPago.id_tipo == '8' || comprobantesPago.id_tipo == '9'"
              >
                <v-select
                  v-model="comprobantesPago.id_cuenta"
                  :items="apiForms.cuentas"
                  item-value="id_cuenta"
                  item-text="descripcion"
                  label="Cuenta"
                  @change="comisionBancaria()"
                  :rules="(comprobantesPago.id_tipo == 8 || comprobantesPago.id_tipo == 9) ? bancoRules : []"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                v-show="comprobantesPago.id_tipo == '8' || comprobantesPago.id_tipo == '9'"
              >
                <v-select
                  v-model="comprobantesPago.id_planpago"
                  :items="apiForms.planPagos"
                  item-value="id_planpago"
                  item-text="descripcion"
                  label="Plan de Pago"
                  @change="comisionBancaria()"
                  :rules="(comprobantesPago.id_tipo == 8 || comprobantesPago.id_tipo == 9) ? bancoRules : []"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="comprobantesPago.importe"
                  label="Pago"
                  prefix="$"
                  required
                  @change="modificoPago"
                  :rules="importeRules"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="4"
                v-show="comprobantesPago.id_tipo == '8' || comprobantesPago.id_tipo == '9'"
              >
                <v-text-field
                  v-model="comprobantesPago.comision"
                  label="Comisión"
                  suffix="%"
                  @change="modificoComision"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="8"
                v-show="comprobantesPago.id_tipo == '8' || comprobantesPago.id_tipo == '9'"
              >
                <v-text-field v-model="importe_comision" label="Importe con Comisión" prefix="$"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="total_pago" label="Total" prefix="$" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="saldores" label="Saldo Restante" prefix="$" readonly></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="comprobantesPago.observaciones" label="Observaciones"></v-text-field>
              </v-col>
              <v-col class="text-right">
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click.native="toggleModal">Cancelar</v-btn>
                <v-btn
                  v-show="hidden_click_pagar"
                  :disabled="!validForm"
                  color="success darken-1"
                  @click="pagarOrdenPago"
                >Pagar</v-btn>
                <v-btn v-show="show_click_pagar" color="success darken-1" loading>Pagar</v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-row>
            <v-col cols="12">
              <div v-if="Array.isArray(this.ultimo_comprobante_pago) == false">
                <p
                  class="font-weight-black"
                >Tienes pagos realizados con un monto de $ {{$RMT.formatoPrecio(ultimo_importe_pagado)}} en la orden actual.</p>
              </div>
            </v-col>
          </v-row>
          <!-- props['cerrarmodal','abrirmodal','total_saldo','total_saldo_usd'] -->
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "modal-pagos",
  props: [
    "value",
    "saldo",
    "saldoUSD",
    "comprobantesPago",
    "tasaCambio",
    "apiForms"
  ],
  data() {
    return {
      total_saldo_aux: 0,
      total_saldo_usd_aux: 0,
      // FORMS PAGAR
      validForm: true,
      ultimo_comprobante_pago: [],
      ultimo_importe_pagado: 0,
      saldo_a_favor: false,
      id_comprobante_pago: 0,
      total_pago: 0.0,
      saldores: 0.0,
      importe_comision: 0,
      facturable: [
        {
          valor: "0",
          text: "Si"
        },
        {
          valor: "1",
          text: "No"
        }
      ],
      bancoRules: [v => !!v || "Validación de tarjeta, Campos requerido."],
      importeRules: [
        v => !!v || "Error de Validación, ingrese un importe válido."
      ],
      // ##########
      loaderPoliza: false,
      itemPolizas: [],
      hidden_click_pagar: true,
      show_click_pagar: false,
      es_cuenta_fondo: false,
      dialog_confirmacion_pago: false,
      agencia_pagar_orden: false,
      estatus_pago: "",
      alert_mensaje: "",
      redirect_pdf_comprobante: "",
      disabledTextField: false,
      disabledBtnSearch: false
    };
  },
  methods: {
    toggleModal() {
      this.$emit("input", false);
      this.$emit("hideModal");
      this.resetCampos();
    },
    pagarOrdenPago() {
      if (
        this.comprobantesPago.id_tipo != 0 ||
        this.comprobantesPago.id_tipo != ""
      ) {
        if (this.$refs.form.validate()) {
          this.hidden_click_pagar = false;
          this.show_click_pagar = true;
          var comprobante = {
            ComprobantesPago: this.comprobantesPago,
            comision: 0,
            total: this.total_pago,
            saldores: this.saldores
          };
          this.$http
            .post(
              "https://www.rutamayatravel.com/sur4dev/admin/contabilidad/comprobantesPago/generarComprobantePago",
              comprobante,
              {
                emulateJSON: true
              }
            )
            .then(
              function(response) {
                this.hidden_click_pagar = true;
                this.show_click_pagar = false;
                if (response.body.error == false) {
                  this.ultimo_comprobante_pago = comprobante.ComprobantesPago;
                  this.comprobantesPago = response.body.comprobante;
                  this.id_comprobante_pago = this.comprobantesPago.id_comprobante_pago;

                  var ultimo_importe_pagado =
                    parseFloat(this.ultimo_importe_pagado) +
                    parseFloat(this.comprobantesPago.importe);
                  this.ultimo_importe_pagado = this.redondearPrecio(
                    ultimo_importe_pagado,
                    2
                  );

                  if (this.ultimo_importe_pagado > 0) {
                    var importe_saldo =
                      parseFloat(this.total_saldo) -
                      parseFloat(this.ultimo_importe_pagado);
                    this.comprobantesPago.importe = this.redondearPrecio(
                      importe_saldo,
                      2
                    );
                  } else {
                    this.comprobantesPago.importe = comprobante.saldores;
                  }
                  this.total_pago = this.comprobantesPago.importe;
                  this.total_saldo_aux = this.total_pago;
                  this.cambiarSaldoADolares();

                  var saldores =
                    parseFloat(this.total_pago) -
                    parseFloat(this.comprobantesPago.importe);

                  if (saldores < 0) {
                    saldores = 0;
                  }
                  this.saldores = this.redondearPrecio(saldores, 2);

                  if (this.comprobantesPago.importe <= 0) {
                    // this.dialog_guardar_pagar = false;
                    this.agencia_pagar_orden = false;
                    // this.resetCampos();
                    // this.habilitarCamposCuenta();
                    // this.resetOrdenPago();
                    // this.nuevaOrden();
                  }
                  this.dialog_confirmacion_pago = true;
                  this.estatus_pago = "success";
                  this.alert_mensaje = "Pago realizado con éxito.";
                  this.redirect_pdf_comprobante =
                    "https://www.rutamayatravel.com/sur4dev/admin/contabilidad/ordenPago/GeneratePdf/idOrden/" +
                    this.comprobantesPago.id_orden_pago;
                } else {
                  // this.mensaje("Error al momento de guardar el comprobante de pago", "red");
                }
              },
              function(response) {
                // Error
                console.log(response.body);
              }
            );
        }
      } else {
        // this.mensaje("Elija un tipo de pago.", "warning");
      }
    },
    getPolizas() {
      this.loaderPoliza = true;
      if (this.comprobantesPago.id_tipo == "15") {
        this.$http
          .get(
            "https://www.rutamayatravel.com/sur4dev/admin/contabilidad/comprobantesPago/polizasAgencia/agencia/8"
          )
          .then(
            function(response) {
              this.itemPolizas = response.data;
              this.comprobantesPago.importe = this.itemPolizas.importe;
              this.operacionesMath();
            },
            function() {
              console.log("Error");
            }
          );
      }
    },
    comisionBancaria() {
      this.$http
        .post(
          "https://www.rutamayatravel.com/sur4dev/admin/contabilidad/ordenPago/comisionbancaria",
          {
            cuenta: this.comprobantesPago.id_cuenta,
            plan: this.comprobantesPago.id_planpago
          },
          {
            emulateJSON: true
          }
        )
        .then(
          function(response) {
            if (
              this.comprobantesPago.id_planpago != "" &&
              this.comprobantesPago.id_cuenta != ""
            ) {
              this.comprobantesPago.comision = response.body;

              if (this.comprobantesPago.importe > 0) {
                this.operacionesMath();
              }
            }
            console.log(response.body);
          },
          function(response) {
            // Error
            console.log(response.data);
          }
        );
    },
    modificoPago() {
      var saldores = 0;
      if (
        this.comprobantesPago.id_tipo != "8" &&
        this.comprobantesPago.id_tipo != "9"
      ) {
        this.total_pago = this.comprobantesPago.importe;
        saldores =
          parseFloat(this.total_saldo) -
          parseFloat(this.comprobantesPago.importe);
        this.saldores = saldores.toFixed(2);
      } else {
        this.operacionesMath();
      }
    },
    modificoComision() {
      this.operacionesMath();
    },
    operacionesMath() {
      var com = parseFloat(this.comprobantesPago.comision) / 100;
      com = com * parseFloat(this.comprobantesPago.importe);
      com = this.redondearPrecio(com, 2);
      this.importe_comision = com;
      var total =
        parseFloat(this.importe_comision) +
        parseFloat(this.comprobantesPago.importe);
      total = this.redondearPrecio(total, 2);
      this.total_pago = total;
      // var saldores = parseFloat(this.total_saldo) - parseFloat(this.comprobantesPago.importe);
      var saldores =
        parseFloat(this.total_saldo_aux) -
        parseFloat(this.comprobantesPago.importe);
      saldores = this.redondearPrecio(saldores, 2);
      this.saldores = saldores;
    },
    redondearPrecio(value, decimal) {
      return (Math.round(value * 100) / 100).toFixed(decimal);
    },
    cambiarSaldoADolares() {
      var saldo_usd =
        parseFloat(this.saldo) / parseFloat(this.tasaCambio.importe);
      var saldo_usd_aux =
        parseFloat(this.total_saldo_aux) / parseFloat(this.tasaCambio.importe);
      this.total_saldo_usd = this.redondearPrecio(saldo_usd, 2);
      this.total_saldo_usd_aux = this.redondearPrecio(saldo_usd_aux, 2);
    },
    iconoTipoPago(id_tipo) {
      var icono = "";
      switch (parseInt(id_tipo)) {
        case 1:
          icono = "fas fa-cash-register";
          break;
        case 7:
          icono = "fas fa-money-bill-alt";
          break;
        case 8:
          icono = "fas fa-credit-card";
          break;
        case 9:
          icono = "fas fa-money-check";
          break;
        case 15:
          icono = "fas fa-file-invoice-dollar";
          break;
        case 2:
          icono = "fas fa-money-check-alt";
          break;
        case 6:
          icono = "fas fa-exchange-alt";
          break;
        default:
          icono = "fas fa-dollar-sign";
          break;
      }
      return icono;
    },
    showMetodoPago(item) {
      if (item == "15" && this.es_cuenta_fondo == true) {
        return false;
      } else {
        return true;
      }
    },
    habilitarCamposCuenta() {
      this.disabledTextField = false;
      this.disabledBtnSearch = false;
      this.es_cuenta_fondo = false;
    },
    resetCampos() {
      if (this.comprobantesPago.id_tipo == "15") {
        this.comprobantesPago.importe = this.total_saldo;
      }
      this.comprobantesPago.cliente = "";
      this.comprobantesPago.referencia = "";
      this.comprobantesPago.id_banco = "";
      this.comprobantesPago.id_planpago = "";
      this.comprobantesPago.tarjeta = "";
      this.comprobantesPago.id_cuenta = "";
      this.comprobantesPago.comision = 0;
      this.comprobantesPago.observaciones = "";
      this.comprobantesPago.efectivo_facturable = "0";
      this.importe_comision = 0;
      this.itemPolizas = [];
      this.operacionesMath();
    }
  }
};
</script>

<style scoped>
#form-buy > .row > .col-12 {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.paymentCont {
  display: flex;
  flex-flow: row wrap;
}

.paymentCont > div {
  /* flex: 1; */
  padding: 0.5rem;
}

.paymentCont input[type="radio"] {
  display: none;
}
.paymentCont input[type="radio"]:not(:disabled) ~ label {
  cursor: pointer;
}

.paymentCont label {
  height: 100%;
  display: block;
  background: white;
  border: 1px solid #e7ebee;
  border-radius: 20px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  box-shadow: 0px 3px 10px -2px rgba(161, 170, 166, 0.5);
  position: relative;
}

.paymentCont input[type="radio"]:checked + label {
  border: 2px solid #20df80;
}

/* agregar en tipo de pago el pago cuenta de fondo */

@media only screen and (max-width: 700px) {
  .paymentCont {
    flex-direction: column;
  }
}
</style>
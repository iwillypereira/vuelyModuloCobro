<style>
@import "https://use.fontawesome.com/releases/v5.0.13/css/all.css";
</style>

<template>
  <div>
    <v-container>
      <v-card>
        <v-container class="pl-5 pr-5 py-0">
          <v-row>
            <v-col cols="12" md="8">
              <h2 class="py-5 px-5">MODULO DE COBRO</h2>
            </v-col>
            <v-col cols="12" md="4">
              <tasa-cambio v-model="tasa_cambio.importe" v-on:success-change="modificarTipoCambio"></tasa-cambio>
            </v-col>
            <v-col cols="10" md="5">
              <v-autocomplete
                v-model="model_agencia_selected"
                :items="listaAgencias"
                :loading="isLoading"
                :search-input.sync="search"
                clearable
                hide-selected
                item-text="nombre_agencia"
                item-value="id_agencia"
                label="BUSCAR AGENCIA"
                hint="ESCRIBA MAS DE 3 LETRAS..."
                no-data-text="ESCRIBA MAS DE 3 LETRAS..."
                return-object
                @click="mostrarBotonBusqueda = true;"
                @change="autocompleteChange"
              >
                <template v-slot:item="data">
                  <template>
                    <v-list-item-avatar>
                      <img :src="URLIMG + data.item.foto" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="data.item.nombre_agencia"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.item.nombre_estado"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="2" md="2">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn class="mt-4 mr-1" dark color="teal" @click="agregaCuenta();" v-on="on">
                    <v-icon>attach_money</v-icon>
                  </v-btn>
                </template>
                <span>Agregar fondo a la Agencia seleccionada.</span>
              </v-tooltip>
              <v-btn
                color="primary"
                dark
                class="mt-4"
                v-if="mostrarBotonBusqueda"
                :disabled="disabledBtnSearch"
                @click="abrirModal();  precios = []; array_busqueda_agencia = []"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="12" md="5">
              <v-text-field
                id="id_producto"
                v-model="id_producto"
                label="BUSCAR PRODUCTO"
                v-on:keyup.13="peticionTest()"
                append-icon="mdi-location-enter"
                :readonly="disabledTextField"
              ></v-text-field>
              <!-- <div v-html="msjError" style="font-size:12px; color:red;" class="py-0"></div> -->
            </v-col>
          </v-row>
        </v-container>
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar dark color="pink">
              <v-toolbar-title>{{nombre_agencia}} - ID: {{id_agencia}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  icon
                  dark
                  @click="dialog = false; precios = [];  calcularTotalBusqueda(); array_busqueda_agencia = []; mostrarBotonBusqueda = true;"
                  class="pt-0"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-container>
              <p>
                SALDO SELECCIONADO:
                <b>$ {{$RMT.formatoPrecio(total_saldo2)}}</b>

                <v-btn
                  color="red"
                  normal
                  dark
                  @click="dialog = false; unirBusquedaConPagoGrid(); precios = [];  calcularTotalBusqueda(); array_busqueda_agencia = []; mostrarBotonBusqueda = true; "
                  class="float-right"
                  :disabled="precios.length == 0"
                >Agregar al pago</v-btn>
              </p>
            </v-container>
            <v-container v-if="cont_reservas>2">
              <h2>RESERVAS</h2>
              <v-sheet color="grey" class="pa-0" v-show="loader == true">
                <v-skeleton-loader class="mx-auto" max-width="auto" type="table" tile></v-skeleton-loader>
              </v-sheet>
              <v-simple-table :fixed-header="true" height="200" v-show="loader == false">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">IDENTIFICADOR</th>
                      <th class="text-left">SALDO</th>
                      <th class="text-left">IMPORTE</th>
                      <th class="text-left">TIPO</th>
                      <th class="text-left">DESCRIPCION</th>
                      <th class="text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(data,index) in array_busqueda_agencia.Reservas"
                      :key="index"
                      @click="calcularTotalBusqueda()"
                      v-show="index !== 'importeTotal' && index !== 'saldoTotal'"
                    >
                      <td>
                        <a
                          :href="tipoIdentificador(data.tipo,data.identificador,'link')"
                          target="_blank"
                        >{{ data.identificador }}</a>
                      </td>
                      <td style="white-space:nowrap;">$ {{$RMT.formatoPrecio(data.saldo)}}</td>
                      <td>$ {{$RMT.formatoPrecio(data.importe)}}</td>
                      <td>{{data.tipo}}</td>
                      <td>{{data.descripcion}}</td>
                      <td>
                        <v-checkbox v-model="precios" :value="data"></v-checkbox>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
            <v-container v-if="cont_grupoboda>2">
              <h2>GRUPOS Y BODAS</h2>

              <v-sheet color="grey" class="pa-0" v-show="loader == true">
                <v-skeleton-loader class="mx-auto" max-width="auto" type="table" :tile="false"></v-skeleton-loader>
              </v-sheet>
              <v-simple-table :fixed-header="true" height="200" v-show="loader == false">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">IDENTIFICADOR</th>
                      <th class="text-left">SALDO</th>
                      <th class="text-left">IMPORTE</th>
                      <th class="text-left">TIPO</th>
                      <th class="text-left">DESCRIPCION</th>
                      <th class="text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(data,index) in array_busqueda_agencia.GruposBodas"
                      :key="index"
                      @click="calcularTotalBusqueda()"
                      v-show="index !== 'importeTotal' && index !== 'saldoTotal'"
                    >
                      <td>
                        <a
                          :href="tipoIdentificador(data.tipo,data.identificador,'link')"
                          target="_blank"
                        >{{ data.identificador }}</a>
                      </td>
                      <td>$ {{$RMT.formatoPrecio(data.saldo)}}</td>
                      <td>$ {{$RMT.formatoPrecio(data.importe)}}</td>
                      <td>{{data.tipo}}</td>
                      <td>{{data.descripcion}}</td>
                      <td>
                        <div class="d-flex">
                          <v-checkbox v-model="precios" :value="data"></v-checkbox>
                          <v-btn
                            icon
                            light
                            class="mt-4"
                            @click="dialog_habitaciones = true; modal_habitaciones(data); modelo_habitaciones = []; array_cuartos_busqueda = []; loaderHabitaciones = true;"
                          >
                            <v-icon class="ma-0">mdi-open-in-new</v-icon>
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
            <v-container v-if="cont_bloqueos>2">
              <h2>BLOQUEOS</h2>

              <v-sheet color="grey" class="pa-0" v-show="loader == true">
                <v-skeleton-loader class="mx-auto" max-width="auto" type="table" :tile="false"></v-skeleton-loader>
              </v-sheet>
              <v-simple-table :fixed-header="true" height="200" v-show="loader == false">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">IDENTIFICADOR</th>
                      <th class="text-left">SALDO</th>
                      <th class="text-left">IMPORTE</th>
                      <th class="text-left">TIPO</th>
                      <th class="text-left">DESCRIPCION</th>
                      <th class="text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(data,index) in array_busqueda_agencia.Bloqueos"
                      :key="index"
                      @click="calcularTotalBusqueda()"
                      v-show="index !== 'importeTotal' && index !== 'saldoTotal'"
                    >
                      <td>
                        <a
                          :href="tipoIdentificador(data.tipo,data.identificador,'link')"
                          target="_blank"
                        >{{ data.identificador }}</a>
                      </td>
                      <td>$ {{$RMT.formatoPrecio(data.saldo)}}</td>
                      <td>$ {{$RMT.formatoPrecio(data.importe)}}</td>
                      <td>{{data.tipo}}</td>
                      <td>{{data.descripcion}}</td>
                      <td>
                        <v-checkbox v-model="precios" :value="data"></v-checkbox>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-card>
        </v-dialog>
        <v-simple-table class="py-0" :fixed-header="true" height="450">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center" style="text-align:center !important;">TIPO</th>
                <th class="text-center" style="text-align:center !important;">IDENTIFICADOR</th>
                <th class="text-center" style="text-align:center !important;">DESCRIPCIÓN</th>

                <th class="text-center" style="text-align:center !important;">IMPORTE</th>
                <th class="text-center" style="text-align:center !important;">USD</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data,index) in json_busqueda_prueba" :key="index">
                <td>{{tipoIdentificador(data.tipo_producto,data.identificador,"title")}}</td>
                <td class="text-right">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <a
                        :href="tipoIdentificador(data.tipo_producto,data.identificador,'link')"
                        target="_blank"
                        v-on="on"
                      >{{ data.identificador }}</a>
                    </template>
                    <span v-if="data.agencia != ''">Agencia: {{data.agencia}}</span>
                    <span v-else>Agencia: Indefinido</span>
                  </v-tooltip>
                </td>
                <td>{{ data.descripcion }}</td>
                <td
                  style="width: 200px !important; text-align:right !important"
                  v-show="!switchInput"
                  @click="switchInputEvent();"
                >$ {{$RMT.formatoPrecio(data.saldo)}}</td>
                <td
                  style="width: 200px !important; text-align:right !important"
                  v-show="switchInput"
                >
                  <v-text-field
                    prefix="$"
                    v-model.lazy="data.saldo"
                    @keypress="isNumber($event);"
                    @change="pruebaGetInfoInputMain(index);"
                    suffix="MX"
                  />
                </td>
                <td class="text-right" style="width: 200px !important;">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <span
                        v-on="on"
                      >$ {{ $RMT.formatoPrecio(convertirPreciosADolares(data.saldo,data.tipo_cambio)) }}</span>
                    </template>
                    <span>Tipo de Cambio: {{data.tipo_cambio}}</span>
                  </v-tooltip>
                </td>
                <td>
                  <v-btn icon light class="mt-0" @click="eliminarReserva(index)">
                    <v-icon class="ma-0">mdi-close</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right">Total:</td>
                <td style="text-align:right !important">$ {{$RMT.formatoPrecio(total_saldo)}}</td>
                <td style="text-align:right !important">$ {{$RMT.formatoPrecio(total_saldo_usd)}}</td>
                <td></td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>

        <v-row class="pl-2 pr-2 py-0">
          <v-col cols="8" md="8">
            <v-text-field label="OBSERVACIONES" v-model="ordenPago.observaciones"></v-text-field>
          </v-col>
          <v-col cols="4" md="4">
            <p
              class="text-right"
              style="font-size:24px !important; font-weight:700 !important;"
            >{{'$ '+$RMT.formatoPrecio(total_saldo)}}</p>
          </v-col>
        </v-row>

        <v-row class="pl-2 pr-2 py-0">
          <v-col cols="2" md="2" class="text-center">
            <v-btn color="primary" block dark @click="nuevaOrden()">Nueva Orden</v-btn>
          </v-col>
          <v-col cols="6" md="6"></v-col>
          <v-col cols="2" md="2" class="text-center">
            <v-btn color="green" block dark @click="dialog_confirmar_guardar= true; ">Guardar</v-btn>
          </v-col>
          <v-col cols="2" md="2" class="text-center">
            <v-btn
              color="green"
              block
              dark
              @click="dialog_confirmar_guardar= true; agencia_pagar_orden = true;"
            >Guardar y Pagar</v-btn>
          </v-col>
          <!-- <v-col>
            <v-btn @click="dialog_modal_pagos = true">Open</v-btn>
            <modal-pagos v-model="dialog_modal_pagos" :saldo="total_saldo" :saldoUSD="total_saldo_usd" v-on:hideModal="cerrarModalPagos" :jsonOrdenPago="array_test"></modal-pagos>
          </v-col>-->
        </v-row>
      </v-card>
    </v-container>

    <v-snackbar
      v-model="snackbar"
      :bottom="y === 'bottom'"
      :color="color"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :vertical="mode === 'vertical'"
    >
      {{text}}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-dialog v-model="dialog_habitaciones" max-width="500px">
      <v-card>
        <v-card-title>Lista de Cuartos</v-card-title>
        <p class="pl-6">Has seleccionado: {{modelo_habitaciones.length}}</p>
        {{modelo_habitaciones.identificador}}
        <div v-for="(data,i) in 5" :key="i" v-show="loaderHabitaciones == true">
          <v-skeleton-loader ref="skeleton" :type="'list-item-avatar-three-line'" class="mx-auto"></v-skeleton-loader>
        </div>
        <v-expansion-panels accordion v-show="loaderHabitaciones == false">
          <v-expansion-panel v-for="(cuarto, index) in array_cuartos_busqueda" :key="'hab_'+index">
            <v-expansion-panel-header>
              <v-checkbox
                v-model="modelo_habitaciones"
                :value="cuarto"
                @change="agregarHabAOrden(cuarto)"
                class="pa-0"
                :label="'Id:' + cuarto.identificador +' | ' +  'Hab. '+ cuarto.habitacion + ' | ' + 'Saldo: $ ' + $RMT.formatoPrecio(cuarto.saldo)"
              ></v-checkbox>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <h5>{{cuarto.nombrePax}}</h5>
              <h5>{{cuarto.menoresPax}}</h5>
              <h5>
                <p>{{cuarto.fecha_inicial}} - {{cuarto.fecha_final}}</p>
              </h5>
              <p>$ {{cuarto.descripcion}}</p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- <v-card-actions>
          <v-btn color="red" text @click="dialog_habitaciones = false; modelo_habitaciones = []; array_cuartos_busqueda = [];">Cerrar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>-->
      </v-card>
    </v-dialog>

    <!-- dialogo guardar y pagar -->
    <v-dialog
      v-model="dialog_guardar_pagar"
      fullscreen
      persistent
      max-width="600px"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="pink">
          <v-toolbar-title>PAGAR ORDEN DE PAGO #{{comprobantesPago.id_orden_pago}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="dialog_guardar_pagar = false; agencia_pagar_orden = false; resetCampos();"
              class="pt-0"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <!-- props['cerrarmodal','abrirmodal','total_saldo','total_saldo_usd'] -->
          <!-- <pre>
            <code>{{comprobantesPago}}</code>
          </pre>-->
          <v-form id="form-buy" v-model="validForm" ref="form" lazy-validation>
            <v-row>
              <!-- <v-col cols="6" md="6">
                <h4>Orden de pago #4</h4>
              </v-col>-->
              <v-col cols="6" md="4">
                <tasa-cambio
                  v-model="tasa_cambio.importe"
                  v-on:success-change="modificarTipoCambio"
                ></tasa-cambio>
              </v-col>
              <v-col cols="6" md="8" class="text-right">
                <v-list-item ripple>
                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-bold display-1"
                      v-html="'$ '+$RMT.formatoPrecio(total_saldo)+' MXN'"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      class="headline"
                      v-html="'$ '+$RMT.formatoPrecio(total_saldo_usd) + ' USD'"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <!-- <span v-html="'$ '+$RMT.formatoPrecio(total_saldo)"></span> -->
                <!-- <span v-html="'$ '+$RMT.formatoPrecio(total_saldo_usd) + ' USD'"></span> -->
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
                <v-text-field
                  v-model="importe_comision"
                  label="Importe con Comisión"
                  readonly
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="total_pago" label="Total" prefix="$" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="saldores" label="Saldo Restante" prefix="$" readonly></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="comprobantesPago.observaciones" label="Observaciones"></v-text-field>
                <!-- <v-textarea
                  v-model="comprobantesPago.observaciones"
                  name="comprobantesPago.observaciones"
                  label="Observaciones"
                ></v-textarea>-->
              </v-col>
              <v-col class="text-right">
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog_guardar_pagar = false; agencia_pagar_orden = false; resetCampos();"
                >Cancelar</v-btn>
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
        </v-container>
      </v-card>
    </v-dialog>
    <!-- Dialogo guardar confirmar -->
    <v-dialog v-model="dialog_confirmar_guardar" max-width="500">
      <v-card>
        <v-card-title
          v-if="typeof this.ordenPago.id_orden_pago == 'undefined'"
          class="headline"
        >¿Estas seguro de guardar la orden?</v-card-title>
        <v-card-title v-else class="headline">¿Estas seguro de actualizar la orden?</v-card-title>
        <v-card-text
          v-if="typeof this.ordenPago.id_orden_pago == 'undefined'"
        >Esta a punto de guardar la orden.</v-card-text>
        <v-card-text v-else>Esta a punto de actualizar la orden.</v-card-text>
        <v-card-text v-show="Array.isArray(this.ultimo_comprobante_pago) == false">
          <span
            class="font-weight-black"
          >Tienes pagos realizados con un monto de $ {{$RMT.formatoPrecio(ultimo_importe_pagado)}} en la orden actual.</span>
        </v-card-text>
        <v-card-text v-show="total_saldo < ultimo_importe_pagado">
          <v-checkbox v-model="saldo_a_favor">
            <template v-slot:label>
              <div>
                Se detectó un saldo a favor de
                <b>$ {{$RMT.formatoPrecio((total_saldo-ultimo_importe_pagado)*(-1))}}</b>. ¿Desea agregarlo a una cuenta de fondo?
              </div>
            </template>
          </v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="dialog_confirmar_guardar = false; agencia_pagar_orden = false;"
          >CANCELAR</v-btn>

          <v-btn color="green darken-1" dark @click="crearOrdenPago();">GUARDAR</v-btn>
          <!-- <v-btn color="green darken-1" dark @click="dialog_guardar_pagar=true">GUARDAR</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_confirmacion_pago" persistent max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert dense outlined :type="estatus_pago">{{alert_mensaje}}</v-alert>
                <!-- <v-alert dense outlined type="error">Ocurrió un error desconocido.</v-alert> -->
              </v-col>
              <v-col cols="12" v-if="estatus_pago=='success'">
                <v-btn
                  outlined
                  color="indigo"
                  :href="redirect_pdf_comprobante"
                  target="_blank"
                >Imprimir Comprobante</v-btn>
              </v-col>
              <v-col cols="12" v-if="estatus_pago=='success'">
                <h4>Subir Comprobante de Pago</h4>
                <vue-dropzone
                  ref="myVueDropzone"
                  id="dropzone"
                  :options="dropzoneOptions"
                  v-on:vdropzone-sending="addParametersFile"
                ></vue-dropzone>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog_confirmacion_pago = false; resetCampos(); id_comprobante_pago = ''; clearDropzone();"
          >Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="./vuejs/cobro.js"></script>

<style scoped>
table {
  table-layout: fixed !important;
  width: auto !important;
}
table td {
  white-space: normal !important;
}
tfoot,
tfoot th,
tfoot td {
  position: -webkit-sticky !important;
  position: sticky !important;
  bottom: 0 !important;
  background: #fff;
  z-index: 4 !important;
}

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
  /* background: #20df80; */
  /* color: white; */
  /* box-shadow: 0px 0px 20px rgba(0, 255, 128, 0.75); */
}
/* .paymentCont input[type="radio"]:checked + label::after {
  color: #3d3f43;
  font-family: 'Font Awesome 5 Free';
  border: 1px solid #1dc973;
  content: "\f00c";
  font-size: 24px;
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  height: 50px;
  width: 50px;
  line-height: 50px;
  text-align: center;
  border-radius: 50%;
  background: white;
  box-shadow: 0px 2px 5px -2px rgba(0, 0, 0, 0.25);
} */

/* .paymentCont p {
  font-weight: 900;
} */

/* agregar en tipo de pago el pago cuenta de fondo */

@media only screen and (max-width: 700px) {
  .paymentCont {
    flex-direction: column;
  }
}
</style>

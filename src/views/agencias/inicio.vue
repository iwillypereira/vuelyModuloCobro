<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid>
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
          <div
            class="col-12 col-sm-6 col-md-4"
            v-for="(agencia, index) in busquedaAgencia"
            :key="index"
            v-show="(pag - 1) * NUM_RESULTS <= index  && pag * NUM_RESULTS > index"
          >
            <v-lazy :options="{  threshold: 1 }" transition="fade-transition" min-height="0">
              <app-card>
                <div class="user-list-content">
                  <div class="text-center">
                    <h3 class="fw-bold">{{agencia.nombre_agencia}}</h3>
                    <p>{{ agencia.contacto }}</p>
                    <p>{{agencia.email_agencia}}</p>
                  </div>
                  <div class="text-center">
                    <router-link :to="'/agencias/'+agencia.id_agencia">
                      <v-btn class="light-blue darken-4 white--text" rounded dark>
                        <v-icon left class>mdi-pencil</v-icon>Ver más
                      </v-btn>
                    </router-link>
                    <!-- <v-btn color="warning" rounded dark>
                    <v-icon left>mdi-pencil</v-icon> Editar
                    </v-btn>-->
                  </div>
                </div>
              </app-card>
            </v-lazy>
          </div>
        </v-row>

        <v-pagination
          v-model="pag"
          :length="redondearArriba(busquedaAgencia.length / NUM_RESULTS)"
          :total-visible="5"
        ></v-pagination>
      </div>
    </v-container>
  </div>
</template>
<script src="./vuejs/index.js"></script>
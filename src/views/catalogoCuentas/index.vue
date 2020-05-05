<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid>
      <v-card-title>
        Catálogo de Cuentas
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="cuentas"
        sort-by="id_cuenta"
        class="elevation-1"
        :loading="loader"
        loading-text="Cargando... Espere"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Catálogo de Cuentas</v-toolbar-title>
            <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <!-- <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nueva Cuenta</v-btn>
              </template>-->
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.cuenta" label="Cuenta"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          :items="itemNaturaleza"
                          item-text="valor"
                          item-value="naturaleza"
                          label="Naturaleza"
                          v-model="editedItem.naturaleza"
                        ></v-select>
                        <!-- <v-text-field v-model="editedItem.naturaleza" label="Naturaleza"></v-text-field> -->
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          :items="itemTipo"
                          item-text="valor"
                          item-value="tipo"
                          label="Tipo"
                          v-model="editedItem.tipo"
                        ></v-select>
                        <!-- <v-text-field v-model="editedItem.tipo" label="Tipo"></v-text-field> -->
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select :items="itemNivel" label="Nivel" v-model="editedItem.nivel"></v-select>
                        <!-- <v-text-field v-model="editedItem.nivel" label="Nivel"></v-text-field> -->
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="editedItem.may" label="Cuenta Mayor"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="editedItem.afecta" label="Afecta"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                  <v-btn
                    v-if="editedItem.id_cuenta"
                    color="blue darken-1"
                    text
                    @click="save(editedItem.id_cuenta)"
                  >{{ formTitle }}</v-btn>
                  <v-btn v-else color="blue darken-1" text @click="save(0)">{{ formTitle }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item="props">
          <tr>
            <td class="text-right">{{ props.item.id_cuenta }}</td>
            <td>{{ props.item.cuenta }}</td>
            <td>{{ props.item.descripcion }}</td>
            <td>
              <span v-if="props.item.naturaleza=='D'">Deudora</span>
              <span v-if="props.item.naturaleza=='A'">Acreedora</span>
            </td>
            <td>{{ ObtenerTipoCuenta(props.item.tipo) }}</td>
            <td class="text-right">{{ props.item.nivel }}</td>
            <td class="text-right">{{ props.item.may }}</td>
            <td>{{ props.item.afecta }}</td>
            <td class="text-center">{{ $formatDate(props.item.fecha_creacion) }}</td>
            <td>
              <v-btn class="ma-2" outlined fab small color="success" @click="editItem(props.item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <!-- <template v-slot:item.actions="{ item }">
          <v-btn class="ma-2" outlined fab small color="success" @click="editItem(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>-->
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
      <v-snackbar
        v-model="snackbar"
        :color="'green'"
        :multi-line="'multi-line'"
        :timeout="3000"
        :right="true"
        :bottom="true"
      >
        {{text_snackbar}}
        <v-btn dark text @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    loader: false,
    snackbar: false,
    search: "",
    text_snackbar: "",
    headers: [
      {
        text: "Folio",
        sortable: true,
        value: "id_cuenta"
      },
      { text: "Cuenta", value: "cuenta" },
      { text: "Descripción", value: "descripcion" },
      { text: "Naturaleza", value: "naturaleza" },
      { text: "Tipo", value: "tipo" },
      { text: "Nivel", value: "nivel" },
      { text: "Cuenta Mayor", value: "may" },
      { text: "Afecta", value: "afecta" },
      { text: "Fecha Creación", value: "fecha_creacion" },
      { text: "Acciones", value: "actions", sortable: false }
    ],
    cuentas: [],
    editedIndex: -1,
    editedItem: {
      id_cuenta: "",
      cuenta: "",
      descripcion: "",
      naturaleza: "",
      tipo: "",
      nivel: 4,
      may: "",
      afecta: ""
      // haber: 0.0,
      // deber: 0.0
    },
    defaultItem: {
      cuenta: "",
      descripcion: "",
      naturaleza: "",
      tipo: "",
      nivel: 4,
      may: "",
      afecta: ""
      // haber: 0.0,
      // deber: 0.0
    },
    itemTipo: [
      { valor: "Activo", tipo: "A" },
      { valor: "Pasivo", tipo: "P" },
      { valor: "Orden", tipo: "O" },
      { valor: "Balance", tipo: "B" },
      { valor: "Resultado", tipo: "R" }
    ],
    itemNaturaleza: [
      { valor: "Deudora", naturaleza: "D" },
      { valor: "Acreedora", naturaleza: "A" }
    ],
    itemNivel: ["1", "4"]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Cuenta" : "Editar";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.loader = true;
      this.$http
        .get(
          "https://www.rutamayatravel.com/" +
            this.sur4 +
            "/contabilidad/contCatalogoCtas/obtenerCuentas"
        )
        .then(
          function(response) {
            this.cuentas = response.data;
            this.loader = false;
          },
          function() {
            console.log("Error");
          }
        );
    },

    editItem(item) {
      this.editedIndex = this.cuentas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // console.log(this.editedItem);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.cuentas.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.cuentas.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save(id_item) {
      if (this.editedIndex > -1) {
        var editedIndex = this.editedIndex;
        this.$http
          .post(
            "https://www.rutamayatravel.com/" +
              this.sur4 +
              "/contabilidad/contCatalogoCtas/update/id/" +
              id_item,
            {
              CatalogoCtas: this.editedItem
            },
            { emulateJSON: true }
          )
          .then(function(response) {
            this.editedItem = response.body;
            Object.assign(this.cuentas[editedIndex], this.editedItem);
            this.close();
            this.text_snackbar = "Datos actualizados;";
            this.snackbar = true;
          });
      } else {
        this.cuentas.push(this.editedItem);
        this.close();
      }
    },

    ObtenerTipoCuenta(tipo) {
      var tipo_cuenta = "";
      switch (tipo) {
        case "A":
          tipo_cuenta = "Activo";
          break;
        case "P":
          tipo_cuenta = "Pasivo";
          break;
        case "O":
          tipo_cuenta = "Orden";
          break;
        case "B":
          tipo_cuenta = "Balance";
          break;
        case "R":
          tipo_cuenta = "Resultado";
          break;
        default:
          tipo_cuenta = "Activo";
          break;
      }

      return tipo_cuenta;
    }
  }
};
</script>
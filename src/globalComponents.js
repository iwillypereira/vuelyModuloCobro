/**
 * Vuely Global Components
 */
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import AppSectionLoader from "Components/AppSectionLoader/AppSectionLoader";
import {
   RotateSquare2
} from "vue-loading-spinner";

// delete Confirmation Dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

//crypto slider
import CryptoSlider from "Components/Widgets/CryptoSlider";

// App Card component
import AppCard from 'Components/AppCard/AppCard';

// stats card
import StatsCard from 'Components/StatsCard/StatsCard';
import StatsCardV2 from 'Components/StatsCardV2/StatsCardV2';

// section tooltip
import SectionTooltip from "Components/SectionTooltip/SectionTooltip"
import ComponentPrueba from "Components/RMT/componenteprueba"

// tasa cambio
import TasaCambio from "Components/TasaCambio/TipoCambio"

import Chat from "Components/Widgets/Chat"

import SaldosBloqueo from "Components/Widgets/SaldosBloqueo"

// import ModalPagos from "Components/Widgets/ModalPagos"

// import FormPagos from "Components/FormularioPagos/Form"




const GlobalComponents = {
   install(Vue) {
      Vue.component('appCard', AppCard);
      Vue.component('componentPrueba', ComponentPrueba);
      Vue.component('sectionTooltip', SectionTooltip);
      Vue.component('statsCard', StatsCard);
      Vue.component('statsCardV2', StatsCardV2);
      Vue.component('deleteConfirmationDialog', DeleteConfirmationDialog);
      Vue.component('vuePerfectScrollbar', VuePerfectScrollbar);
      Vue.component('appSectionLoader', AppSectionLoader);
      Vue.component('pageTitleBar', PageTitleBar);
      Vue.component('rotateSquare2', RotateSquare2);
      Vue.component('cryptoSlider', CryptoSlider);
      Vue.component('tasa-cambio', TasaCambio);
      Vue.component('chat-widget', Chat);
      Vue.component('saldos-bloqueo', SaldosBloqueo);
      // Vue.component('modal-pagos', ModalPagos);
      // Vue.component('Form-pagos', FormPagos);
   }
}

export default GlobalComponents
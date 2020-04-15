import Vue from 'vue'
import App from './App.vue'
import {Cell, CellGroup, Field, Picker, Popup} from "vant";

Vue.config.productionTip = false
Vue.use(Picker).use(require('vue-moment')).use(Cell).use(CellGroup).use(Field).use(Popup)
new Vue({
  render: h => h(App),
}).$mount('#app')

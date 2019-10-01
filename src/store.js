import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openrpc: {},
    methods: {},
    schemas: {},
    method: {},
    apis: {
      ubiq: {
        to: '/ubiq',
        icon: 'ubiq.svg',
        json: 'https://raw.githubusercontent.com/ubiq/ubiq-json-rpc-specification/master/openrpc.json',
        title: 'Ubiq',
        url: 'https://rpc.octano.dev'
      },
      etc: {
        to: '/etc',
        icon: 'etc.svg',
        json: 'https://raw.githubusercontent.com/etclabscore/ethereum-json-rpc-specification/master/openrpc.json',
        title: 'Ethereum Classic',
        url: ''
      }
    },
    endpoint: 'https://rpc.octano.dev',
    showRightDrawer: false
  },
  mutations: {
    setOpenRpc (state, json) {
      state.openrpc = json
    },
    setSchemas (state, payload) {
      state.schemas = payload
    },
    setMethods (state, payload) {
      state.methods = payload
    },
    setMethod (state, payload) {
      state.method = payload
    },
    showRightDrawer (state, show) {
      state.showRightDrawer = show
    },
    setApis (state, payload) {
      state.apis = payload
    },
  },
  actions: {

  }
})

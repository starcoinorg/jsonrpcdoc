import Vue from "vue";
import Vuex from "vuex";
import JSRP from "json-schema-ref-parser";
import { dereference } from "./utils/nest_ref_parser"

Vue.use(Vuex);

function newEmptyApiSchema() {
  return {
    document: {
      original: {
        schema: {},
        deref: {}
      },
      modified: {
        schema: {},
        deref: {}
      }
    },
    selected: 0, // selected methodId,
    error: false // json parse error
  };
}

export default new Vuex.Store({
  state: {
    apiId: "chain", // selected apiId (ubiq, etc, custom)
    clientVer: false,
    drawers: {
      left: true,
      right: true
    },
    editMode: false,
    position: {
      lineNumber: 1,
      column: 1
    },
    errors: [],
    apis: {
      // ubiq: {
      //   openrpc: newEmptyApiSchema(),
      //   info: {
      //     to: "/ubiq",
      //     icon: "apis/ubiq.svg",
      //     json:
      //       "https://raw.githubusercontent.com/ubiq/ubiq-json-rpc-specification/master/openrpc.json",
      //     title: "Ubiq",
      //     desc: "Ubiq mainnet",
      //     url: "https://rpc.octano.dev"
      //   }
      // },
      chain: {
        openrpc: newEmptyApiSchema(),
        info: {
          to: "/chain",
          icon: "apis/stc.svg",
          json:
            "https://raw.githubusercontent.com/starcoinorg/starcoin/master/rpc/api/generated_rpc_schema/chain.json",
          title: "Starcoin Chain API",
          desc: "Starcoin Chain API Documents",
          url: "https://main-seed.starcoin.org"
        }
      },
      contract_api: {
        openrpc: newEmptyApiSchema(),
        info: {
          to: "/contract_api",
          icon: "apis/stc.svg",
          json:
            "https://raw.githubusercontent.com/starcoinorg/starcoin/master/rpc/api/generated_rpc_schema/contract_api.json",
          title: "Starcoin Contract API",
          desc: "Starcoin Contract API Documents",
          url: "https://main-seed.starcoin.org"
        }
      },
      state: {
        openrpc: newEmptyApiSchema(),
        info: {
          to: "/state",
          icon: "apis/stc.svg",
          json:
            "https://raw.githubusercontent.com/starcoinorg/starcoin/master/rpc/api/generated_rpc_schema/state.json",
          title: "Starcoin State API",
          desc: "Starcoin State API Documents",
          url: "https://main-seed.starcoin.org"
        }
      },
      txpool: {
        openrpc: newEmptyApiSchema(),
        info: {
          to: "/txpool",
          icon: "apis/stc.svg",
          json:
            "https://raw.githubusercontent.com/starcoinorg/starcoin/master/rpc/api/generated_rpc_schema/txpool.json",
          title: "Starcoin Txpool API",
          desc: "Starcoin Txpool API Documents",
          url: "https://main-seed.starcoin.org"
        }
      },
      node: {
        openrpc: newEmptyApiSchema(),
        info: {
          to: "/node",
          icon: "apis/stc.svg",
          json:
            "https://raw.githubusercontent.com/starcoinorg/starcoin/master/rpc/api/generated_rpc_schema/node.json",
          title: "Starcoin Node API",
          desc: "Starcoin Node API Documents",
          url: "https://main-seed.starcoin.org"
        }
      },
      account: {
        openrpc: newEmptyApiSchema(),
        info: {
          to: "/account",
          icon: "apis/stc.svg",
          json:
            "https://raw.githubusercontent.com/starcoinorg/starcoin/master/rpc/api/generated_rpc_schema/account.json",
          title: "Starcoin Account API",
          desc: "Starcoin Account API Documents",
          url: "https://main-seed.starcoin.org"
        }
      },
      custom: {
        openrpc: newEmptyApiSchema(),
        info: {
          to: "/custom",
          icon: "openrpc.png",
          json:
            "https://raw.githubusercontent.com/octanolabs/d0x/master/openrpc.json",
          title: "Example Document",
          desc: "New OpenRPC document",
          url: "http://localhost:3301"
        }
      }
    }
  },
  mutations: {
    setOpenRpcOriginal(state, payload) {
      state.apis[payload.apiId].openrpc.document.original.schema = payload.json;
      if (payload.modified) {
        state.apis[payload.apiId].openrpc.document.modified.schema =
          payload.json;
      }

      // JSON deep copy fuckery to prevent deref referencing payload.json (we don't want the deref going back to schema)
      var copyPayload = JSON.parse(JSON.stringify(payload.json))

      dereference(copyPayload,
        (err, deref) => {
          if (err) {
            state.errors.push(err);
          } else {
            let methods = deref.methods;
            // add a numeric ID to each method
            let count = 0;
            for (let method of methods) {
              method.methodId = count;
              methods[count] = method;
              count++;
            }
            state.apis[payload.apiId].openrpc.document.original.deref = deref;
            if (payload.modified) {
              state.apis[payload.apiId].openrpc.document.modified.deref = deref;
            }
          }
        }
      );
    },
    setOpenRpcModified(state, payload) {
      state.apis[payload.apiId].openrpc.document.modified.schema = payload.json;
      state.apis[payload.apiId].openrpc.error = false; // reset error

      // JSON deep copy fuckery to prevent deref referencing payload.json (we don't want the deref going back to schema)
      var copyPayload = JSON.parse(JSON.stringify(payload.json))

      dereference(
        copyPayload,
        (err, deref) => {
          if (err) {
            state.errors.push(err);
          } else {
            let methods = deref.methods;
            // add a numeric ID to each method
            let count = 0;
            for (let method of methods) {
              method.methodId = count;
              methods[count] = method;
              count++;
            }
            state.apis[payload.apiId].openrpc.document.modified.deref = deref;
          }
        }
      );
    },
    setOpenRpcError(state, payload) {
      state.apis[payload.apiId].openrpc.error = payload.err;
    },
    setSelected(state, payload) {
      state.apis[payload.apiId].openrpc.selected = payload.method;
    },
    toggleDrawer(state, side) {
      // side: 'left' or 'right'
      state.drawers[side] = !state.drawers[side];
    },
    setApiId(state, payload) {
      state.apiId = state.apis[payload] ? payload : "chain";
    },
    setClientVer(state, payload) {
      state.clientVer = payload;
    },
    setEditMode(state, payload) {
      state.editMode = payload;
    },
    setEditorPosition(state, payload) {
      state.position = payload;
    },
    addError(state, payload) {
      state.errors.push(payload);
    }
  },
  actions: {}
});

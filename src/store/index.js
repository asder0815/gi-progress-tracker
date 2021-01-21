import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0, 
    xpAll: 0, 
    moraAll: 0,
    xpTable: [
      {xp: 120175, mora: 24000},
      {xp: 578325, mora: 115600}, 
      {xp: 579100, mora: 115800},
      {xp: 854125, mora: 170800},
      {xp: 1195925, mora: 239000},
      {xp: 1611875, mora: 322200},
      {xp: 3424125, mora: 684600}
    ], 
    ascensionTable: [
      {elementalMat_T1: 1, elementalMat_T2: 0, elementalMat_T3: 0, elementalMat_T4: 0, core: 0, speciality: 3, commonMat_T1: 3, commonMat_T2: 0, commonMat_T3: 0, mora: 20000}, 
      {elementalMat_T1: 0, elementalMat_T2: 3, elementalMat_T3: 0, elementalMat_T4: 0, core: 2, speciality: 10, commonMat_T1: 15, commonMat_T2: 0, commonMat_T3: 0, mora: 40000}, 
      {elementalMat_T1: 0, elementalMat_T2: 6, elementalMat_T3: 0, elementalMat_T4: 0, core: 4, speciality: 20, commonMat_T1: 0, commonMat_T2: 12, commonMat_T3: 0, mora: 60000}, 
      {elementalMat_T1: 0, elementalMat_T2: 0, elementalMat_T3: 3, elementalMat_T4: 0, core: 8, speciality: 30, commonMat_T1: 0, commonMat_T2: 18, commonMat_T3: 0, mora: 80000},
      {elementalMat_T1: 0, elementalMat_T2: 0, elementalMat_T3: 6, elementalMat_T4: 0, core: 12, speciality: 45, commonMat_T1: 0, commonMat_T2: 0, commonMat_T3: 12, mora: 100000},
      {elementalMat_T1: 0, elementalMat_T2: 0, elementalMat_T3: 0, elementalMat_T4: 6, core: 20, speciality: 60, commonMat_T1: 0, commonMat_T2: 0, commonMat_T3: 24, mora: 120000}  
    ]
  },
  mutations: {
    increaseCount(state) {
      state.count++; 
    }
  },
  actions: {
  },
  modules: {
  }
})

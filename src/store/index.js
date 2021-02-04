import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const C = {
  materials: {
    mora: {name: 'Mora', icon: require('@/assets/material_icons/Mora.png')},
    experience: {name: "Hero's Wit", icon: require("@/assets/material_icons/Item_Hero_s_Wit.png")},
    crown: {name: 'Crown of Insight', icon: require('@/assets/material_icons/Crown_of_Insight.png')}, 
    ice_crystal_T1: {name: 'Shivada Jade Sliver', icon: require('@/assets/material_icons/Shivada Jade Sliver.png')}, 
    ice_crystal_T2: {name: 'Shivada Jade Fragment', icon: require('@/assets/material_icons/Shivada Jade Fragment.png')}, 
    ice_crystal_T3: {name: 'Shivada Jade Chunk', icon: require('@/assets/material_icons/Shivada Jade Chunk.png')}, 
    ice_crystal_T4: {name: 'Shivada Jade Gemstone', icon: require('@/assets/material_icons/Shivada Jade Gemstone.png')}, 
    electro_crystal_T1: {name: 'Vajrada Amethyst Sliver', icon: require('@/assets/material_icons/Vajrada Amethyst Sliver.png')}, 
    electro_crystal_T2: {name: 'Vajrada Amethyst Fragment', icon: require('@/assets/material_icons/Vajrada Amethyst Fragment.png')}, 
    electro_crystal_T3: {name: 'Vajrada Amethyst Chunk', icon: require('@/assets/material_icons/Vajrada Amethyst Chunk.png')}, 
    electro_crystal_T4: {name: 'Vajrada Amethyst Gemstone', icon: require('@/assets/material_icons/Vajrada Amethyst Gemstone.png')}, 
    book_prosperity_T1: {name: 'Teachings of Prosperity', icon: require('@/assets/material_icons/Item_Prosperity_Teachings.png')},
    book_prosperity_T2: {name: 'Guide to Prosperity', icon: require('@/assets/material_icons/Item_Prosperity_Guide.png')},
    book_prosperity_T3: {name: 'Philosophies of Prosperity', icon: require('@/assets/material_icons/Item_Prosperity_Philosophies.png')},
    book_gold_T1: {name: 'Teachings of Gold', icon: require('@/assets/material_icons/Item_Gold_Teachings.png')},
    book_gold_T2: {name: 'Guide to Gold', icon: require('@/assets/material_icons/Item_Gold_Guide.png')},
    book_gold_T3: {name: 'Philosophies of Gold', icon: require('@/assets/material_icons/Item_Gold_Philosophies.png')},
    book_ballad_T1: {name: 'Teachings of Ballad', icon: require('@/assets/material_icons/Item_Ballad_Teachings.png')},
    book_ballad_T2: {name: 'Guide to Ballad', icon: require('@/assets/material_icons/Item_Ballad_Guide.png')},
    book_ballad_T3: {name: 'Philosophies of Ballad', icon: require('@/assets/material_icons/Item_Ballad_Philosophies.png')},
    item_fatui_insignia_T1: {name: 'Recruit Insignia', icon: require('@/assets/material_icons/Item_Insignia_Recruit.png')}, 
    item_fatui_insignia_T2: {name: 'Sergeant Insignia', icon: require('@/assets/material_icons/Item_Insignia_Sergants.png')}, 
    item_fatui_insignia_T3: {name: 'Lieutnant Insignia', icon: require('@/assets/material_icons/Item_Insignia_Lieutenant.png')}, 
    item_raven_insignia_T1: {name: 'Treasure Hoarder Insignia', icon: require('@/assets/material_icons/Item_Raven_Insignia_Treasure.png')}, 
    item_raven_insignia_T2: {name: 'Silver Raven Insignia', icon: require('@/assets/material_icons/Item_Raven_Insignia_Silver.png')}, 
    item_raven_insignia_T3: {name: 'Golden Raven Insignia', icon: require('@/assets/material_icons/Item_Raven_Insignia_Gold.png')}, 
    boss_ring_of_boreas: {name: 'Ring of Boreas', icon: require('@/assets/material_icons/Item_Boreas_Ring.png')}, 
    boss_dvalins_sigh: {name: "Dvalin’s Sigh", icon: require('@/assets/material_icons/Item_Dvalin_Sigh.png')}, 
    boss_childe_shadow: {name: "Shadow of the Warrior", icon: require('@/assets/material_icons/Item_Childe_Shadow.png')}, 
    item_hoarfrost_core: {name: 'Hoarfrost Core', icon: require('@/assets/material_icons/Item_Hoarfrost_Core.png')}, 
    item_lightning_prism: {name: 'Lightning Prism', icon: require('@/assets/material_icons/Item_Lightning_Prism.png')}, 
    speciality_valberry: {name: 'Valberry', icon: require('@/assets/material_icons/Item_Valberry.png')}, 
    speciality_noctilus_jade: {name: 'Noctilucous Jade', icon: require('@/assets/material_icons/Item_Noctilucous_Jade.png')}, 
    item_nectar_T1: {name: 'Whopperflower Nectar', icon: require('@/assets/material_icons/Item_Nectar_Whopperflower.png')}, 
    item_nectar_T2: {name: 'Shimmering Nectar', icon: require('@/assets/material_icons/Item_Nectar_Shimmering.png')}, 
    item_nectar_T3: {name: 'Energy Nectar', icon: require('@/assets/material_icons/Item_Nectar_Energy.png')}
  }
}

export default new Vuex.Store({
  state: {
    count: 0, 
    xpAll: 0, 
    moraAll: 0,
    characters: [
      { 
        name: 'Rosaria', 
        picture: require('@/assets/character_portraits/rosaria.png'), 
        iconAtk: require('@/assets/talent_icons/rosaria_atk.png'), 
        iconSkill: require('@/assets/talent_icons/rosaria_skill.png'), 
        iconBurst: require('@/assets/talent_icons/rosaria_burst.png'),
        elementalMat_T1: C.materials.ice_crystal_T1, 
        elementalMat_T2: C.materials.ice_crystal_T2, 
        elementalMat_T3: C.materials.ice_crystal_T3, 
        elementalMat_T4: C.materials.ice_crystal_T4, 
        core: C.materials.item_hoarfrost_core,
        speciality: C.materials.speciality_valberry, 
        commonMat_Ascension_T1: C.materials.item_fatui_insignia_T1, 
        commonMat_Ascension_T2: C.materials.item_fatui_insignia_T2, 
        commonMat_Ascension_T3: C.materials.item_fatui_insignia_T3, 
        commonMat_Talent_T1: C.materials.item_fatui_insignia_T1, 
        commonMat_Talent_T2: C.materials.item_fatui_insignia_T2, 
        commonMat_Talent_T3: C.materials.item_fatui_insignia_T3, 
        book_T1: C.materials.book_ballad_T1,
        book_T2: C.materials.book_ballad_T2,
        book_T3: C.materials.book_ballad_T3,
        worldBossMat: C.materials.boss_childe_shadow, 
        crown: C.materials.crown, 
        description: "MILKY MILKY WARM AND TASTY! MOMMY! MILKY! PLEASE BE HASTY! REFRESHING DRINK FROM MOMMY’S UDDERS! I WANT MOMMY’S AND NO OTHER’S! GIVE IT! GIVE IT! GIVE IT NOW! GIVE ME MILKY, LAZY SOW! UNTIL YOU DO I’LL SCREAM I’LL SHOUT! I’LL CRY I’LL WHINE AND STOMP ABOUT! UNTIL MY BELLY IS FULL AND HAPPY! I REFUSE TO TAKE A NAPPY!"
      }, 
      { 
        name: 'Beidou', 
        picture: require('@/assets/character_portraits/beidou.png'), 
        iconAtk: require('@/assets/talent_icons/beidou_atk.png'), 
        iconSkill: require('@/assets/talent_icons/beidou_skill.png'), 
        iconBurst: require('@/assets/talent_icons/beidou_burst.png'),
        elementalMat_T1: C.materials.electro_crystal_T1,
        elementalMat_T2: C.materials.electro_crystal_T2, 
        elementalMat_T3: C.materials.electro_crystal_T3, 
        elementalMat_T4: C.materials.electro_crystal_T4, 
        core: C.materials.item_lightning_prism,
        speciality: C.materials.speciality_noctilus_jade, 
        commonMat_Ascension_T1: C.materials.item_raven_insignia_T1, 
        commonMat_Ascension_T2: C.materials.item_raven_insignia_T2, 
        commonMat_Ascension_T3: C.materials.item_raven_insignia_T3, 
        commonMat_Talent_T1: C.materials.item_raven_insignia_T1, 
        commonMat_Talent_T2: C.materials.item_raven_insignia_T2, 
        commonMat_Talent_T3: C.materials.item_raven_insignia_T3, 
        book_T1: C.materials.book_gold_T1, 
        book_T2: C.materials.book_gold_T2,
        book_T3: C.materials.book_gold_T3,
        worldBossMat: C.materials.boss_dvalins_sigh, 
        crown: C.materials.crown, 
        description: "Beidou"
      }
    ],
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
      {elementalMat_T1: 1, elementalMat_T2: 0, elementalMat_T3: 0, elementalMat_T4: 0, core: 0, speciality: 3, commonMat_Ascension_T1: 3, commonMat_Ascension_T2: 0, commonMat_Ascension_T3: 0, mora: 20000}, 
      {elementalMat_T1: 0, elementalMat_T2: 3, elementalMat_T3: 0, elementalMat_T4: 0, core: 2, speciality: 10, commonMat_Ascension_T1: 15, commonMat_Ascension_T2: 0, commonMat_Ascension_T3: 0, mora: 40000}, 
      {elementalMat_T1: 0, elementalMat_T2: 6, elementalMat_T3: 0, elementalMat_T4: 0, core: 4, speciality: 20, commonMat_Ascension_T1: 0, commonMat_Ascension_T2: 12, commonMat_Ascension_T3: 0, mora: 60000}, 
      {elementalMat_T1: 0, elementalMat_T2: 0, elementalMat_T3: 3, elementalMat_T4: 0, core: 8, speciality: 30, commonMat_Ascension_T1: 0, commonMat_Ascension_T2: 18, commonMat_Ascension_T3: 0, mora: 80000},
      {elementalMat_T1: 0, elementalMat_T2: 0, elementalMat_T3: 6, elementalMat_T4: 0, core: 12, speciality: 45, commonMat_Ascension_T1: 0, commonMat_Ascension_T2: 0, commonMat_Ascension_T3: 16, mora: 100000},
      {elementalMat_T1: 0, elementalMat_T2: 0, elementalMat_T3: 0, elementalMat_T4: 6, core: 20, speciality: 60, commonMat_Ascension_T1: 0, commonMat_Ascension_T2: 0, commonMat_Ascension_T3: 24, mora: 120000}  
    ], 
    talentTable: [
      {book_T1: 3, book_T2: 0, book_T3: 0, commonMat_Talent_T1: 6, commonMat_Talent_T2: 0, commonMat_Talent_T3: 0, worldBossMat: 0, crown: 0, mora: 12500},
      {book_T1: 0, book_T2: 2, book_T3: 0, commonMat_Talent_T1: 0, commonMat_Talent_T2: 3, commonMat_Talent_T3: 0, worldBossMat: 0, crown: 0, mora: 17500},
      {book_T1: 0, book_T2: 4, book_T3: 0, commonMat_Talent_T1: 0, commonMat_Talent_T2: 4, commonMat_Talent_T3: 0, worldBossMat: 0, crown: 0, mora: 25000},
      {book_T1: 0, book_T2: 6, book_T3: 0, commonMat_Talent_T1: 0, commonMat_Talent_T2: 6, commonMat_Talent_T3: 0, worldBossMat: 0, crown: 0, mora: 30000},
      {book_T1: 0, book_T2: 9, book_T3: 0, commonMat_Talent_T1: 0, commonMat_Talent_T2: 9, commonMat_Talent_T3: 0, worldBossMat: 0, crown: 0, mora: 37500},
      {book_T1: 0, book_T2: 0, book_T3: 4, commonMat_Talent_T1: 0, commonMat_Talent_T2: 0, commonMat_Talent_T3: 4, worldBossMat: 1, crown: 0, mora: 120000},
      {book_T1: 0, book_T2: 0, book_T3: 6, commonMat_Talent_T1: 0, commonMat_Talent_T2: 0, commonMat_Talent_T3: 6, worldBossMat: 1, crown: 0, mora: 260000},
      {book_T1: 0, book_T2: 0, book_T3: 12, commonMat_Talent_T1: 0, commonMat_Talent_T2: 0, commonMat_Talent_T3: 9, worldBossMat: 2, crown: 0, mora: 450000},
      {book_T1: 0, book_T2: 0, book_T3: 16, commonMat_Talent_T1: 0, commonMat_Talent_T2: 0, commonMat_Talent_T3: 12, worldBossMat: 2, crown: 1, mora: 700000}
    ], 
    xpMaterials: {
      character: {name: 'Hero’s Wit', amount: 20000}
    }, 
    materialList: C,
    summaryData: []
  },
  mutations: {
    increaseCount(state) {
      state.count++; 
    }, 
    updateSummaryData(state, summary) {
      if(!state.summaryData.some(data => data.id === summary.id)) {
        state.summaryData.push({id: summary.id, data: summary.data}); 
      }
      else {
        state.summaryData.find(data => { return data.id === summary.id; }).data = summary.data; 
      }
    }
  },
  actions: {
  },
  modules: {
  }
})

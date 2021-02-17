<template>
  <v-card class="ma-3" max-width="400" outlined>
    <v-container class="mb-3">
      <v-row class="mt-1 mx-1">
        <v-col cols="3">
          <v-row justify="center">
            <v-img :src="weaponData.picture" max-height="90" max-width="90" class="mb-2 handle"/>
          </v-row>
          <v-row justify="center">
            <v-btn depressed block @click.stop="enableWeapon(!disabled)" class="mb-2">{{disabled ? "Enable" : "Disable"}}</v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn depressed block @click.stop="deleteWeapon()" color="error"> Delete </v-btn>
          </v-row>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-card-title primary-title class="justify-center my-n3">
              <h2>{{weaponData.name}}</h2>
            </v-card-title>
          </v-row>
          <v-row>
            <v-container>
              Level:
              <vue-slider v-model="level" :label="labels.level" :max="90" :marks="[0, 20, 40, 50, 60, 70, 80, 90]" :included="true" :contained="true" class="mb-1"/>
            </v-container>
          </v-row>
          <v-row>
            <v-container>
              Ascension:
              <vue-slider v-model="ascension" :label="labels.ascension" :max="6" :marks="true" :contained="true"/>
            </v-container>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-row>
      <v-switch v-model="crafted" inset label="Crafted"></v-switch>
      <v-container>
        Refine:
        <vue-slider v-model="refine" :label="labels.refine" :min="1" :max="5" :marks="[1, 2, 3, 4, 5]" :included="true" :contained="true" class="mb-1"/>
      </v-container>
    </v-row>

    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" depressed block> View Required Materials </v-btn>
      </template>
      <v-card>
        <v-data-table :headers="headers" :items="tableItems" :disable-sort="true" :disable-pagination="true" :hide-default-footer="true" class="elevation-1">
          <template v-slot:item.icon="cell">
            <v-img :src="cell.item.icon" :max-width="40" :max-height="40"></v-img>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <v-overlay :absolute="true" :opacity="0.9" :value="overlay" >
      <v-btn color="green" @click="enableWeapon(!disabled)" block>Enable</v-btn>
    </v-overlay>
  </v-card> 
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  name: 'WeaponCard',
  components: {
    VueSlider
  },
  props: {
    id: Number, 
    weaponData: {
      type: Object, 
      required: true, 
      validator: weaponData => {
        return weaponData != undefined; 
      }
    }, 
    priority: Number
  },
  data: () => ({
    dialog: false,
    disabled: false, 
    overlay: false, 
    level: [0, 90], 
    ascension: [0, 6],
    crafted: false,
    refine: [1, 5],
    labels: {level: "Levels: ", ascension: "Ascensions: ", refine: "Refine: "}, 
    headers: [{text: "Material", align: "start", value: "name"}, {text: "Icon", sortable: "false", value: "icon"}, {text: "Amount", value: "amount"}]
  }), 
  computed: {
    requiredLevels: function() {
      return this.getRequired(this.level); 
    },
    requiredAscensions: function() {
      return this.getRequired(this.ascension); 
    }, 
    requiredRefines: function() {
      return this.getRequired(this.refine); 
    },
    summary_requiredXP: function() {
      var result = 0;
      var xpTable = this.$store.state.xpTableWeapons[this.weaponData.rarity];
      if(this.requiredLevels.length > 0)
      {
        var range = this.getLevelRange([this.requiredLevels[0]-1, this.requiredLevels[this.requiredLevels.length-1]]); 
        for(var i = range.start;  i < range.end; i++) {
          result += xpTable[i].xp; 
        }
        return result; 
      }
      else return 0; 
    }, 
    summary_requiredMora: function() {
      var result = 0; 
      var xpTable = this.$store.state.xpTableWeapons[this.weaponData.rarity];
      if(this.requiredLevels.length > 0) {
        var range = this.getLevelRange([this.requiredLevels[0]-1, this.requiredLevels[this.requiredLevels.length-1]]); 
        for(var i = range.start;  i < range.end; i++) {
          result += xpTable[i].mora; 
        } 
      }
      result += this.summary_requiredAscensionMats.mora; 
      result += this.summary_requiredRefineMora; 
      return result; 
    },
    summary_requiredAscensionMats: function() {
      var ascTable = this.$store.state.ascensionTableWeapons[this.weaponData.rarity];
      var result = {wm_T1: 1, wm_T2: 0, wm_T3: 0, wm_T4: 0, cm1_T1: 1, cm1_T2: 0, cm1_T3: 0, cm2_T1: 1, cm2_T2: 0, cm2_T3: 0, mora: 0}; 
      for(var i = Math.min(...this.requiredAscensions)-1; i < Math.max(...this.requiredAscensions); i++) {
        Object.keys(result).forEach(function(key) {
          result[key] += ascTable[i][key];
        });
      }
      return result; 
    }, 
    summary_requiredRefineMats: function() {
      var amountCraft = 1 + (Math.max(...this.refine) - Math.min(...this.refine)); 
      if(this.crafted && amountCraft > 0) amountCraft--; 
      var result = []; 
      if(this.weaponData.crafted == true && amountCraft > 0) {
        this.weaponData.craftingMats.forEach(element => {
          result.push({name: element.item.name, icon: element.item.icon, amount: element.amount * amountCraft}); 
        }); 
      }
      else if(amountCraft > 0) {
        result.push({name: this.weaponData.name, icon: this.weaponData.picture, amout: amountCraft}); 
      }
      return result; 
    },
    summary_requiredRefineMora: function() {
      var amountCraft = Math.max(...this.requiredAscensions) - Math.min(...this.requiredAscensions); 
      if(this.crafted && amountCraft > 0) amountCraft--; 
      return amountCraft * 500; 
    },
    tableItems: function() {
      return this.getTableItems(); 
    }
  }, 
  methods: {
    getRequired: function(array) {
      var list = [];
      for (var i = Math.min(...array); i < Math.max(...array); i++) {
        list.push(i+1);
      }
      return list;
    }, 
    getLevelRange: function(array) {
      var dict = [{v: 0, i:0},{v: 20, i: 1},{v: 40, i: 2},{v: 50, i: 3},{v: 60, i: 4},{v: 70, i: 5},{v: 80, i: 6},{v: 90, i:7}]; 
      return {start: dict.find(obj => { return obj.v === array[0]; }).i, end: dict.find(obj => { return obj.v === array[1]; }).i}; 
    }, 
    getTableItems: function() {
      var result = []; 
      var data = this.weaponData; 
      [this.summary_requiredAscensionMats].forEach(summary => {
        Object.keys(summary).forEach(function(key) {
          if(data[key] != undefined && key != 'mora' && summary[key] > 0) result.push({name: data[key].name, icon: data[key].icon, amount: summary[key]}); 
        });
      });
      if(this.summary_requiredXP > 0) result.push({name: this.$store.state.xpMaterials.weapon.name, icon: this.$store.state.materialList.materials.enhancment_ore.icon, amount: Math.ceil(this.summary_requiredXP / this.$store.state.xpMaterials.weapon.amount)}); 
      this.summary_requiredRefineMats.forEach(element => {
        result.push(element); 
      });
      if(this.summary_requiredMora > 0) result.push({name: 'Mora', icon: this.$store.state.materialList.materials.mora.icon, amount: this.summary_requiredMora}); 
      if(!this.disabled) this.$store.commit('updateSummaryData', {id: this.id, data: result});
      else this.$store.commit('updateSummaryData', {id: this.id, data: []});
      return result; 
    },
    enableWeapon: function(enable) {
      this.disabled = enable; 
      this.overlay = enable; 
      if(this.disabled) this.$store.commit('updateSummaryData', {id: this.id, data: []});
      else this.getTableItems(); 
    }, 
    deleteWeapon: function() {
      this.$store.commit('updateSummaryData', {id: this.id, data: []});
      this.$emit('delete'); 
    }, 
    saveToLocalStorage: function() {
      var wpnData = {
        name: this.weaponData.name, 
        level: this.level, 
        ascension: this.ascension, 
        disabled: this.disabled,
        priority: this.priority}; 
      localStorage[this.weaponData.name] = JSON.stringify(wpnData); 
    }, 
    recomputeProgress: function() {
      this.getLevelsFromStorage(); 
    }, 
    getLevelsFromStorage: function() {
      var storageData = JSON.parse(localStorage[this.weaponData.name]); 
      this.level = storageData.level; 
      this.ascension = storageData.ascension; 
      this.disabled = storageData.disabled; 
      this.overlay = storageData.disabled; 
    }
  }, 
  mounted() {
    if(localStorage[this.weaponData.name]) {
      this.getLevelsFromStorage(); 
    }
    else this.saveToLocalStorage(); 
  }, 
  watch: {
    level() { this.saveToLocalStorage(); }, 
    ascension() { this.saveToLocalStorage(); }, 
    disabled() { this.saveToLocalStorage(); }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

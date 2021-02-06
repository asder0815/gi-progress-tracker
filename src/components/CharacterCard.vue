<template>
  <v-card class="ma-3" max-width="400" outlined>
    <v-container class="mb-3">
      <v-row class="mt-1 mx-1">
        <v-col cols="3">
          <v-row justify="center">
            <v-img :src="characterData.picture" max-height="90" max-width="90" class="mb-2"/>
          </v-row>
          <v-row justify="center">
            <v-btn depressed block @click.stop="enableCharacter(!disabled)" class="mb-2">{{disabled ? "Enable" : "Disable"}}</v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn depressed block @click.stop="deleteCharacter()" color="error"> Delete </v-btn>
          </v-row>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-card-title primary-title class="justify-center my-n3">
              <h2>{{characterData.name}}</h2>
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
    <v-divider h1 class="mx-4"></v-divider>
    <v-container class="mb-2">
      <v-row no-gutters>
        <v-col order="first" align="center" cols="6" md="4">
            <v-img :src="characterData.iconAtk" :max-height="90" :max-width="90"></v-img>
            <v-container>
              <vue-slider v-model="atkLevel" :min="1" :max="10" :contained="true" :marks="[2, 6, 9]" :width="90"></vue-slider>
            </v-container>
        </v-col>
        <v-col align="center" cols="6" md="4">
            <v-img :src="characterData.iconSkill" :max-height="90" :max-width="90"></v-img>
            <v-container>
              <vue-slider v-model="skillLevel" :min="1" :max="10" :contained="true" :marks="[2, 6, 9]" :width="90"></vue-slider>
            </v-container>
        </v-col>
        <v-col order="last" align="center" cols="6" md="4">
            <v-img :src="characterData.iconBurst" :max-height="90" :max-width="90"></v-img>
            <v-container>
              <vue-slider v-model="burstLevel" :min="1" :max="10" :contained="true" :marks="[2, 6, 9]" :width="90"></vue-slider>
            </v-container>
        </v-col>
      </v-row>
    </v-container>
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
  </v-card> 
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  name: 'CharacterCard',
  components: {
    VueSlider
  },
  props: {
    id: Number, 
    characterData: {
      type: Object, 
      required: true, 
      validator: characterData => {
        return characterData != undefined; 
      }
    }
  },
  data: () => ({
    dialog: false,
    disabled: false, 
    level: [0, 90], 
    ascension: [0, 6],
    atkLevel: [1, 10],
    skillLevel: [1, 10], 
    burstLevel: [1, 10], 
    labels: {level: "Levels: ", ascension: "Ascensions: "}, 
    headers: [{text: "Material", align: "start", value: "name"}, {text: "Icon", sortable: "false", value: "icon"}, {text: "Amount", value: "amount"}]
  }), 
  computed: {
    requiredLevels: function() {
      return this.getRequired(this.level); 
    },
    requiredAscensions: function() {
      return this.getRequired(this.ascension); 
    }, 
    requiredAtkTalents: function() {
      return this.getRequired(this.atkLevel); 
    },
    requiredSkillTalents: function() {
      return this.getRequired(this.skillLevel); 
    },
    requiredBurstTalents: function() {
      return this.getRequired(this.burstLevel); 
    }, 
    summary_requiredXP: function() {
      var result = 0;
      var xpTable = this.$store.state.xpTable;
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
      var xpTable = this.$store.state.xpTable;
      if(this.requiredLevels.length > 0) {
        var range = this.getLevelRange([this.requiredLevels[0]-1, this.requiredLevels[this.requiredLevels.length-1]]); 
        for(var i = range.start;  i < range.end; i++) {
          result += xpTable[i].mora; 
        } 
      }
      result += this.summary_requiredAscensionMats.mora; 
      result += this.summary_requiredTalentMats.mora; 
      return result; 
    },
    summary_requiredAscensionMats: function() {
      var ascTable = this.$store.state.ascensionTable;
      var result = {elementalMat_T1: 0, elementalMat_T2: 0, elementalMat_T3: 0, elementalMat_T4: 0, core: 0, speciality: 0, commonMat_Ascension_T1: 0, commonMat_Ascension_T2: 0, commonMat_Ascension_T3: 0, mora: 0}; 
      for(var i = Math.min(...this.requiredAscensions)-1; i < Math.max(...this.requiredAscensions); i++) {
        Object.keys(result).forEach(function(key) {
          result[key] += ascTable[i][key];
        });
      }
      return result; 
    }, 
    summary_requiredTalentMats: function() {
      var talTable = this.$store.state.talentTable; 
      var result = {book_T1: 0, book_T2: 0, book_T3: 0, commonMat_Talent_T1: 0, commonMat_Talent_T2: 0, commonMat_Talent_T3: 0, worldBossMat: 0, crown: 0, mora: 0}; 
      [this.requiredAtkTalents, this.requiredSkillTalents, this.requiredBurstTalents].forEach(req => {
        for(var i = Math.min(...req)-2; i < Math.max(...req)-1; i++) {
          Object.keys(result).forEach(function(key) {
            result[key] += talTable[i][key];
          });
        }
      });
      return result; 
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
      var data = this.characterData; 
      [this.summary_requiredAscensionMats, this.summary_requiredTalentMats].forEach(summary => {
        Object.keys(summary).forEach(function(key) {
          if(summary[key] > 0 && key != 'mora') result.push({name: data[key].name, icon: data[key].icon, amount: summary[key]}); 
        });
      }); 
      if(this.summary_requiredXP > 0) result.push({name: this.$store.state.xpMaterials.character.name, icon: this.$store.state.materialList.materials.experience.icon, amount: Math.ceil(this.summary_requiredXP / this.$store.state.xpMaterials.character.amount)}); 
      if(this.summary_requiredMora > 0) result.push({name: 'Mora', icon: this.$store.state.materialList.materials.mora.icon, amount: this.summary_requiredMora}); 
      if(!this.disabled) this.$store.commit('updateSummaryData', {id: this.id, data: result});
      else this.$store.commit('updateSummaryData', {id: this.id, data: []});
      return result; 
    },
    enableCharacter: function(enable) {
      this.disabled = enable; 
      if(this.disabled) this.$store.commit('updateSummaryData', {id: this.id, data: []});
      else this.getTableItems(); 
    }, 
    deleteCharacter: function() {
      this.$store.commit('updateSummaryData', {id: this.id, data: []});
      this.$emit('delete'); 
    }, 
    saveToLocalStorage: function() {
      var charData = {
        name: this.characterData.name, 
        level: this.level, 
        ascension: this.ascension, 
        atkLevel: this.atkLevel, 
        skillLevel: this.skillLevel, 
        burstLevel: this.burstLevel,
        disabled: this.disabled}; 
      localStorage[this.characterData.name] = JSON.stringify(charData); 
    }
  }, 
  mounted() {
    if(localStorage[this.characterData.name]) {
      var storageData = JSON.parse(localStorage[this.characterData.name]); 
      this.level = storageData.level; 
      this.ascension = storageData.ascension; 
      this.atkLevel = storageData.atkLevel; 
      this.skillLevel = storageData.skillLevel; 
      this.burstLevel = storageData.burstLevel; 
      this.disabled = storageData.disabled; 
    }
    else this.saveToLocalStorage(); 
  }, 
  watch: {
    level() { this.saveToLocalStorage(); }, 
    ascension() { this.saveToLocalStorage(); }, 
    atkLevel() { this.saveToLocalStorage(); }, 
    skillLevel() { this.saveToLocalStorage(); },
    burstLevel() { this.saveToLocalStorage(); },
    disabled() { this.saveToLocalStorage(); }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<template>
  <v-card class="mx-auto" max-width="500" outlined>
    <v-list-item three-line>
      <v-list-item-avatar tile size="80" color="grey"><img :src="characterData.picture"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">{{characterData.name}}</v-list-item-title>
        <v-list-item-subtitle>{{characterData.description}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-row>
      <v-col :cols="3">Level: </v-col>
      <v-col :cols="90">
        <vue-slider v-model="level" :label="labels.level" :max="90" :marks="[0, 20, 40, 50, 60, 70, 80, 90]" :included="true" :contained="true"/>
      </v-col>
    </v-row>
    <v-divider class="mx-4"></v-divider>
    <v-row>
      <v-col :cols="3">Ascension: </v-col>
      <v-col :cols="9">
        <vue-slider v-model="ascension" :label="labels.ascension" :max="6" :marks="true" :contained="true"/>
      </v-col>
    </v-row>

    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col order="first" align="center" cols="6" md="4">
          <v-card>
            <v-card-title>Attack</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-list-item-avatar tile size="80" color="grey"><img :src="characterData.iconAtk"></v-list-item-avatar>
            <vue-slider v-model="atkLevel" :min="1" :max="10" :contained="true" :marks="[2, 6, 9]"></vue-slider>
          </v-card>
        </v-col>
        <v-col align="center" cols="6" md="4">
          <v-card>
            <v-card-title>Skill</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-list-item-avatar tile size="80" color="grey"><img :src="characterData.iconSkill"></v-list-item-avatar>
            <vue-slider v-model="skillLevel" :min="1" :max="10" :contained="true" :marks="[2, 6, 9]"></vue-slider>
          </v-card>
        </v-col>
        <v-col order="last" align="center" cols="6" md="4">
          <v-card>
            <v-card-title>Burst</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-list-item-avatar tile size="80" color="grey"><img :src="characterData.iconBurst"></v-list-item-avatar>
            <vue-slider v-model="burstLevel" :min="1" :max="10" :contained="true" :marks="[2, 6, 9]"></vue-slider>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Required Materials</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table :headers="headers" :items="tableItems" :items-per-page="99" class="elevation-1"></v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

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
      var result = []; 
      var data = this.characterData; 
      [this.summary_requiredAscensionMats, this.summary_requiredTalentMats].forEach(summary => {
        Object.keys(summary).forEach(function(key) {
          if(summary[key] > 0 && key != 'mora') result.push({name: data[key].name, icon: "WiP", amount: summary[key]}); 
        });
      }); 
      if(this.summary_requiredXP > 0) result.push({name: this.$store.state.xpMaterials.character.name, icon: "WiP", amount: Math.ceil(this.summary_requiredXP / this.$store.state.xpMaterials.character.amount)}); 
      if(this.summary_requiredMora > 0) result.push({name: 'Mora', icon: "WiP", amount: Number(this.summary_requiredMora).toLocaleString('de')}); 
      this.$store.commit('updateSummaryData', {id: this.id, data: result});
      return result; 
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

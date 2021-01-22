<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-avatar tile size="80" color="grey"><img :src="characterData.picture"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">{{characterData.name}}</v-list-item-title>
        <v-list-item-subtitle>{{characterData.description}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <vue-slider v-model="level" :max="90" :marks="[0, 20, 40, 50, 60, 70, 80, 90]" :included="true" :contained="true" :drag-on-click="true"></vue-slider>
    <vue-slider v-model="ascension" :max="6" :marks="true" :contained="true" :drag-on-click="true"></vue-slider>

    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col order="last">
          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
          <vue-slider v-model="atkLevel" :min="1" :max="10" :contained="true" :drag-on-click="true"></vue-slider>
        </v-col>
        <v-col>
          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
          <vue-slider v-model="skillLevel" :min="1" :max="10" :contained="true" :drag-on-click="true"></vue-slider>
        </v-col>
        <v-col order="first">
          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
          <vue-slider v-model="burstLevel" :min="1" :max="10" :contained="true" :drag-on-click="true"></vue-slider>
        </v-col>
      </v-row>
    </v-container>
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
    burstLevel: [1, 10]
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
      var xpTable = this.$store.state.xpTable;
      var start = 0; 
      var end = 6; 
      if(this.requiredLevels[0]-1 == 20) start = 1;
      if(this.requiredLevels[0]-1 == 40) start = 2;
      if(this.requiredLevels[0]-1 == 50) start = 3;
      if(this.requiredLevels[0]-1 == 60) start = 4;
      if(this.requiredLevels[0]-1 == 70) start = 5; 
      if(this.requiredLevels[0]-1 == 80) start = 6;
      if(this.requiredLevels[0]-1 == 90) start = 7;
      if(this.requiredLevels[this.requiredLevels.length-1] == 20) end = 1;
      if(this.requiredLevels[this.requiredLevels.length-1] == 40) end = 2;
      if(this.requiredLevels[this.requiredLevels.length-1] == 50) end = 3;
      if(this.requiredLevels[this.requiredLevels.length-1] == 60) end = 4;
      if(this.requiredLevels[this.requiredLevels.length-1] == 70) end = 5; 
      if(this.requiredLevels[this.requiredLevels.length-1] == 80) end = 6;
      if(this.requiredLevels[this.requiredLevels.length-1] == 90) end = 7;
      var result = 0;
      for(var i = start;  i < end; i++) {
        result += xpTable[i].xp; 
      }
      return result; 
    }, 
    summary_requiredMora: function() {
      var xpTable = this.$store.state.xpTable;
      var start = 0; 
      var end = 6; 
      if(this.requiredLevels[0]-1 == 20) start = 1;
      if(this.requiredLevels[0]-1 == 40) start = 2;
      if(this.requiredLevels[0]-1 == 50) start = 3;
      if(this.requiredLevels[0]-1 == 60) start = 4;
      if(this.requiredLevels[0]-1 == 70) start = 5; 
      if(this.requiredLevels[0]-1 == 80) start = 6;
      if(this.requiredLevels[0]-1 == 90) start = 7;
      if(this.requiredLevels[this.requiredLevels.length-1] == 20) end = 1;
      if(this.requiredLevels[this.requiredLevels.length-1] == 40) end = 2;
      if(this.requiredLevels[this.requiredLevels.length-1] == 50) end = 3;
      if(this.requiredLevels[this.requiredLevels.length-1] == 60) end = 4;
      if(this.requiredLevels[this.requiredLevels.length-1] == 70) end = 5; 
      if(this.requiredLevels[this.requiredLevels.length-1] == 80) end = 6;
      if(this.requiredLevels[this.requiredLevels.length-1] == 90) end = 7;
      var result = 0; 
      for(var i = start;  i < end; i++) {
        result += xpTable[i].mora; 
      }
      result += this.summary_requiredAscensionMats.mora; 
      result += this.summary_requiredTalentMats.mora; 
      return result; 
    },
    summary_requiredAscensionMats: function() {
      var ascTable = this.$store.state.ascensionTable;
      var result = {elementalMat_T1: 0, elementalMat_T2: 0, elementalMat_T3: 0, elementalMat_T4: 0, core: 0, speciality: 0, commonMat_T1: 0, commonMat_T2: 0, commonMat_T3: 0, mora: 0}; 
      for(var i = Math.min(...this.requiredAscensions) - 1;  i < Math.max(...this.requiredAscensions); i++) {
        result.elementalMat_T1 += ascTable[i].elementalMat_T1;
        result.elementalMat_T2 += ascTable[i].elementalMat_T2;
        result.elementalMat_T3 += ascTable[i].elementalMat_T3;
        result.elementalMat_T4 += ascTable[i].elementalMat_T4;
        result.core += ascTable[i].core; 
        result.speciality += ascTable[i].speciality; 
        result.commonMat_T1 += ascTable[i].commonMat_T1; 
        result.commonMat_T2 += ascTable[i].commonMat_T2; 
        result.commonMat_T3 += ascTable[i].commonMat_T3; 
        result.mora += ascTable[i].mora; 
      }
      return result; 
    }, 
    summary_requiredTalentMats: function() {
      var talTable = this.$store.state.talentTable; 
      var result = {book_T1: 0, book_T2: 0, book_T3: 0, commonMat_T1: 0, commonMat_T2: 0, commonMat_T3: 0, worldBossMat: 0, crown: 0, mora: 0}; 
      for(var i = Math.min(...this.requiredAtkTalents)-2; i < Math.max(...this.requiredAtkTalents)-1; i++)
      {
        result.book_T1 += talTable[i].book_T1;
        result.book_T2 += talTable[i].book_T2;
        result.book_T3 += talTable[i].book_T3; 
        result.commonMat_T1 += talTable[i].commonMat_T1; 
        result.commonMat_T2 += talTable[i].commonMat_T2; 
        result.commonMat_T3 += talTable[i].commonMat_T3; 
        result.worldBossMat += talTable[i].worldBossMat; 
        result.crown += talTable[i].crown; 
        result.mora += talTable[i].mora; 
      }
      for(var j = Math.min(...this.requiredSkillTalents)-2; j < Math.max(...this.requiredSkillTalents)-1; j++)
      {
        result.book_T1 += talTable[j].book_T1;
        result.book_T2 += talTable[j].book_T2;
        result.book_T3 += talTable[j].book_T3; 
        result.commonMat_T1 += talTable[j].commonMat_T1; 
        result.commonMat_T2 += talTable[j].commonMat_T2; 
        result.commonMat_T3 += talTable[j].commonMat_T3; 
        result.worldBossMat += talTable[j].worldBossMat; 
        result.crown += talTable[j].crown; 
        result.mora += talTable[j].mora; 
      }
      for(var k = Math.min(...this.requiredSkillTalents)-2; k < Math.max(...this.requiredSkillTalents)-1; k++)
      {
        result.book_T1 += talTable[k].book_T1;
        result.book_T2 += talTable[k].book_T2;
        result.book_T3 += talTable[k].book_T3; 
        result.commonMat_T1 += talTable[k].commonMat_T1; 
        result.commonMat_T2 += talTable[k].commonMat_T2; 
        result.commonMat_T3 += talTable[k].commonMat_T3; 
        result.worldBossMat += talTable[k].worldBossMat; 
        result.crown += talTable[k].crown; 
        result.mora += talTable[k].mora; 
      }
      return result; 
    }
  }, 
  methods: {
    getRequired: function(array) {
      var min = Math.min(...array); 
      var max = Math.max(...array); 
      var list = [];
      for (var i = min; i < max; i++) {
        list.push(i+1);
      }
      return list;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

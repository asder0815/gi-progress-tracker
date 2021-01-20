<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-list-item three-line>
      <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">{{name}}</v-list-item-title>
        <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <vue-slider v-model="level" :max="90" :marks="levelMarks" :contained="true" :drag-on-click="true"></vue-slider>
    <vue-slider v-model="ascension" :max="6" :marks="true" :contained="true" :drag-on-click="true"></vue-slider>

    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col order="last">
          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
          <vue-slider v-model="atkLevel" :max="10" :contained="true" :drag-on-click="true"></vue-slider>
        </v-col>
        <v-col>
          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
          <vue-slider v-model="skillLevel" :max="10" :contained="true" :drag-on-click="true"></vue-slider>
        </v-col>
        <v-col order="first">
          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
          <vue-slider v-model="burstLevel" :max="10" :contained="true" :drag-on-click="true"></vue-slider>
        </v-col>
      </v-row>
    </v-container>
    <p>Required Levels: {{requiredLevels}}</p>
    <p>Required Ascensions: {{requiredAscensions}}</p>
    <p>Required Atk Talents: {{requiredAtkTalents}}</p>
    <p>Required Skill Talents: {{requiredSkillTalents}}</p>
    <p>Required Burst Talents: {{requiredBurstTalents}}</p>
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
    name: String
  },
  data: () => ({
    level: [0, 90], 
    ascension: [0, 6],
    atkLevel: [0, 10],
    skillLevel: [0, 10], 
    burstLevel: [0, 10], 
    levelMarks: [0, 20, 40, 50, 60, 70, 80, 90]
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
    }
  }, 
  methods: {
    getRequired: function(array) {
      var min = Math.min(...array); 
      var max = Math.max(...array); 
      var list = [];
      for (var i = min; i <= max; i++) {
        if(i < max) list.push(i+1);
      }
      return list;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

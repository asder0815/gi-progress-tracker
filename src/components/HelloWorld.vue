<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Required Materials</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table :headers="headers" :items="tableItems" :items-per-page="99" class="elevation-1"></v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row align="center" justify="space-around">
      <v-select v-model="characterName" :items="characterSelection"></v-select>
      <v-btn @click="addCharacter(characterName)">Add</v-btn>
    </v-row>
      <character.comp
        v-for="(character, index) in characters"
        :key="index"
        :is="character.comp"
        v-bind:characterData="character.characterData"
        v-bind:id="character.id"
        @delete="onCharacterDelete(character.id, character.characterData.name)">
      </character.comp>
  </v-container>
</template>

<script>
  import CharacterCard from './CharacterCard';

  export default {
    name: 'HelloWorld',
    components: {
      CharacterCard
    },
    data: () => ({
      characterName: "", 
      characters: [], 
      headers: [{text: "Material", align: "start", value: "name"}, {text: "Icon", sortable: "false", value: "icon"}, {text: "Amount", value: "amount"}]
    }),
    computed: {
      characterSelection: function() {
        var chars = this.$store.state.characters; 
        var result = []; 
        chars.forEach(char => {
          result.push(char.name); 
        });
        return result; 
      }, 
      tableItems: function() {
        var result = []; 
        var storeData = JSON.parse(JSON.stringify(this.$store.state.summaryData));
        storeData.forEach(summaryData => {
          summaryData.data.forEach(summary => {
            if(result.some(e => e.name === summary.name)) {
              result.find(data => { return data.name === summary.name }).amount += summary.amount;
            }
            else result.push(summary); 
          }); 
        }); 
        var mora = result.find(obj => { return obj.name === 'Mora'}); 
        if(mora) if(mora) mora = {name: 'Mora', icon: "WiP", amount: Number(mora.amount).toLocaleString('de')};
        return result;
      }
    },
    methods: {
      addCharacter: function(newCharName) {
        this.$store.commit('increaseCount'); 
        this.characters.push({
          id: this.$store.state.count,
          characterData: this.$store.state.characters.find(obj => { return obj.name === newCharName }),
          comp: CharacterCard
        }); 
      }, 
      onCharacterDelete: function(idToDelete, nameToDelete) {
        this.characters.splice(this.characters.findIndex(f => f.id === idToDelete), 1); 
        localStorage.removeItem(nameToDelete); 
      }
    }, 
    mounted() {
      this.characterSelection.forEach(character => {
        if(localStorage[character]) {
          this.addCharacter(character); 
        }
      });
    }
  }
</script>

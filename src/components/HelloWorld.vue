<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Required Materials</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-data-table :headers="headers" :items="tableItems" :items-per-page="99" class="elevation-1">

            <template v-slot:item.current="props">
              <v-edit-dialog :return-value.sync="props.item.current" large persistent>
                <div>{{ props.item.current }}</div>
                <template v-slot:input>
                  <div class="mt-4 title"> Update Amount </div>
                  <v-text-field v-model="currentItems[props.item.name]" label="Edit" single-line autofocus type="number"></v-text-field>
                </template>
              </v-edit-dialog>
            </template>

          </v-data-table>
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
      currentItems: {},
      headers: [
        {text: "Material", align: "start", value: "name"}, 
        {text: "Icon", sortable: "false", value: "icon"}, 
        {text: "Required:", value: "amount"}, 
        {text: "Current:", value: "current"}, 
        {text: "To Farm:", value: "farm"}]
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
        result.forEach(resultData => {
          if(this.currentItems[resultData.name]) resultData.current = this.currentItems[resultData.name];
          else resultData.current = 0; 
          if(resultData.amount - resultData.current >= 0) resultData.farm = resultData.amount - resultData.current;
          else resultData.farm = 0; 
        });
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
      },
      saveMaterialsToLocalStorage: function(materials) {
        localStorage.currentMaterials = JSON.stringify(materials); 
      }
    }, 
    watch: {
      currentItems: function() {
        this.saveMaterialsToLocalStorage(this.currentItems);
      }
    },
    mounted() {
      this.characterSelection.forEach(character => {
        if(localStorage[character]) {
          this.addCharacter(character); 
        }
      });
      if(localStorage.currentMaterials) this.currentItems = JSON.parse(localStorage.currentMaterials); 
    }
  }
</script>

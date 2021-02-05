<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Required Materials</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-switch v-model="filterEnabled" inset :label='"Hide completed"'></v-switch>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-data-table :headers="headers" :items="tableItems" :search="customFilter" :custom-filter="filterCompleted" :disable-pagination="true" :hide-default-footer="true" class="elevation-1">
            <template v-slot:item.icon="cell">
              <v-img :src="cell.item.icon" :max-width="50" :max-height="50"></v-img>
            </template>
            <template v-slot:item.current="cell">
              <v-edit-dialog :return-value.sync="cell.item.current" large :key="hackCounter" @open="materialDialogOpen(currentItems[cell.item.name] ? currentItems[cell.item.name] : 0)" @save="materialDialogSave(cell.item.name)">
                <div>{{ cell.item.current }}</div>
                <template v-slot:input>
                  <div class="mt-4 title"> {{ cell.item.name }} </div>
                  <v-text-field v-model="dialogSelection" label="Edit" single-line autofocus type="number"></v-text-field>
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
    <v-layout align-center justify-center row wrap>
      <character.comp
        v-for="(character, index) in characters"
        :key="index"
        :is="character.comp"
        v-bind:characterData="character.characterData"
        v-bind:id="character.id"
        @delete="onCharacterDelete(character.id, character.characterData.name)">
      </character.comp>
    </v-layout>
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
        {text: "To Farm:", value: "farm"}], 
        dialogSelection: 0, 
        search: "",
        filterEnabled: false,
        hackCounter: 0
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
        this.hackCounter; 
        console.log("Amount of unnecessary counts required to hack around computed properties not updating correctly: " + this.hackCounter); 
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
          else {
            this.currentItems[resultData.name] = 0; 
            resultData.current = this.currentItems[resultData.name];
          }
          if(resultData.amount - resultData.current >= 0) resultData.farm = resultData.amount - resultData.current;
          else resultData.farm = 0; 
        });
        return result;
      }, 
      customFilter: function() { 
        return JSON.stringify({hide: this.filterEnabled, search: this.search}); 

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
      }, 
      materialDialogOpen(currentAmount) {
        this.dialogSelection = currentAmount; 
      }, 
      materialDialogSave(materialName) {
        this.currentItems[materialName] = this.dialogSelection, 10; 
        this.saveMaterialsToLocalStorage(this.currentItems); 
        this.recompute(); 
      }, 
      filterCompleted(value, search, item) {
        if(value == null) return false; 
        var cf = JSON.parse(search);
        if(cf.search == "" || item.name.toLowerCase().includes(cf.search)) {
          if(!cf.hide) return true; 
          else return item.farm > 0; 
        }
        else return false; 
      },
      recompute() {
        this.hackCounter++; 
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

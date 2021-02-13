<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Required Materials</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-switch 
              v-model="filterEnabled" 
              inset :label='"Hide completed"'>
            </v-switch>
            <v-spacer/>
            <v-select
              v-model="filterTypes"
              :items="types"
              label="Filter"
              persistent-hint
            ></v-select>
            <v-spacer/>
            <v-text-field 
              v-model="search" 
              append-icon="mdi-magnify" 
              label="Search" 
              single-line 
              hide-details>
            </v-text-field>
          </v-row>
          <v-data-table 
            :headers="headers" 
            :items="tableItems" 
            :search="customFilter" 
            :custom-filter="filterCompleted" 
            :custom-sort="customSort"
            :disable-pagination="true" 
            :hide-default-footer="true" 
            :item-class="tableBackground"
            class="elevation-1">
            <template v-slot:item.icon="cell">
              <v-img :src="cell.item.icon" :max-width="50" :max-height="50"></v-img>
            </template>
            <template v-slot:item.current="cell">
              <v-edit-dialog :return-value.sync="cell.item.current" 
                large 
                :key="hackCounter" 
                @open="materialDialogOpen(currentItems[cell.item.name] ? currentItems[cell.item.name] : 0)" 
                @save="materialDialogSave(cell.item.name)">
                <div>{{ cell.item.current }}</div>
                <template v-slot:input>
                  <div class="mt-4 title"> {{ cell.item.name }} </div>
                  <v-text-field 
                    v-model="dialogSelection" 
                    label="Edit" 
                    single-line 
                    autofocus 
                    type="number">
                  </v-text-field>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row align="center" justify="space-around" class="mt-5">
      <v-select 
        v-model="characterName" 
        :items="characterSelection" 
        label="Add new project" 
        class="mr-3">
      </v-select>
      <v-btn 
        @click="addCharacter(characterName)" 
        :disabled="this.characterName==''">
        Add
      </v-btn>
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
        filterTypes: "All",
        types: [
          "All", 
          "Resin", 
          "Weekly",
          "No Resin"
        ],
        hackCounter: 0
    }),
    computed: {
      characterSelection: function() {
        var chars = this.$store.state.characters; 
        var result = []; 
        chars.forEach(char => {
          if(this.characters.find(obj => { return obj.characterData.name ==  char.name}) == undefined) result.push(char.name); 
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
      }, 
      targetType: function() {
        if(this.filterTypes == "All") return ["all"]; 
        if(this.filterTypes == "No Resin") return ["world"]; 
        if(this.filterTypes == "Weekly") return ["weekly"]; 
        else return ["domain", "boss"]; 
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
        this.characterName = ""; 
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
          if(!cf.hide) return this.filterType(item); 
          else return item.farm > 0 && this.filterType(item); 
        }
        else return false; 
      },
      filterType(item) {
        var mats = this.$store.state.materialList.materials;
        var type = Object.keys(mats).filter(matName => this.targetType.includes(mats[matName].type) && mats[matName].name == item.name);
        return this.targetType == "all" || type.length > 0;   
      },
      recompute() {
        this.hackCounter++; 
      }, 
      getNormalizedProgress(item) {
        if(item.current / item.amount >= 1) return 1; 
        else return item.current / item.amount; 
      },
      tableBackground(item) {
        return 'styleProgress-' + Math.round((this.getNormalizedProgress(item) * 100)); 
      }, 
      customSort(items, index, isDesc) { 
        if(index.length == 1 && isDesc.length == 1) {
          if(index[0] == "name") return isDesc[0] ? items.sort(this.sortNameDesc) : items.sort(this.sortNameAsc); 
          if(index[0] == "icon") return isDesc[0] ? items.sort(this.sortNameDesc) : items.sort(this.sortNameAsc); 
          if(index[0] == "amount") return isDesc[0] ? items.sort(this.sortReqDesc) : items.sort(this.sortReqAsc); 
          if(index[0] == "current") return isDesc[0] ? items.sort(this.sortHaveDesc) : items.sort(this.sortHaveAsc);
          if(index[0] == "farm") return isDesc[0] ? items.sort(this.sortFarmDesc) : items.sort(this.sortFarmAsc);  
        }
        else return items.sort(this.sortFarmAsc); 
      }, 
      sortFarmDesc: function(a, b) {
        var prog_a = this.getNormalizedProgress({current: parseInt(a.current, 10), amount: a.amount});
        var prog_b = this.getNormalizedProgress({current: parseInt(b.current, 10), amount: b.amount}); 
        return prog_b - prog_a; 
      }, 
      sortFarmAsc: function(a, b) {
        var prog_a = this.getNormalizedProgress({current: parseInt(a.current, 10), amount: a.amount});
        var prog_b = this.getNormalizedProgress({current: parseInt(b.current, 10), amount: b.amount}); 
        return prog_a - prog_b; 
      }, 
      sortNameDesc: function(a, b) {
        return a.name.localeCompare(b.name) * -1; 
      }, 
      sortNameAsc: function(a, b) {
        return a.name.localeCompare(b.name); 
      }, 
      sortReqDesc: function(a, b) {
        return b.amount - a.amount; 
      }, 
      sortReqAsc: function(a, b) {
        return a.amount - b.amount; 
      }, 
      sortHaveDesc: function(a, b) {
        return b.current - a.current; 
      }, 
      sortHaveAsc: function(a, b) {
        return a.current - b.current; 
      }
    }, 
    watch: {
      currentItems: function() {
        this.saveMaterialsToLocalStorage(this.currentItems);
      }
    },
    mounted() {
      if(localStorage.currentMaterials) this.currentItems = JSON.parse(localStorage.currentMaterials); 
      var charList = []; 
      this.characterSelection.forEach(character => {
        if(localStorage[character]) {
          charList.push(character); 
        }
      });
      charList.sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0)).forEach(character => {
        this.addCharacter(character); 
      }); 
    }
  }
</script>

<style>
  .styleProgress-0 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 0%, #1e1e1e 0%) }
  .styleProgress-1 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 1%, #1e1e1e 1%) }
  .styleProgress-2 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 2%, #1e1e1e 2%) }
  .styleProgress-3 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 3%, #1e1e1e 3%) }
  .styleProgress-4 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 4%, #1e1e1e 4%) }
  .styleProgress-5 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 5%, #1e1e1e 5%) }
  .styleProgress-6 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 6%, #1e1e1e 6%) }
  .styleProgress-7 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 7%, #1e1e1e 7%) }
  .styleProgress-8 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 8%, #1e1e1e 8%) }
  .styleProgress-9 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 9%, #1e1e1e 9%) }
  .styleProgress-10 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 10%, #1e1e1e 10%) }
  .styleProgress-11 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 11%, #1e1e1e 11%) }
  .styleProgress-12 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 12%, #1e1e1e 12%) }
  .styleProgress-13 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 13%, #1e1e1e 13%) }
  .styleProgress-14 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 14%, #1e1e1e 14%) }
  .styleProgress-15 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 15%, #1e1e1e 15%) }
  .styleProgress-16 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 16%, #1e1e1e 16%) }
  .styleProgress-17 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 17%, #1e1e1e 17%) }
  .styleProgress-18 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 18%, #1e1e1e 18%) }
  .styleProgress-19 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 19%, #1e1e1e 19%) }
  .styleProgress-20 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 20%, #1e1e1e 20%) }
  .styleProgress-21 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 21%, #1e1e1e 21%) }
  .styleProgress-22 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 22%, #1e1e1e 22%) }
  .styleProgress-23 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 23%, #1e1e1e 23%) }
  .styleProgress-24 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 24%, #1e1e1e 24%) }
  .styleProgress-25 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 25%, #1e1e1e 25%) }
  .styleProgress-26 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 26%, #1e1e1e 26%) }
  .styleProgress-27 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 27%, #1e1e1e 27%) }
  .styleProgress-28 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 28%, #1e1e1e 28%) }
  .styleProgress-29 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 29%, #1e1e1e 29%) }
  .styleProgress-30 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 30%, #1e1e1e 30%) }
  .styleProgress-31 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 31%, #1e1e1e 31%) }
  .styleProgress-32 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 32%, #1e1e1e 32%) }
  .styleProgress-33 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 33%, #1e1e1e 33%) }
  .styleProgress-34 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 34%, #1e1e1e 34%) }
  .styleProgress-35 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 35%, #1e1e1e 35%) }
  .styleProgress-36 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 36%, #1e1e1e 36%) }
  .styleProgress-37 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 37%, #1e1e1e 37%) }
  .styleProgress-38 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 38%, #1e1e1e 38%) }
  .styleProgress-39 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 39%, #1e1e1e 39%) }
  .styleProgress-40 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 40%, #1e1e1e 40%) }
  .styleProgress-41 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 41%, #1e1e1e 41%) }
  .styleProgress-42 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 42%, #1e1e1e 42%) }
  .styleProgress-43 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 43%, #1e1e1e 43%) }
  .styleProgress-44 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 44%, #1e1e1e 44%) }
  .styleProgress-45 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 45%, #1e1e1e 45%) }
  .styleProgress-46 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 46%, #1e1e1e 46%) }
  .styleProgress-47 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 47%, #1e1e1e 47%) }
  .styleProgress-48 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 48%, #1e1e1e 48%) }
  .styleProgress-49 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 49%, #1e1e1e 49%) }
  .styleProgress-50 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 50%, #1e1e1e 50%) }
  .styleProgress-51 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 51%, #1e1e1e 51%) }
  .styleProgress-52 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 52%, #1e1e1e 52%) }
  .styleProgress-53 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 53%, #1e1e1e 53%) }
  .styleProgress-54 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 54%, #1e1e1e 54%) }
  .styleProgress-55 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 55%, #1e1e1e 55%) }
  .styleProgress-56 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 56%, #1e1e1e 56%) }
  .styleProgress-57 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 57%, #1e1e1e 57%) }
  .styleProgress-58 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 58%, #1e1e1e 58%) }
  .styleProgress-59 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 59%, #1e1e1e 59%) }
  .styleProgress-60 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 60%, #1e1e1e 60%) }
  .styleProgress-61 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 61%, #1e1e1e 61%) }
  .styleProgress-62 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 62%, #1e1e1e 62%) }
  .styleProgress-63 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 63%, #1e1e1e 63%) }
  .styleProgress-64 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 64%, #1e1e1e 64%) }
  .styleProgress-65 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 65%, #1e1e1e 65%) }
  .styleProgress-66 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 66%, #1e1e1e 66%) }
  .styleProgress-67 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 67%, #1e1e1e 67%) }
  .styleProgress-68 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 68%, #1e1e1e 68%) }
  .styleProgress-69 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 69%, #1e1e1e 69%) }
  .styleProgress-70 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 70%, #1e1e1e 70%) }
  .styleProgress-71 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 71%, #1e1e1e 71%) }
  .styleProgress-72 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 72%, #1e1e1e 72%) }
  .styleProgress-73 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 73%, #1e1e1e 73%) }
  .styleProgress-74 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 74%, #1e1e1e 74%) }
  .styleProgress-75 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 75%, #1e1e1e 75%) }
  .styleProgress-76 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 76%, #1e1e1e 76%) }
  .styleProgress-77 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 77%, #1e1e1e 77%) }
  .styleProgress-78 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 78%, #1e1e1e 78%) }
  .styleProgress-79 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 79%, #1e1e1e 79%) }
  .styleProgress-80 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 80%, #1e1e1e 80%) }
  .styleProgress-81 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 81%, #1e1e1e 81%) }
  .styleProgress-82 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 82%, #1e1e1e 82%) }
  .styleProgress-83 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 83%, #1e1e1e 83%) }
  .styleProgress-84 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 84%, #1e1e1e 84%) }
  .styleProgress-85 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 85%, #1e1e1e 85%) }
  .styleProgress-86 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 86%, #1e1e1e 86%) }
  .styleProgress-87 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 87%, #1e1e1e 87%) }
  .styleProgress-88 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 88%, #1e1e1e 88%) }
  .styleProgress-89 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 89%, #1e1e1e 89%) }
  .styleProgress-90 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 90%, #1e1e1e 90%) }
  .styleProgress-91 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 91%, #1e1e1e 91%) }
  .styleProgress-92 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 92%, #1e1e1e 92%) }
  .styleProgress-93 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 93%, #1e1e1e 93%) }
  .styleProgress-94 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 94%, #1e1e1e 94%) }
  .styleProgress-95 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 95%, #1e1e1e 95%) }
  .styleProgress-96 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 96%, #1e1e1e 96%) }
  .styleProgress-97 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 97%, #1e1e1e 97%) }
  .styleProgress-98 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 98%, #1e1e1e 98%) }
  .styleProgress-99 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 99%, #1e1e1e 99%) }
  .styleProgress-100 { background: linear-gradient(90deg, rgb(90,181,94,0.6), rgb(90,181,94,0.6) 100%, #1e1e1e 100%) }
</style>

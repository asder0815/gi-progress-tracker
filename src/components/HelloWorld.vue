<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Required Materials</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-switch 
            v-model="filterEnabled" 
            inset :label='"Hide completed"'>
          </v-switch>
          <v-text-field 
            v-model="search" 
            append-icon="mdi-magnify" 
            label="Search" 
            single-line 
            hide-details>
          </v-text-field>
          <v-data-table 
            :headers="headers" 
            :items="tableItems" 
            :search="customFilter" 
            :custom-filter="filterCompleted" 
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
          if(!cf.hide) return true; 
          else return item.farm > 0; 
        }
        else return false; 
      },
      recompute() {
        this.hackCounter++; 
      }, 
      getNormalizedProgress(item) {
        if(item.current / item.amount >= 1) return 1; 
        else return item.current / item.amount; 
      },
      tableBackground(item) {
        console.log(item.name +" Req: " + item.amount + "; Current: " + item.current + " => " +  this.getNormalizedProgress(item) * 100); 
        return 'styleProgress-' + Math.round((this.getNormalizedProgress(item) * 100)); 
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

<style>
.styleProgress-0 { background: linear-gradient(90deg, #5AB55E, #5AB55E 0%, #1E1E1E 0%) }
.styleProgress-1 { background: linear-gradient(90deg, #5AB55E, #5AB55E 1%, #1E1E1E 1%) }
.styleProgress-2 { background: linear-gradient(90deg, #5AB55E, #5AB55E 2%, #1E1E1E 2%) }
.styleProgress-3 { background: linear-gradient(90deg, #5AB55E, #5AB55E 3%, #1E1E1E 3%) }
.styleProgress-4 { background: linear-gradient(90deg, #5AB55E, #5AB55E 4%, #1E1E1E 4%) }
.styleProgress-5 { background: linear-gradient(90deg, #5AB55E, #5AB55E 5%, #1E1E1E 5%) }
.styleProgress-6 { background: linear-gradient(90deg, #5AB55E, #5AB55E 6%, #1E1E1E 6%) }
.styleProgress-7 { background: linear-gradient(90deg, #5AB55E, #5AB55E 7%, #1E1E1E 7%) }
.styleProgress-8 { background: linear-gradient(90deg, #5AB55E, #5AB55E 8%, #1E1E1E 8%) }
.styleProgress-9 { background: linear-gradient(90deg, #5AB55E, #5AB55E 9%, #1E1E1E 9%) }
.styleProgress-10 { background: linear-gradient(90deg, #5AB55E, #5AB55E 10%, #1E1E1E 10%) }
.styleProgress-11 { background: linear-gradient(90deg, #5AB55E, #5AB55E 11%, #1E1E1E 11%) }
.styleProgress-12 { background: linear-gradient(90deg, #5AB55E, #5AB55E 12%, #1E1E1E 12%) }
.styleProgress-13 { background: linear-gradient(90deg, #5AB55E, #5AB55E 13%, #1E1E1E 13%) }
.styleProgress-14 { background: linear-gradient(90deg, #5AB55E, #5AB55E 14%, #1E1E1E 14%) }
.styleProgress-15 { background: linear-gradient(90deg, #5AB55E, #5AB55E 15%, #1E1E1E 15%) }
.styleProgress-16 { background: linear-gradient(90deg, #5AB55E, #5AB55E 16%, #1E1E1E 16%) }
.styleProgress-17 { background: linear-gradient(90deg, #5AB55E, #5AB55E 17%, #1E1E1E 17%) }
.styleProgress-18 { background: linear-gradient(90deg, #5AB55E, #5AB55E 18%, #1E1E1E 18%) }
.styleProgress-19 { background: linear-gradient(90deg, #5AB55E, #5AB55E 19%, #1E1E1E 19%) }
.styleProgress-20 { background: linear-gradient(90deg, #5AB55E, #5AB55E 20%, #1E1E1E 20%) }
.styleProgress-21 { background: linear-gradient(90deg, #5AB55E, #5AB55E 21%, #1E1E1E 21%) }
.styleProgress-22 { background: linear-gradient(90deg, #5AB55E, #5AB55E 22%, #1E1E1E 22%) }
.styleProgress-23 { background: linear-gradient(90deg, #5AB55E, #5AB55E 23%, #1E1E1E 23%) }
.styleProgress-24 { background: linear-gradient(90deg, #5AB55E, #5AB55E 24%, #1E1E1E 24%) }
.styleProgress-25 { background: linear-gradient(90deg, #5AB55E, #5AB55E 25%, #1E1E1E 25%) }
.styleProgress-26 { background: linear-gradient(90deg, #5AB55E, #5AB55E 26%, #1E1E1E 26%) }
.styleProgress-27 { background: linear-gradient(90deg, #5AB55E, #5AB55E 27%, #1E1E1E 27%) }
.styleProgress-28 { background: linear-gradient(90deg, #5AB55E, #5AB55E 28%, #1E1E1E 28%) }
.styleProgress-29 { background: linear-gradient(90deg, #5AB55E, #5AB55E 29%, #1E1E1E 29%) }
.styleProgress-30 { background: linear-gradient(90deg, #5AB55E, #5AB55E 30%, #1E1E1E 30%) }
.styleProgress-31 { background: linear-gradient(90deg, #5AB55E, #5AB55E 31%, #1E1E1E 31%) }
.styleProgress-32 { background: linear-gradient(90deg, #5AB55E, #5AB55E 32%, #1E1E1E 32%) }
.styleProgress-33 { background: linear-gradient(90deg, #5AB55E, #5AB55E 33%, #1E1E1E 33%) }
.styleProgress-34 { background: linear-gradient(90deg, #5AB55E, #5AB55E 34%, #1E1E1E 34%) }
.styleProgress-35 { background: linear-gradient(90deg, #5AB55E, #5AB55E 35%, #1E1E1E 35%) }
.styleProgress-36 { background: linear-gradient(90deg, #5AB55E, #5AB55E 36%, #1E1E1E 36%) }
.styleProgress-37 { background: linear-gradient(90deg, #5AB55E, #5AB55E 37%, #1E1E1E 37%) }
.styleProgress-38 { background: linear-gradient(90deg, #5AB55E, #5AB55E 38%, #1E1E1E 38%) }
.styleProgress-39 { background: linear-gradient(90deg, #5AB55E, #5AB55E 39%, #1E1E1E 39%) }
.styleProgress-40 { background: linear-gradient(90deg, #5AB55E, #5AB55E 40%, #1E1E1E 40%) }
.styleProgress-41 { background: linear-gradient(90deg, #5AB55E, #5AB55E 41%, #1E1E1E 41%) }
.styleProgress-42 { background: linear-gradient(90deg, #5AB55E, #5AB55E 42%, #1E1E1E 42%) }
.styleProgress-43 { background: linear-gradient(90deg, #5AB55E, #5AB55E 43%, #1E1E1E 43%) }
.styleProgress-44 { background: linear-gradient(90deg, #5AB55E, #5AB55E 44%, #1E1E1E 44%) }
.styleProgress-45 { background: linear-gradient(90deg, #5AB55E, #5AB55E 45%, #1E1E1E 45%) }
.styleProgress-46 { background: linear-gradient(90deg, #5AB55E, #5AB55E 46%, #1E1E1E 46%) }
.styleProgress-47 { background: linear-gradient(90deg, #5AB55E, #5AB55E 47%, #1E1E1E 47%) }
.styleProgress-48 { background: linear-gradient(90deg, #5AB55E, #5AB55E 48%, #1E1E1E 48%) }
.styleProgress-49 { background: linear-gradient(90deg, #5AB55E, #5AB55E 49%, #1E1E1E 49%) }
.styleProgress-50 { background: linear-gradient(90deg, #5AB55E, #5AB55E 50%, #1E1E1E 50%) }
.styleProgress-51 { background: linear-gradient(90deg, #5AB55E, #5AB55E 51%, #1E1E1E 51%) }
.styleProgress-52 { background: linear-gradient(90deg, #5AB55E, #5AB55E 52%, #1E1E1E 52%) }
.styleProgress-53 { background: linear-gradient(90deg, #5AB55E, #5AB55E 53%, #1E1E1E 53%) }
.styleProgress-54 { background: linear-gradient(90deg, #5AB55E, #5AB55E 54%, #1E1E1E 54%) }
.styleProgress-55 { background: linear-gradient(90deg, #5AB55E, #5AB55E 55%, #1E1E1E 55%) }
.styleProgress-56 { background: linear-gradient(90deg, #5AB55E, #5AB55E 56%, #1E1E1E 56%) }
.styleProgress-57 { background: linear-gradient(90deg, #5AB55E, #5AB55E 57%, #1E1E1E 57%) }
.styleProgress-58 { background: linear-gradient(90deg, #5AB55E, #5AB55E 58%, #1E1E1E 58%) }
.styleProgress-59 { background: linear-gradient(90deg, #5AB55E, #5AB55E 59%, #1E1E1E 59%) }
.styleProgress-60 { background: linear-gradient(90deg, #5AB55E, #5AB55E 60%, #1E1E1E 60%) }
.styleProgress-61 { background: linear-gradient(90deg, #5AB55E, #5AB55E 61%, #1E1E1E 61%) }
.styleProgress-62 { background: linear-gradient(90deg, #5AB55E, #5AB55E 62%, #1E1E1E 62%) }
.styleProgress-63 { background: linear-gradient(90deg, #5AB55E, #5AB55E 63%, #1E1E1E 63%) }
.styleProgress-64 { background: linear-gradient(90deg, #5AB55E, #5AB55E 64%, #1E1E1E 64%) }
.styleProgress-65 { background: linear-gradient(90deg, #5AB55E, #5AB55E 65%, #1E1E1E 65%) }
.styleProgress-66 { background: linear-gradient(90deg, #5AB55E, #5AB55E 66%, #1E1E1E 66%) }
.styleProgress-67 { background: linear-gradient(90deg, #5AB55E, #5AB55E 67%, #1E1E1E 67%) }
.styleProgress-68 { background: linear-gradient(90deg, #5AB55E, #5AB55E 68%, #1E1E1E 68%) }
.styleProgress-69 { background: linear-gradient(90deg, #5AB55E, #5AB55E 69%, #1E1E1E 69%) }
.styleProgress-70 { background: linear-gradient(90deg, #5AB55E, #5AB55E 70%, #1E1E1E 70%) }
.styleProgress-71 { background: linear-gradient(90deg, #5AB55E, #5AB55E 71%, #1E1E1E 71%) }
.styleProgress-72 { background: linear-gradient(90deg, #5AB55E, #5AB55E 72%, #1E1E1E 72%) }
.styleProgress-73 { background: linear-gradient(90deg, #5AB55E, #5AB55E 73%, #1E1E1E 73%) }
.styleProgress-74 { background: linear-gradient(90deg, #5AB55E, #5AB55E 74%, #1E1E1E 74%) }
.styleProgress-75 { background: linear-gradient(90deg, #5AB55E, #5AB55E 75%, #1E1E1E 75%) }
.styleProgress-76 { background: linear-gradient(90deg, #5AB55E, #5AB55E 76%, #1E1E1E 76%) }
.styleProgress-77 { background: linear-gradient(90deg, #5AB55E, #5AB55E 77%, #1E1E1E 77%) }
.styleProgress-78 { background: linear-gradient(90deg, #5AB55E, #5AB55E 78%, #1E1E1E 78%) }
.styleProgress-79 { background: linear-gradient(90deg, #5AB55E, #5AB55E 79%, #1E1E1E 79%) }
.styleProgress-80 { background: linear-gradient(90deg, #5AB55E, #5AB55E 80%, #1E1E1E 80%) }
.styleProgress-81 { background: linear-gradient(90deg, #5AB55E, #5AB55E 81%, #1E1E1E 81%) }
.styleProgress-82 { background: linear-gradient(90deg, #5AB55E, #5AB55E 82%, #1E1E1E 82%) }
.styleProgress-83 { background: linear-gradient(90deg, #5AB55E, #5AB55E 83%, #1E1E1E 83%) }
.styleProgress-84 { background: linear-gradient(90deg, #5AB55E, #5AB55E 84%, #1E1E1E 84%) }
.styleProgress-85 { background: linear-gradient(90deg, #5AB55E, #5AB55E 85%, #1E1E1E 85%) }
.styleProgress-86 { background: linear-gradient(90deg, #5AB55E, #5AB55E 86%, #1E1E1E 86%) }
.styleProgress-87 { background: linear-gradient(90deg, #5AB55E, #5AB55E 87%, #1E1E1E 87%) }
.styleProgress-88 { background: linear-gradient(90deg, #5AB55E, #5AB55E 88%, #1E1E1E 88%) }
.styleProgress-89 { background: linear-gradient(90deg, #5AB55E, #5AB55E 89%, #1E1E1E 89%) }
.styleProgress-90 { background: linear-gradient(90deg, #5AB55E, #5AB55E 90%, #1E1E1E 90%) }
.styleProgress-91 { background: linear-gradient(90deg, #5AB55E, #5AB55E 91%, #1E1E1E 91%) }
.styleProgress-92 { background: linear-gradient(90deg, #5AB55E, #5AB55E 92%, #1E1E1E 92%) }
.styleProgress-93 { background: linear-gradient(90deg, #5AB55E, #5AB55E 93%, #1E1E1E 93%) }
.styleProgress-94 { background: linear-gradient(90deg, #5AB55E, #5AB55E 94%, #1E1E1E 94%) }
.styleProgress-95 { background: linear-gradient(90deg, #5AB55E, #5AB55E 95%, #1E1E1E 95%) }
.styleProgress-96 { background: linear-gradient(90deg, #5AB55E, #5AB55E 96%, #1E1E1E 96%) }
.styleProgress-97 { background: linear-gradient(90deg, #5AB55E, #5AB55E 97%, #1E1E1E 97%) }
.styleProgress-98 { background: linear-gradient(90deg, #5AB55E, #5AB55E 98%, #1E1E1E 98%) }
.styleProgress-99 { background: linear-gradient(90deg, #5AB55E, #5AB55E 99%, #1E1E1E 99%) }
.styleProgress-100 { background: linear-gradient(90deg, #5AB55E, #5AB55E 100%, #1E1E1E 100%) }
</style>

<template>
  <v-container>
    <v-select v-model="characterName" :items="characterList"></v-select>
    <v-btn @click="addCharacter(characterName)">Add</v-btn>
      <character.comp
        v-for="(character, index) in characters"
        :key="index"
        :is="character.comp"
        v-bind:characterData="character.characterData"
        v-bind:id="character.id">
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
      characters: []
    }),
    computed: {
      characterList: function() {
        var chars = this.$store.state.characters; 
        var result = []; 
        chars.forEach(char => {
          result.push(char.name); 
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
      }
    }
  }
</script>

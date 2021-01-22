<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Projects
        </h1>
        <p class="subheading font-weight-regular">
          Formerly Chuck's
          <br>Please go back to your
          <a
            href="https://community.vuetifyjs.com"
            target="_blank"
          >Discord Community.</a>
        </p>
      </v-col>
    </v-row>
    <v-select v-model="characterName" :items="characterList"></v-select>
    <v-btn @click="addCharacter(characterName)">Add</v-btn>
      <character.comp
        v-for="(character, index) in characters"
        :key="index"
        :is="character.comp"
        v-bind:characterData="character.characterData">
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

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
    <v-text-field label="Add Project:" outlined v-model="characterName"></v-text-field>
    <v-btn @click="addCharacter(characterName)">Add</v-btn>
      <character.comp
        v-for="(character, index) in characters"
        :key="index"
        :is="character.comp"
        v-bind:name="character.name">
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
    methods: {
      addCharacter: function(newCharName) {
        this.characters.push({
          id: 69, 
          name: newCharName, 
          comp: CharacterCard
        }); 
      }
    }
  }
</script>

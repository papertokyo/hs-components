<template>
  <div class="">
    <a
      v-for="char in alphabet"
      :key="char"
      href="#"
      style="padding:8px"
      @click.prevent="setAlphaChar(char)"
      >{{ char }}</a
    >
    <h1>{{ alphaChar }}</h1>
    <strong>{{ items.length }} items</strong>
    <div v-for="item in items" :key="item.id">
      <h3 :title="item.otherNames">{{ item.commonName }}</h3>
    </div>
  </div>
</template>

<script>
import cfClient from '../cfClient'
import { get } from 'lodash'

export default {
  data: () => ({
    alphaChar: 'a',
    items: []
  }),
  created() {
    // Set alphabet
    this.alphabet = 'abcdefghijklmnopqrstuvwxyz'

    this.getIngredients(this.alphaChar)
  },
  methods: {
    setAlphaChar(char) {
      this.alphaChar = char
      this.getIngredients(char)
    },
    async getIngredients(alphaChar) {
      // Ingredient index

      // Data is determined by alphabet character

      // Taking the passed character, we're looking for ingredients which have that
      // character in the alphaChar field
      try {
        const entries = await cfClient.getEntries({
          content_type: 'ingredient',
          limit: 200,
          select: 'sys.id,fields.commonName,fields.slug,fields.otherNames',
          'fields.alphaChar[in]': alphaChar
        })

        this.items = get(entries, 'items', []).map(item => ({
          id: get(item, 'sys.id'),
          commonName: get(item, 'fields.commonName'),
          otherNames: get(item, 'fields.otherNames', []).join(', ')
        }))
      } catch (err) {
        console.log(err.response.data)
      }
    }
  }
}
</script>

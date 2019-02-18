<template>
  <div id="app">
    <div>
      <button @click="componentName = 'IngredientIndex'">
        IngredientIndex
      </button>
      <button @click="componentName = 'SeasonalCalendar'">
        SeasonalCalendar
      </button>
    </div>
    <IngredientIndex v-if="componentName === 'IngredientIndex'" />
    <SeasonalCalendar v-if="componentName === 'SeasonalCalendar'" />
  </div>
</template>

<script>
import IngredientIndex from './components/IngredientIndex'
import SeasonalCalendar from './components/SeasonalCalendar'

export default {
  name: 'App',
  components: {
    IngredientIndex,
    SeasonalCalendar
  },
  data: () => ({
    componentName: null
  }),
  created() {
    this.componentName = 'SeasonalCalendar'
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div class="">
    <a
      v-for="(month, index) in months.short"
      :key="month.short"
      href="#"
      style="padding:8px"
      @click.prevent="setMonth(index)"
      >{{ month }}</a
    >
    <h1>{{ monthName }}</h1>
  </div>
</template>

<script>
import cfClient from '../cfClient'
import { get } from 'lodash'

import {
  startOfMonth,
  endOfMonth,
  getMonth,
  getYear,
  differenceInDays
} from 'date-fns'

export default {
  name: 'HelloWorld',
  data: () => ({
    monthNumber: 0,
    monthName: '',
    itemsCount: 0,
    items: []
  }),
  created() {
    // Set month data
    const months = {
      long: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
    months.short = months.long.map(month => month.substring(0, 3))
    this.months = months

    this.setMonth()
  },
  mounted() {
    this.getAvailability(this.monthNumber)

    console.log(
      this.months.short.map((name, index) => {
        const month = this.getMonthObject(index)
        return `${name} ${month.startDay}-${month.endDay}`
      })
    )
  },
  methods: {
    setMonth(number) {
      // Use passed month number, fallback to current month
      const monthNumber = Number.isInteger(number)
        ? number
        : getMonth(new Date())
      // Set month number on instance
      this.monthNumber = monthNumber
      // Set long month name on instance, subtracting by 1 to get index in months array
      this.monthName = this.months.long[monthNumber]

      this.getAvailability(monthNumber)
    },
    getMonthObject(monthIndex) {
      const date = new Date()
      const yearStartDate = new Date(getYear(date), 0, 1)
      const month = {}

      if (Number.isInteger(monthIndex)) {
        // Use passed monthIndex to define dates for day calculations
        const monthEndDate = new Date(getYear(date), monthIndex, 1)
        month.startDate = startOfMonth(monthEndDate)
        month.endDate = endOfMonth(monthEndDate)
      } else {
        // Fall back to current month
        month.startDate = startOfMonth(date)
        month.endDate = endOfMonth(date)
      }

      // Find day numbers of start and end dates in month
      month.startDay = differenceInDays(month.startDate, yearStartDate) + 1
      month.endDay = differenceInDays(month.endDate, yearStartDate) + 1

      return month
    },
    async getAvailability(monthNumber) {
      // Seasonal calendar

      // Data is determined by month

      // Taking the passed month, we're looking for ingredient availability items
      // that have a region matching one of the components of the user's location,
      // with a start day that falls before the end date of the month
      // or an end day that falls after the start date of the month

      const month = this.getMonthObject(monthNumber)

      const location = ['6020', 'Western Australia', 'Australia']

      try {
        const entries = await cfClient.getEntries({
          content_type: 'staticIngredientAvailability',
          // Filter regions that include any components of location
          'fields.region.sys.contentType.sys.id': 'region',
          'fields.region.fields.fullName[in]': location.join(','),
          // Filter start day before end of month
          'fields.startDay[lte]': month.endDay,
          // Filter end day after start of month
          'fields.endDay[gte]': month.startDay
        })

        console.log(
          entries.items.map(item => {
            const name = get(item, 'fields.ingredient.fields.commonName')
            const startDay = get(item, 'fields.startDay')
            const endDay = get(item, 'fields.endDay')
            return `${name} ${startDay}-${endDay}`
          })
        )

        // We're aggregating the availability items to reduce the amount of data shown.
        // First, we'll combine the varieties where possible.
        // Second, we'll combine the regions.
        this.itemsCount = entries.total
        this.items = entries.items
      } catch (err) {
        console.log(err.response.data)
      }
    }
  }
}
</script>

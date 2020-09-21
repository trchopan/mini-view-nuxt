<template>
  <div>
    <div class="calendar">
      <div class="month-select">
        <h2>
          <span class="reset" @click="reset">
            {{ shouldShowToday ? 'Today' : '' }}
          </span>
          <span class="add-month" @click="addMonth(-1)">&lt;</span>
          <span class="year-month">{{ year }} {{ getMonthName(month) }}</span>
          <span class="add-month" @click="addMonth(1)">&gt;</span>
        </h2>
      </div>
      <table>
        <thead>
          <tr>
            <td>S</td>
            <td>M</td>
            <td>T</td>
            <td>W</td>
            <td>T</td>
            <td>F</td>
            <td>S</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, i) in daysArray" :key="`week-${i}`">
            <td
              v-for="(d, j) in week"
              :key="`day-${j}`"
              :class="getDateClass(d)"
            >
              {{ d.getDate() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import calendar from 'calendar-month-array';

export default Vue.extend({
  data() {
    return {
      month: null,
      year: null,
    };
  },
  computed: {
    daysArray() {
      return calendar(new Date(this.year, this.month));
    },
    shouldShowToday() {
      const now = new Date();
      return this.month !== now.getMonth() || this.year !== now.getFullYear();
    },
  },
  created() {
    this.reset();
  },
  methods: {
    reset() {
      const now = new Date();
      this.month = now.getMonth();
      this.year = now.getFullYear();
    },
    getMonthName(m) {
      const monthNames = [
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
        'December',
      ];
      return monthNames[m];
    },
    addMonth(amount) {
      this.month += amount;
      if (this.month < 0) {
        this.month = 11;
        this.year--;
      }
      if (this.month > 11) {
        this.month = 0;
        this.year++;
      }
    },
    getDateClass(d) {
      const now = new Date();
      return {
        'text-fade': this.month !== d.getMonth(),
        'text-secondary':
          now.getMonth() === d.getMonth() &&
          now.getDate() === d.getDate() &&
          now.getFullYear() === d.getFullYear(),
      };
    },
  },
});
</script>

<style lang="scss" scoped>
@import '~/assets/_variables.scss';

.calendar {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 900;
  width: 100%;
  margin: auto;
  position: relative;
  padding-top: 4rem;
  height: 24rem;
  .month-select {
    position: absolute;
    top: 1rem;
    right: 2rem;
    left: 0;
    h2 {
      letter-spacing: -1px;
      font-size: 1.2em;
      display: flex;
      align-items: center;
      justify-content: center;
      .reset {
        flex-basis: 25%;
        color: map-get($colors, 'secondary');
        cursor: pointer;
        padding: 0 1rem;
        font-size: 0.8rem;
      }
      .year-month {
        flex-basis: 65%;
        text-align: center;
      }
      .add-month {
        flex-basis: 5%;
        color: map-get($colors, 'fade');
        padding: 0.5rem;
        cursor: pointer;
      }
    }
  }
}

.calendar table {
  width: 100%;
  font-size: 2rem;
  border-spacing: 0;
  @media (max-width: $breakpoint-sm) {
    font-size: 1.3rem;
  }
  thead {
    vertical-align: top;
  }

  &:hover td.today {
    color: #7512ed;
  }
}

// Kerning mixins
.calendar table td {
  padding: 0 0.5rem;
  line-height: 40px;
  text-align: left;
  border-left: 1px solid map-get($colors, 'accent');
  vertical-align: top;
  letter-spacing: 2px;
}
</style>

<template>
  <div class="clock-container">
    <div class="date">{{ dateStr }}</div>
    <div class="time">{{ timeStr }}</div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      dateStr: '',
      timeStr: '',
    };
  },
  computed: {},
  mounted() {
    setInterval(() => {
      const now = new Date();
      const date = this.addZero(now.getDate());
      const month = this.addZero(now.getMonth() + 1);
      const year = this.addZero(now.getFullYear());
      const hour = this.addZero(now.getHours());
      const minute = this.addZero(now.getMinutes());
      const second = this.addZero(now.getSeconds());
      this.dateStr = `${date}-${month}-${year}`;
      this.timeStr = `${hour}:${minute}:${second}`;
    }, 1000);
  },
  methods: {
    addZero(x) {
      return x >= 10 ? `${x}` : `0${x}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.clock-container {
  text-align: center;
  .date {
    color: #545454;
    font-size: 2rem;
  }
  .time {
    font-size: 5rem;
  }
}
</style>

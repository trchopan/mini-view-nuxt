<template functional>
  <h1 :class="{small: props.small != undefined}">
    You are viewing shared <span class="text-accent">View</span> with other
    users. Please login in
    <router-link class="text-underline" to="/">Home screen</router-link>
    to have your own view.
  </h1>
</template>

<style lang="scss" scoped>
h1 {
  text-align: center;
  font-size: 1.5rem;
  &.small {
    font-size: 0.8rem;
  }
}
</style>

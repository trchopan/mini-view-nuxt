<template functional>
  <h1 :class="{small: props.small != undefined}">
    Welcome, <span class="user-name">{{ props.authUser.email }}</span>
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

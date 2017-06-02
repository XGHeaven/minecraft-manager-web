<template>
  <div class="vertical-tabs">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: ['value'],
    methods: {
      setActive(value) {
        this.$emit('input', value)
      }
    }
  }
</script>

<style lang="stylus">
</style>

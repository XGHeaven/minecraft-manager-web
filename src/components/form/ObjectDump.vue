<template>
  <div class="wrapper">
    <template v-for="(value, key) in value">
      <template v-if="value instanceof Object">
        <div class="object-line">
          <span class="object-key">{{key}}</span>
        </div>
        <object-dump  :value="value"></object-dump>
      </template>
      <div v-else class="object-line">
        <span class="object-key">{{key}}</span>
        <span class="object-value">{{value}}</span>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'ObjectDump',
    props: ['value']
  }
</script>

<style lang="stylus" scoped>
  .wrapper
    display block
    margin-left 16px

  .object-line
    border-bottom 1px solid #999
    padding 6px 10px
    display flex
    flex-direction row

    .object-key
      flex-grow 1
</style>

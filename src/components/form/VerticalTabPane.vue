<template>
  <div class="vertical-tab-pane" :class="{active: active}" @click="select()">
    {{label}}
    <div class="tab-right">
      <slot name="right" class="tab-right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: String,
      name: String
    },
    data() {
      return {
      }
    },
    computed: {
      active() {
        return this.$parent.value === this.name
      }
    },
    methods: {
      select() {
        this.$parent.setActive(this.name)
      }
    }
  }
</script>

<style lang="stylus">
  .tab-right
    float: right
</style>

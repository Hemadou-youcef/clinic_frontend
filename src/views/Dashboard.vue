<template>
  <div>

  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data : () => ({

  }),
  methods:{

  },
  created() {
    this.$store.dispatch('getUser')
  }


}
</script>

<style scoped>

</style>
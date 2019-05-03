<template>
</template>

<script>
  import api from '@/api/api'
  import {mapActions} from 'vuex'

  export default {
    name: 'logout',
    mounted () {
      this.logout()
    },
    methods: {
      ...mapActions(['clearProfile']),
      logout () {
        api.logout()
        this.$success('登出成功')
        this.clearProfile()
        this.$router.push({name: 'login'})
      }
    }
  }
</script>

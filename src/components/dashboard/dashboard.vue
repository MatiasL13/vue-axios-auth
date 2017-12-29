<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
    <p v-if="email">Email addres {{email}}</p> 
    <!-- only the first emails -->
  </div>
</template>

<script>
  import axios  from 'axios';
  export default{
    computed:{
      email(){
        return !this.$store.getters.user ? false  :  this.$store.getters.user.email
      }
    },
    data(){
      return{
        emails: [],
        users: []

      }
    },
    created() {
     this.$store.dispatch('fetchUser')
    }
  }
</script>
<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>
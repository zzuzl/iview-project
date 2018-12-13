<style scoped>
    @import 'styles/common.css';
</style>
<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data () {
            return {}
        },
        mounted () {
          if (!this.isPc()) {
            this.$Message.warning('建议您使用PC浏览器访问！');
          }
        },
        beforeDestroy () {

        },
        methods: {
          isPc: function () {
            let userAgentInfo = navigator.userAgent;
            let Agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
            let flag = true;
            for (let v = 0; v < Agents.length; v++) {
              if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
            }
            return flag;
          }
        }
    }
</script>

<template>
    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="邮箱" prop="email">
            <Input type="email" v-model="formCustom.email"></Input>
        </FormItem>

        <FormItem label="密码" prop="passwd">
            <Input type="password" v-model="formCustom.passwd"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formCustom')">登录</Button>
        </FormItem>
    </Form>
</template>

<script>
  import api from '../api.js'

  export default {
    name: "login",
    components: {},
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      const validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else {
          callback();
        }
      };

      return {
        formCustom: {
          email: '672399171@qq.com',
          passwd: '123456.com',
        },
        ruleCustom: {
          email: [
            {validator: validateEmail, trigger: 'blur'}
          ],
          passwd: [
            {validator: validatePass, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      handleSubmit(name) {
        let _this = this;

        this.$refs[name].validate((valid) => {
          if (valid) {
            api.login(_this.formCustom.email, _this.formCustom.passwd)
              .then(function (res) {
                api.storeToken(res.headers.token);

                if (res.data.success) {
                  _this.$Message.success('登录成功！正在跳转。。。');
                  _this.$router.replace('/');
                } else {
                  _this.$Message.error(res.data.msg);
                }
              });
          } else {
            this.$Message.error('校验失败!');
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
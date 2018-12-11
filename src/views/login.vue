<template>
    <Card style="width:800px; margin: 0 auto; margin-top: 100px; padding: 100px; background: #e8eaec">
        <div style="text-align:center">
            <Form ref="formCustom"
                  :model="formCustom"
                  :rules="ruleCustom"
                  :label-width="80">
                <FormItem label="邮箱" prop="email">
                    <Input type="email" v-model="formCustom.email" size="large"></Input>
                </FormItem>

                <FormItem label="密码" prop="passwd">
                    <Input type="password" v-model="formCustom.passwd" size="large"></Input>
                </FormItem>
                <div style="text-align: right">
                    <Poptip word-wrap width="200" content="Email:672399171@qq.com">
                        <a href="javascript:void(0)">联系我</a>
                    </Poptip>
                    <a href="javascript:void(0)" @click="modal = true" style="font-size: smaller">忘记密码?</a>
                </div>
                <FormItem>
                    <Button type="primary" long @click="handleSubmit('formCustom')">登 录</Button>
                </FormItem>
            </Form>
        </div>
        <Modal title="重置密码"
               v-model="modal"
               :footer-hide="true">
            <Form :label-width="80">
                <FormItem label="邮箱" >
                    <Input type="email" v-model="emailItem.email"/>
                </FormItem>
                <FormItem label="验证码" >
                    <Row>
                        <Col span="13">
                            <Input type="text" v-model="emailItem.code"/>
                        </Col>
                        <Col span="8" offset="2">
                            <img src="http://www.zlihj.cn/rest/resource/captcha-image" height="32" onclick="this.src = 'http://www.zlihj.cn/rest/resource/captcha-image?' + new Date().getMilliseconds()"/>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="sendEmail">发送验证邮件</Button>
                </FormItem>
            </Form>
        </Modal>
    </Card>
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
        modal: false,
        emailItem: {
          email: '',
          code: ''
        },
        formCustom: {
          email: '',
          passwd: '',
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
      sendEmail: function () {
        let _this = this;
        if (!this.emailItem.email || !this.emailItem.code) {
          _this.$Message.error('邮箱或验证码为空');
          return;
        }

          api.sendMail(_this.emailItem.email, _this.emailItem.code)
              .then(function (res) {
                  if (res.data.success) {
                      _this.$Message.success('邮件已发送到：' + _this.emailItem.email + ',请注意查收！');
                  } else {
                      _this.$Message.error(res.data.msg);
                  }
              });
      },
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
    },
    mounted: function () {
      if (!api.isPc()) {
        alert('建议您使用PC浏览器访问！');
      }
    }
  }
</script>

<style scoped>

</style>
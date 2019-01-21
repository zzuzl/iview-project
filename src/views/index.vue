<style scoped>
    .layout-con {
        height: 100%;
        width: 100%;
    }

    .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }

    .menu-item i {
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu span {
        width: 0px;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>
<template>
    <div class="layout" v-show="show">
        <Layout :style="{minHeight: '100vh'}">
            <Sider breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="me"
                      theme="dark"
                      width="auto"
                      @on-select="selectMenu"
                      :class="menuitemClasses">
                    <MenuItem name="me">
                        <span>我的信息</span>
                    </MenuItem>
                    <MenuItem v-if="permission" name="manage">
                        <span>管理</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
                    <strong>欢迎你，{{ me.name }} !</strong>
                    <Button type="primary" @click="iosModal = true">注册ios设备</Button>
                    <Button type="primary" @click="changeModal = true">修改密码</Button>
                    <Button type="danger" @click="logout">退出</Button>

                    <Modal title="修改密码"
                           v-model="changeModal"
                           :footer-hide="true">
                        <Form :ref="passwordItem" :model="passwordItem" :label-width="80" :rules="ruleCustom">
                            <FormItem label="旧密码" prop="oldPassword">
                                <Input type="password" v-model="passwordItem.oldPassword"/>
                            </FormItem>
                            <FormItem label="新密码" prop="newPassword">
                                <Input type="password" v-model="passwordItem.newPassword"/>
                            </FormItem>
                            <FormItem label="确认新密码" prop="newPassword2">
                                <Input type="password" v-model="passwordItem.newPassword2"/>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="changePassword">修改</Button>
                            </FormItem>
                        </Form>
                    </Modal>

                    <Modal title="注册ios设备"
                           v-model="iosModal"
                           :footer-hide="true">
                        <Form :label-width="80">
                            <FormItem label="UUID" >
                                <Input type="text" v-model="iosUuid"/>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="reportUuid">注册</Button>
                            </FormItem>
                        </Form>
                    </Modal>
                </Header>
                <Content :style="{padding: '0 16px 16px',margin: '20px'}">
                    <Card>
                        <div style="height: 800px" v-if="menu === 'me'">
                            <Form :model="me" label-position="left" :label-width="100">
                                <FormItem label="姓名">
                                    <strong>{{ me.name }}</strong>
                                </FormItem>
                                <FormItem label="邮箱">
                                    <strong>{{ me.email }}</strong>
                                </FormItem>
                                <FormItem label="手机号">
                                    <Input v-model="me.phone" @on-change="changed = true"></Input>
                                </FormItem>
                                <FormItem label="性别">
                                    <strong>{{ me.gender | fmtGender }}</strong>
                                </FormItem>
                                <FormItem label="部门/项目">
                                    <strong>{{ me.pname }}</strong>
                                </FormItem>
                                <FormItem label="广讯通">
                                    <Input v-model="me.gxtAccount" @on-change="changed = true"></Input>
                                </FormItem>
                                <FormItem label="QQ">
                                    <Input v-model="me.qq" @on-change="changed = true"></Input>
                                </FormItem>
                                <FormItem label="微信">
                                    <Input v-model="me.wx" @on-change="changed = true"></Input>
                                </FormItem>
                                <FormItem label="工作位置">
                                    <Input v-model="me.workAddress" @on-change="changed = true"></Input>
                                </FormItem>
                                <FormItem label="学校">
                                    <Input v-model="me.school" @on-change="changed = true"></Input>
                                </FormItem>
                                <FormItem label="专业">
                                    <Input v-model="me.major" @on-change="changed = true"></Input>
                                </FormItem>
                                <FormItem label="出生日期">
                                    <strong>{{ me.birthday }}</strong>
                                </FormItem>
                            </Form>
                            <Button type="primary" :disabled="!changed" @click="updateInfo">保存</Button>
                        </div>
                        <div style="height: 850px" v-if="menu === 'manage' && permission">
                            <Tabs value="companyManage" :animated="false">
                                <TabPane label="部门管理" name="companyManage">
                                    <company v-on:reportCompanys="reportCompanys"></company>
                                </TabPane>
                                <TabPane label="项目管理" name="projectManage">
                                    <project v-on:reportProjects="reportProjects"></project>
                                </TabPane>
                                <TabPane label="人员管理" name="staffManage">
                                    <staff :companys="companys" :projects="projects"></staff>
                                </TabPane>
                                <TabPane label="专利管理" name="patentManage">
                                    <patent></patent>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
  import api from '../api.js'
  import Project from './project.vue'
  import Company from './company.vue'
  import Staff from './staff.vue'
  import Patent from './patent'

  export default {
    components: { Project, Company, Staff, Patent },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
    },
    filters: {
      fmtGender: function (value) {
        return value === 1 ? '男' : '女';
      }
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value.length < 6 || value.length > 30) {
          callback(new Error('密码长度[6-30]'));
        } else {
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value !== this.passwordItem.newPassword) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };

      return {
        show: false,
        ruleCustom: {
          oldPassword: [
            {validator: validatePass, trigger: 'blur'}
          ],
          newPassword: [
            {validator: validatePass, trigger: 'blur'}
          ],
          newPassword2: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
        isCollapsed: false,
        menu: 'me',
        me: {},
        changed: false,
        changeModal: false,
        iosModal: false,
        iosUuid: '',
        passwordItem: {
          oldPassword: '',
          newPassword: ''
        },
        companys: [],
        projects: [],
        permission: false,
        searchPid: 'all',
        workTypes: []
      }
    },
    methods: {
      selectMenu: function (menuName) {
        this.menu = menuName;
      },
      logout: function () {
        api.logout();
        this.$router.go('/login');
      },
      reportUuid: function () {
        if (!this.iosUuid) {
          return;
        }
        let _this = this;
        api.reportUuid(this.iosUuid).then(function (res) {
          if (!res.data.success) {
            _this.$Notice.error({
              title: res.data.msg,
            });
          } else {
            _this.$Notice.success({
              title: '注册成功',
            });
          }
        })
      },
      changePassword: function (name) {
        if (!this.passwordItem.oldPassword
          || !this.passwordItem.newPassword
          || !this.passwordItem.newPassword2
          || this.passwordItem.newPassword !== this.passwordItem.newPassword2) {
          return;
        }

        let _this = this;
        api.changePassword({
          oldPassword: _this.passwordItem.oldPassword,
          newPassword: _this.passwordItem.newPassword
        }).then(function (res) {
          if (!res.data.success) {
            _this.$Notice.error({
              title: res.data.msg,
            });
          } else {
            _this.$Notice.success({
              // title: '校验邮件已发送至:' + _this.me.email,
              title: '修改成功',
            });
            _this.logout();
          }
        })
      },
      updateInfo: function () {
        let _this = this;
        api.updateInfo(this.me).then(function (res) {
          if (!res.data.success) {
            _this.$Notice.error({
              title: res.data.msg,
            });
          } else {
            _this.$Notice.success({
              title: '修改成功',
            });
            api.checkLogin()
              .then(function (res) {
                if (res.data.success) {
                  _this.me = res.data.data;
                } else {
                  _this.$router.replace('/login');
                }
              })
          }
        })
      },
        reportCompanys(list) {
          this.companys = list;
        },
        reportProjects(list) {
            this.projects = list;
        },
      initData() {
        let _this = this;

        api.getPermissions()
          .then(function (res) {
            if (res.data.success) {
              if (res.data.data.indexOf("COMPANY_SAVE") > -1) {
                _this.permission = true;
              }
              if (res.data.data.indexOf("PROJECT_SAVE") > -1) {
                _this.permission = true;
              }
              if (res.data.data.indexOf("STAFF_LIST") > -1) {
                _this.permission = true;
              }
            } else {
              _this.$Notice.error({
                title: res.data.msg,
              });
            }
          })
      }
    },
    mounted: function () {
      let _this = this;

      api.workTypes()
        .then(function (res) {
          if (res.data.success) {
            _this.workTypes = res.data.data;
          }
        });

      this.$Loading.start();
      api.checkLogin()
        .then(function (res) {
          _this.$Loading.finish();
          if (res.data.success) {
            _this.show = true;
            _this.me = res.data.data;
            _this.initData();
          } else {
            _this.$router.replace('/login');
          }
        })
    }
  }
</script>

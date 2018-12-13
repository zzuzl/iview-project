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
                    <MenuItem name="manage">
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
                        <div style="height: 800px" v-if="menu === 'manage' && me.type === '总工'">
                            <Tabs value="companyManage">
                                <TabPane label="部门管理" name="companyManage">
                                    <Button type="primary"
                                            @click="company.modal = true; company.item.id = null; company.item.pid = 0;">
                                        添加部门
                                    </Button>
                                    <Table :columns="company.columns"
                                           :stripe="true"
                                           :border="true"
                                           :loading="company.loading"
                                           :height="600"
                                           :data="companys">
                                    </Table>
                                    <Modal title="添加/修改部门"
                                           v-model="company.modal"
                                           @on-ok="saveCompany">
                                        <Form :model="company.item" :label-width="80">
                                            <FormItem label="名称">
                                                <Input v-model="company.item.name"/>
                                            </FormItem>
                                        </Form>
                                    </Modal>
                                </TabPane>
                                <TabPane label="项目管理" name="projectManage">
                                    <Button type="primary"
                                            @click="project.modal = true; project.item.id = null; project.item.pid = 0;">
                                        添加项目
                                    </Button>
                                    <Table :columns="project.columns"
                                           :stripe="true"
                                           :border="true"
                                           :loading="project.loading"
                                           :height="600"
                                           :data="projects">
                                    </Table>
                                    <Modal title="添加/修改项目"
                                           v-model="project.modal"
                                           @on-ok="saveProject">
                                        <Form :model="project.item" :label-width="80">
                                            <FormItem label="名称">
                                                <Input v-model="project.item.name"/>
                                            </FormItem>
                                        </Form>
                                    </Modal>
                                </TabPane>
                                <TabPane label="人员管理" name="staffManage">
                                    <Button type="primary"
                                            @click="staff.modal = true; staff.item.id = null; staff.item.pid = 0;">
                                        添加人员信息
                                    </Button>
                                    <Table :columns="staff.columns"
                                           :stripe="true"
                                           :border="true"
                                           :loading="staff.loading"
                                           :height="650"
                                           :data="staffs">
                                    </Table>
                                    <Page :total="staff.total"
                                          :current="staff.current"
                                          :page-size="50"
                                          @on-change="changePage"
                                          show-total>
                                    </Page>
                                    <Modal title="移动到"
                                           v-model="staffModal"
                                           @on-ok="moveStaffCore">
                                        <Form :model="moveItem" :label-width="80">
                                            <Select v-model="moveItem.pid">
                                                <OptionGroup label="部门">
                                                    <Option v-for="item in companys" :value="'0_' + item.id"
                                                            :key="'0_' + item.id">{{ item.name }}
                                                    </Option>
                                                </OptionGroup>
                                                <OptionGroup label="项目">
                                                    <Option v-for="item in projects" :value="'1_' + item.id"
                                                            :key="'1_' + item.id">{{ item.name }}
                                                    </Option>
                                                </OptionGroup>
                                            </Select>
                                        </Form>
                                    </Modal>

                                    <Modal title="添加/修改人员信息"
                                           v-model="staff.modal"
                                           @on-ok="saveStaff">
                                        <Form :model="staff.item" :label-width="80">
                                            <FormItem label="姓名">
                                                <Input v-model="staff.item.name"/>
                                            </FormItem>
                                            <FormItem label="邮箱">
                                                <Input v-model="staff.item.email" type="email"/>
                                            </FormItem>
                                            <FormItem label="手机号">
                                                <Input v-model="staff.item.phone"/>
                                            </FormItem>
                                            <FormItem label="性别">
                                                <Select v-model="staff.item.gender">
                                                    <Option value="1">男</Option>
                                                    <Option value="2">女</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="部门/项目">
                                                <Select v-model="staff.item.pid">
                                                    <OptionGroup label="部门">
                                                        <Option v-for="item in companys" :value="'0_' + item.id"
                                                                :key="'0_' + item.id">{{ item.name }}
                                                        </Option>
                                                    </OptionGroup>
                                                    <OptionGroup label="项目">
                                                        <Option v-for="item in projects" :value="'1_' + item.id"
                                                                :key="'1_' + item.id">{{ item.name }}
                                                        </Option>
                                                    </OptionGroup>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="职位">
                                                <Select v-model="staff.item.type">
                                                    <Option value="总工">总工</Option>
                                                    <Option value="技术质量部经理">技术质量部经理</Option>
                                                    <Option value="质量总监">质量总监</Option>
                                                    <Option value="技术员">技术员</Option>
                                                    <Option value="测量员">测量员</Option>
                                                    <Option value="资料员">资料员</Option>
                                                    <Option value="试验员">试验员</Option>
                                                    <Option value="安装员">安装员</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="广讯通">
                                                <Input v-model="staff.item.gxtAccount"/>
                                            </FormItem>
                                            <FormItem label="QQ">
                                                <Input v-model="staff.item.qq"/>
                                            </FormItem>
                                            <FormItem label="微信">
                                                <Input v-model="staff.item.wx"/>
                                            </FormItem>
                                            <FormItem label="工作位置">
                                                <Input v-model="staff.item.workAddress"/>
                                            </FormItem>
                                            <FormItem label="学校">
                                                <Input v-model="staff.item.school"/>
                                            </FormItem>
                                            <FormItem label="专业">
                                                <Input v-model="staff.item.major"/>
                                            </FormItem>
                                            <FormItem label="出生日期">
                                                <DatePicker type="date" placeholder="出生日期" format="yyyy-MM-dd"
                                                            v-model="staff.item.birthday"></DatePicker>
                                            </FormItem>
                                        </Form>
                                    </Modal>
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

  export default {
    components: {},
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
        project: {
          modal: false,
          loading: false,
          item: {
            name: '',
            pid: "0"
          },
          columns: [
            {
              title: '名称',
              key: 'name'
            },
            {
              width: 100,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.editProject(params.index)
                      }
                    }
                  }, '修改')
                ]);
              }
            }
          ]
        },
        company: {
          modal: false,
          loading: false,
          item: {
            name: '',
            pid: "0"
          },
          columns: [
            {
              title: '名称',
              key: 'name'
            },
            {
              width: 100,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.editCompany(params.index)
                      }
                    }
                  }, '修改')
                ]);
              }
            }
          ]
        },
        staff: {
          modal: false,
          loading: false,
          item: {
            name: '',
            pid: "0"
          },
          total: 0,
          current: 1,
          columns: [
            {
              title: '姓名',
              key: 'name',
              // fixed: 'left',
              width: 100,
            },
            {
              title: '性别',
              key: 'gender',
              render: (h, params) => {
                return h('div', [
                  h('Label', params.row.gender === 1 ? '男' : '女')
                ]);
              },
              width: 80,
            },
            {
              title: '邮箱',
              key: 'email',
              width: 200,
            },
            {
              title: '手机号',
              key: 'phone',
              width: 120,
            },
            {
              title: '广讯通',
              key: 'gxtAccount',
              width: 150,
            },
            {
              title: '部门/项目',
              key: 'pname',
              width: 300,
            },
            {
              title: '职位',
              key: 'type',
              width: 150,
            },
            {
              title: 'QQ',
              key: 'qq',
              width: 150,
            },
            {
              title: '微信',
              key: 'wx',
              width: 150,
            },
            {
              title: '出生日期',
              key: 'birthday',
              width: 100,
            },
            {
              title: '学校',
              key: 'school',
              width: 200,
            },
            {
              title: '专业',
              key: 'major',
              width: 250,
            },
            {
              title: '工作位置',
              key: 'workAddress',
              width: 300,
            },
            {
              width: 150,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.editStaff(params.index)
                      }
                    }
                  }, '修改'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.moveStaff(params.index)
                      }
                    }
                  }, '移动')
                ]);
              },
            }
          ],
        },
        staffModal: false,
        changeModal: false,
        iosModal: false,
        iosUuid: '',
        passwordItem: {
          oldPassword: '',
          newPassword: ''
        },
        moveItem: {
          name: '',
          pid: "0"
        },
        companys: [],
        projects: [],
        staffs: []
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
      saveProject() {
        let _this = this;
        api.saveProject(this.project.item)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
            }
            _this.reloadProject();
          })
      },
      saveCompany() {
        let _this = this;
        api.saveCompany(this.company.item)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
            }
            _this.reloadCompany();
          })
      },
      saveStaff() {
        let _this = this;
        api.saveStaff(this.staff.item)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
            }
            _this.loadStaff();
          })
      },
      editCompany(index) {
        this.company.item.id = this.companys[index].id;
        this.company.item.name = this.companys[index].name;
        this.company.item.pid = this.companys[index].pid;

        this.company.modal = true;
      },
      editProject(index) {
        this.project.item.id = this.projects[index].id;
        this.project.item.name = this.projects[index].name;
        this.project.item.pid = this.projects[index].pid;

        this.project.modal = true;
      },
      editStaff(index) {
        this.staff.item.id = this.staffs[index].id;
        this.staff.item.name = this.staffs[index].name;
        this.staff.item.email = this.staffs[index].email;
        this.staff.item.gender = "" + this.staffs[index].gender;
        this.staff.item.phone = this.staffs[index].phone;
        this.staff.item.type = this.staffs[index].type;
        this.staff.item.pid = this.staffs[index].source + "_" + this.staffs[index].pid;
        this.staff.item.qq = this.staffs[index].qq;
        this.staff.item.wx = this.staffs[index].wx;
        this.staff.item.gxtAccount = this.staffs[index].gxtAccount;
        this.staff.item.school = this.staffs[index].school;
        this.staff.item.major = this.staffs[index].major;
        this.staff.item.birthday = this.staffs[index].birthday;
        this.staff.item.workAddress = this.staffs[index].workAddress;

        this.staff.modal = true;
      },
      changePage: function (page) {
        this.staff.current = page;
        this.loadStaff();
      },
      moveStaff(index) {
        this.moveItem = {
          id: this.staffs[index].id,
          source: 1,
          pid: this.staffs[index].source + '_' + this.staffs[index].pid
        };
        this.staffModal = true;
      },
      moveStaffCore() {
        let _this = this;
        api.moveStaff(this.moveItem)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
              return;
            }
            _this.loadStaff();
          });
      },
      reloadProject() {
        this.project.loading = true;
        let _this = this;
        api.listProject(0)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
              return;
            }
            _this.projects = res.data.data;
            _this.project.loading = false;
          });
      },
      reloadCompany() {
        this.company.loading = true;
        let _this = this;
        api.listCompany(0)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
              return;
            }
            _this.companys = res.data.data;
            _this.company.loading = false;
          });
      },
      loadStaff() {
        this.staff.loading = true;
        let _this = this;
        this.staffs = [];
        this.staff.total = 0;
        api.listStaff(this.staff.current)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
              return;
            }

            res.data.data.forEach(function (e) {
              _this.staffs.push(e);
            });
            _this.staff.total = res.data.total;

            _this.staff.loading = false;
          });
      }
    },
    mounted: function () {
      let _this = this;

      this.$Loading.start();
      api.checkLogin()
        .then(function (res) {
          _this.$Loading.finish();
          if (res.data.success) {
            _this.show = true;
            _this.reloadCompany();
            _this.reloadProject();
            _this.loadStaff();

            _this.me = res.data.data;
          } else {
            _this.$router.replace('/login');
          }
        })
    }
  }
</script>

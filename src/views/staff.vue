<template>
    <div>
        <Row>
            <Col span="4">
            <Button type="primary"
                    @click="staff.modal = true; staff.item.id = null; staff.item.pid = 0;">
                添加人员信息
            </Button>
            </Col>
            <Col span="4">
            <a href="https://www.zzuzl.cn/rest/resource/downloadTpl" target="_blank">下载导入模板文件</a>
            </Col>
            <Col span="4">
            <Upload action="https://www.zzuzl.cn/rest/resource/uploadFile"
                    :max-size="2048"
                    :show-upload-list="false"
                    :on-success="uploadSucc"
                    :on-error="uploadError"
                    :name="file">
                <Button icon="ios-cloud-upload-outline">导入人员</Button>
            </Upload>
            </Col>
        </Row>
        <Row style="margin-top: 10px">
            <Col span="16" >
            <Input search enter-button placeholder="输入关键字搜索" @on-search="search" v-model="searchKey" />
            </Col>
        </Row>

        <Table :columns="staff.columns"
               :stripe="true"
               :border="true"
               :loading="staff.loading"
               :height="650"
               :data="staffs"
               style="margin: 10px">
        </Table>
        <Page :total="staff.total"
              :current="staff.current"
              :page-size="50"
              @on-change="changePage"
              show-total>
        </Page>
        <Modal title="简历"
               v-model="resumeItem._modal"
               @on-ok="saveResumes(resumeItem.staffId)">
            <Button type="primary"
                    @click="resumes.push({})">
                添加
            </Button>
            <Row v-for="(item,index) in resumes">
                <Col span="20">
                <Input v-model="item.content" @on-change="item.changed = true"/>
                </Col>
                <Col span="4">
                <Button type="danger"
                        @click="delResume(index)">
                    删除
                </Button>
                </Col>
            </Row>
        </Modal>
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
                        <Option v-for="item in workTypes" :value="item.name">{{ item.name }}</Option>
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
                    <DatePicker type="date" @on-change="dateChanged" placeholder="出生日期" format="yyyy-MM-dd"
                                :value="staff.item.birthday"></DatePicker>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
  import api from '../api.js'

  export default {
    name: "staff",
    components: {},
    data() {
      return {
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
                      width: 200,
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
                                      type: 'info',
                                      size: 'small'
                                  },
                                  on: {
                                      click: () => {
                                          this.resumeManage(params.index)
                                      }
                                  }
                              }, '简历'),
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
                              }, '移动'),
                              h('Button', {
                                  props: {
                                      type: 'error',
                                      size: 'small'
                                  },
                                  on: {
                                      click: () => {
                                          this.delStaff(params.index)
                                      }
                                  }
                              }, '删除')
                          ]);
                      },
                  }
              ],
          },
          companys: [],
          staffs: [],
          staffModal: false,
          searchKey: '',
          resumes:[],
          resumeItem: {
              content: '',
              _modal: false
          },
          moveItem: {
              name: '',
              pid: "0"
          },
      }
    },
    methods: {
        loadStaff() {
            if (this.staff.loading) {
                return;
            }

            this.staff.loading = true;
            let _this = this;
            this.staffs = [];
            this.staff.total = 0;
            api.listStaff(this.staff.current, this.searchKey)
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
        },
        delStaff(index) {
            if (!confirm("确定要删除【" + this.staffs[index].name + "】？删除后无法找回！")) {
                return;
            }

            let _this = this;
            api.delStaff(this.staffs[index].id)
                .then(function (res) {
                    if (!res.data.success) {
                        _this.$Notice.error({
                            title: res.data.msg,
                        });
                    } else {
                        _this.loadStaff();
                    }
                })
        },
        search() {
            this.loadStaff()
        },
        moveStaff(index) {
            this.moveItem = {
                id: this.staffs[index].id,
                oldSource: this.staffs[index].source,
                oldPid: this.staffs[index].pid,
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
        dateChanged: function (date) {
            this.staff.item.birthday = date;
        },
        changePage: function (page) {
            this.staff.current = page;
            this.loadStaff();
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
        uploadSucc: function (response, file) {
            if (response.response !== undefined && response.response !== null) {
                this.$Message.success(response.response);
            } else {
                this.$Message.error(response.error);
            }

            this.loadStaff();
        },
        uploadError: function (error, file) {
            this.$Message.error(error);
            this.loadStaff();
        },
        saveResumes(staffId) {
            let _this = this;
            if(this.resumes && this.resumes.length) {
                for (var i=0;i<this.resumes.length;i++) {
                    var resume = this.resumes[i];
                    if (!resume || !resume.content) {
                        this.$Notice.error({
                            title: '输入为空'
                        });
                        return;
                    }
                }
                let body = [];
                this.resumes.forEach(function (resume) {
                    if (resume.changed) {
                        resume.staffId = staffId;
                        body.push(resume);
                    }
                });

                if (body.length) {
                    _this.$Spin.show();
                    api.saveResume(body)
                        .then(function (res) {
                            _this.$Spin.hide();
                            if (!res.data.success) {
                                _this.$Notice.error({
                                    title: res.data.msg,
                                });
                            }
                        })
                } else {
                    this.$Notice.error({
                        title: '无内容'
                    });
                }
            }
        },
        delResume(index) {
            let resume = this.resumes[index];
            let _this = this;
            if (resume.id) {
                this.$Spin.show();

                api.delResume(resume.id)
                    .then(function (res) {
                        _this.$Spin.hide();
                        if (!res.data.success) {
                            _this.$Notice.error({
                                title: res.data.msg,
                            });
                        } else {
                            _this.resumes.splice(index, 1);
                        }
                    })
            } else {
                this.resumes.splice(index, 1);
            }
        },
        resumeManage(index) {
            let _this = this;
            api.listResume(this.staffs[index].id)
                .then(function (res) {
                    if (!res.data.success) {
                        _this.$Notice.error({
                            title: res.data.msg,
                        });
                        return;
                    }
                    _this.resumes = res.data.data;
                    _this.resumeItem._modal = true;
                    _this.resumeItem.staffId = _this.staffs[index].id;
                })
        },
    },
      mounted: function () {
          this.loadStaff();
      }
  }
</script>

<style scoped>

</style>
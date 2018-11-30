<style scoped lang="less">
</style>
<template>
    <Row :gutter="16">
        <Col span="6" offset="1">
            <Button type="primary" @click="projectModal = true">添加</Button>
            <Table :columns="projectColumns"
                   :stripe="true"
                   :border="true"
                   :loading="projectLoading"
                   :height="600"
                   :data="projects">
            </Table>
        </Col>
        <Col span="15" offset="1">
            <Table :columns="staffColumns"
                   :stripe="true"
                   :border="true"
                   :loading="staffLoading"
                   :height="600"
                   :data="staffs">
            </Table>
        </Col>
        <Modal title="添加/修改"
                v-model="projectModal"
               @on-ok="saveProject">
            <Form :model="projectItem" :label-width="80">
                <FormItem label="名称">
                    <Input v-model="projectItem.name"/>
                </FormItem>
            </Form>
        </Modal>
        <Modal title="移动到"
               v-model="staffModal"
               @on-ok="moveStaffCore">
            <Form :model="moveItem" :label-width="80">
                <Select v-model="moveItem.pid">
                    <Option v-for="item in projects" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </Form>
        </Modal>
    </Row>
</template>
<script>
  import api from '../api.js'

  export default {
    components: {},
    data() {
      return {
        projectModal: false,
        projectLoading: false,
        projectItem: {
          name: '',
          pid: "0"
        },
        staffModal: false,
        staffLoading: false,
        moveItem: {
          name: '',
          pid: "0"
        },
        projectColumns: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
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
        ],
        staffColumns: [
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: 'pname',
            key: 'pname'
          },
          {
            title: 'type',
            key: 'type'
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
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
                      this.moveStaff(params.index)
                    }
                  }
                }, '移动')
              ]);
            }
          }
        ],
        projects: [],
        staffs: []
      }
    },
    methods: {
      saveProject() {
        let _this = this;
        api.saveProject()
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
            }
            _this.reloadProject();
          })
      },
      editProject(index) {
        this.projectItem.id = this.data[index].id;
        this.projectItem.name = this.data[index].name;
        this.projectItem.pid = this.data[index].pid.toString();

        this.projectModal = true;
      },
      moveStaff(index) {
        this.moveItem = {
          id: this.staffs[index].id,
          oldSource: this.staffs[index].source,
          oldPid: this.staffs[index].pid,
          source: 1,
          pid: this.staffs[index].pid
        };
        this.staffModal = true;
      },
      moveStaffCore() {
        // console.log(this.moveItem)
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
        this.projectLoading = true;
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
            _this.projectLoading = false;
          });
      },
      loadStaff() {
        this.staffLoading = true;
        let _this = this;
        this.staffs = [];
        api.listStaff(1)
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

            _this.staffLoading = false;
          });
      }
    },
    mounted: function () {
      let _this = this;

      api.checkLogin()
        .then(function (res) {
          if (res.data.success) {
            _this.reloadProject();
            _this.loadStaff();
          } else {
            _this.$router.replace('/login');
          }
        })
    }
  }
</script>

<template>
    <div>
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
    </div>
</template>

<script>
  import api from '../api.js'

  export default {
    name: "project",
    components: {},
    data() {
      return {
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
                      width: 120,
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
                              }, '修改'),
                              h('Button', {
                                  props: {
                                      type: 'error',
                                      size: 'small'
                                  },
                                  on: {
                                      click: () => {
                                          this.delProject(params.index)
                                      }
                                  }
                              }, '删除')
                          ]);
                      }
                  }
              ]
          },
          projects: [],
      }
    },
    methods: {
        editProject(index) {
            this.project.item.id = this.projects[index].id;
            this.project.item.name = this.projects[index].name;
            this.project.item.pid = this.projects[index].pid;

            this.project.modal = true;
        },
        delProject(index) {
            let _this = this;
            api.delProject(this.projects[index].id)
                .then(function (res) {
                    if (!res.data.success) {
                        _this.$Notice.error({
                            title: res.data.msg,
                        });
                    } else {
                        _this.reloadProject();
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
                    _this.$emit('reportProjects', _this.projects);
                    _this.project.loading = false;
                });
        },
    },
      mounted: function () {
          this.reloadProject();
      }
  }
</script>

<style scoped>

</style>
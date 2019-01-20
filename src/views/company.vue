<template>
    <div>
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
    </div>
</template>

<script>
  import api from '../api.js'

  export default {
    name: "company",
    components: {},
    data() {
      return {
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
          companys: [],
      }
    },
    methods: {
        editCompany(index) {
            this.company.item.id = this.companys[index].id;
            this.company.item.name = this.companys[index].name;
            this.company.item.pid = this.companys[index].pid;

            this.company.modal = true;
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
                    _this.$emit('reportCompanys', _this.companys);
                });
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
    },
      mounted: function () {
          this.reloadCompany();
      }
  }
</script>

<style scoped>

</style>
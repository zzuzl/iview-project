<template>
    <div>
        <Card style="width:90%;margin: 0 auto;">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                制度/资料管理
            </p>
            <span slot="extra">
                <a href="#" v-if="draged" style="color: red" @click.prevent="saveDrag">保存调整</a>
                <a href="#" @click.prevent="storage.modal = true; storage.item.id = null;">
                    添加
                </a>
            </span>

            <Table :columns="storage.columns"
                   :stripe="true"
                   :draggable="true"
                   @on-drag-drop="dragDrop"
                   :border="true"
                   :loading="storage.loading"
                   :height="600"
                   :data="storages">
            </Table>
            <Modal title="新增条目"
                   v-model="storage.modal"
                   @on-ok="saveStorage">
                <Form :model="storage.item" :label-width="80">
                    <FormItem label="标题">
                        <Input v-model="storage.item.title"/>
                    </FormItem>
                    <FormItem label="类型">
                        <Select v-model="storage.item.storageType">
                            <Option :value="3">制度</Option>
                            <Option :value="4">资料</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="URL">
                        <Input v-model="storage.item.url" disabled/>
                        <Upload action="https://www.zlihj.cn/rest/resource/uploadStorage"
                                :max-size="5120"
                                :show-upload-list="false"
                                :on-success="uploadSucc"
                                :on-error="uploadError"
                                :name="file">
                            <Button icon="ios-cloud-upload-outline">上传文件（最大5M）</Button>
                        </Upload>
                    </FormItem>
                </Form>
            </Modal>
        </Card>
        <Card style="width:90%;margin: 0 auto;">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                题目管理
            </p>
            <a :href="url" slot="extra">
                查看当前题目设置
            </a>
            <Upload action="https://www.zlihj.cn/rest/resource/uploadSubject"
                    :max-size="5120"
                    :show-upload-list="false"
                    :on-success="uploadSucc"
                    :on-error="uploadError"
                    :name="file">
                <Button icon="ios-cloud-upload-outline">上传题目excel（最大5M）</Button>
            </Upload>
        </Card>
    </div>
</template>

<script>
  import api from '../api.js'

  function sortBy(a, b) {
      if (a.storageType !== b.storageType) {
          return a.storageType - b.storageType
      }

      return a.itemOrder - b.itemOrder
  }

  export default {
    name: "subject",
    components: {},
    data() {
        return {
            url: '#',
            draged: false,
            storage: {
                modal: false,
                loading: false,
                item: {
                    title: '',
                    url: '',
                    storageType: 1
                },
                columns: [
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '存储URL',
                        key: 'url'
                    },
                    {
                        title: '存储类型',
                        width: 150,
                        render: (h, params) => {
                            var value = params.row.storageType;
                            if (value === 1) {
                                value = '部门动态'
                            } else if (value === 2) {
                                value = '制度文件';
                            } else if (value === 3) {
                                value = '制度';
                            } else if (value === 4) {
                                value = '资料';
                            }
                            return h('div', value);
                        }
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
                                            this.editStorage(params.index)
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
                                            this.delStorage(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ]
            },
            storages: []
        }
    },
      methods: {
          uploadSucc: function (response, file) {
              if (response.success) {
                  this.$Message.success('上传成功');
                  this.storage.item.url = response.msg;
              } else {
                  this.$Message.error(response.msg);
              }
          },
          uploadError: function (error, file) {
              this.$Message.error(error);
          },
          editStorage(index) {
              this.storage.item.id = this.storages[index].id;
              this.storage.item.title = this.storages[index].title;
              this.storage.item.url = this.storages[index].url;
              this.storage.item.storageType = this.storages[index].storageType;
              this.storage.modal = true;
          },
          delStorage(index) {
              let _this = this;
              api.delStorage(this.storages[index].id)
                  .then(function (res) {
                      if (!res.data.success) {
                          _this.$Notice.error({
                              title: res.data.msg,
                          });
                          return;
                      }
                      _this.reloadStorage();
                  });
          },
          dragDrop (index1, index2) {
              if (index1 === index2) {
                  return
              }
              let temp = this.storages[index1];
              this.storages.splice(index1, 1);
              this.storages.splice(index2, 0, temp);
              this.draged = true
          },
          saveDrag () {
              if (!this.draged) {
                  return
              }
              let body = [];
              for (let i=0;i<this.storages.length;i++) {
                  if (this.storages[i].itemOrder !== i) {
                      body.push({id:this.storages[i].id, index:i, oldIndex: this.storages[i].itemOrder})
                  }
              }
              console.log(body);
              if (body.length) {
                  let _this = this;
                  this.storage.loading = true;
                  api.saveOrder(body)
                      .then(function (res) {
                          if (!res.data.success) {
                              _this.$Notice.error({
                                  title: res.data.msg,
                              });
                              this.storage.loading = false;
                              return;
                          }
                          _this.reloadStorage();
                          this.storage.loading = false;
                      })
              }

              this.draged = false
          },
          reloadStorage() {
              this.storage.loading = true;
              let _this = this;

              _this.storages = [];
              api.listStorage(3)
                  .then(function (res) {
                      if (!res.data.success) {
                          _this.$Notice.error({
                              title: res.data.msg,
                          });
                          return;
                      }
                      _this.storages = _this.storages.concat(res.data.data);
                      _this.storages.sort(sortBy);
                      _this.storage.loading = false;
                  });

              api.listStorage(4)
                  .then(function (res) {
                      if (!res.data.success) {
                          _this.$Notice.error({
                              title: res.data.msg,
                          });
                          return;
                      }
                      _this.storages = _this.storages.concat(res.data.data);
                      _this.storage.loading = false;
                  });
          },
          saveStorage() {
              let body = {
                  id: this.storage.item.id,
                  title: this.storage.item.title,
                  url: this.storage.item.url,
                  storageType: this.storage.item.storageType
              };

              if (!body.title) {
                  this.$Notice.error({
                      title: '标题不能为空',
                  });
                  return;
              }
              if (!body.url) {
                  this.$Notice.error({
                      title: 'URL不能为空',
                  });
                  return;
              }

              let _this = this;
              api.saveStorage(body)
                  .then(function (res) {
                      if (!res.data.success) {
                          _this.$Notice.error({
                              title: res.data.msg,
                          });
                      }
                      _this.reloadStorage();
                  })
          },
      },
      mounted: function () {
          this.reloadStorage();

          let _this = this;
          api.getExam()
              .then(function (res) {
                  if (!res.data.success) {
                      _this.$Notice.error({
                          title: res.data.msg,
                      });
                  }
                  _this.url = res.data.data.url;
              })
      }
  }
</script>

<style scoped>

</style>

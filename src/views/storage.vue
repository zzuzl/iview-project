<template>
    <div>
        <Button type="primary"
                @click="storage.modal = true; storage.item.id = null;">
            新增条目
        </Button>
        <Table :columns="storage.columns"
               :stripe="true"
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
                        <Option :value="1">部门活动</Option>
                        <Option :value="2">制度规范</Option>
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
                        <Button icon="ios-cloud-upload-outline">导入PDF（最大5M）</Button>
                    </Upload>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
  import api from '../api.js'

  export default {
    name: "storage",
    components: {},
    data() {
      return {
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
              key: 'storageType'
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
                        this.editStorage(params.index)
                      }
                    }
                  }, '修改')
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
      reloadStorage() {
        this.storage.loading = true;
        let _this = this;

        _this.storages = [];
        api.listStorage(1)
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

        api.listStorage(2)
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
    }
  }
</script>

<style scoped>

</style>
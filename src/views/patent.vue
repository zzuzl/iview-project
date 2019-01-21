<template>
    <div>
        <Button type="primary"
                @click="patent.modal = true; patent.item.id = null; patent.item.pid = 0;">
            新增专利
        </Button>
        <Table :columns="patent.columns"
               :stripe="true"
               :border="true"
               :loading="patent.loading"
               :height="600"
               :data="patents">
        </Table>
        <Modal title="新增专利"
               v-model="patent.modal"
               @on-ok="savePatent">
            <Form :model="patent.item" :label-width="80">
                <FormItem label="标题">
                    <Input v-model="patent.item.title"/>
                </FormItem>
                <FormItem label="副标题">
                    <Input v-model="patent.item.subTitle"/>
                </FormItem>
                <FormItem label="作者">
                    <Select
                            v-model="patent.item.authors"
                            filterable
                            remote
                            multiple
                            :remote-method="remoteQuery"
                            :loading="loading1">
                        <Option v-for="(option, index) in options1" :value="option.value" :key="index">
                            {{option.label}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="URL">
                    <Input v-model="patent.item.url" disabled/>
                    <Upload action="http://localhost:8888/rest/resource/uploadPatent"
                            :max-size="5120"
                            :show-upload-list="false"
                            :on-success="uploadSucc"
                            :on-error="uploadError"
                            :name="file">
                        <Button icon="ios-cloud-upload-outline">导入PDF（最大5M）</Button>
                    </Upload>
                </FormItem>
                <FormItem label="发表时间">
                    <DatePicker type="date" @on-change="dateChanged" placeholder="发表时间" format="yyyy-MM-dd"
                                :value="patent.item.postTime"></DatePicker>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
  import api from '../api.js'

  export default {
    name: "patent",
    components: {},
    data() {
      return {
        patent: {
          modal: false,
          loading: false,
          item: {
            title: '',
            subTitle: '',
            url: '',
            postTime: '',
            authors: []
          },
          columns: [
            {
              title: '标题',
              key: 'title'
            },
            {
              title: '副标题',
              key: 'subTitle'
            },
            {
              title: '作者',
              key: 'authorNames'
            },
            {
              title: '专利URL',
              key: 'url'
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
                        this.editPatent(params.index)
                      }
                    }
                  }, '修改')
                ]);
              }
            }
          ]
        },
        patents: [],
        page: 1,
        options1: [],
        loading1: false
      }
    },
    methods: {
      uploadSucc: function (response, file) {
        if (response.success) {
          this.$Message.success('上传成功');
          this.patent.item.url = response.msg;
        } else {
          this.$Message.error(response.msg);
        }
      },
      uploadError: function (error, file) {
        this.$Message.error(error);
      },
      remoteQuery(query) {
        this.options1 = [];

        if (query !== '') {
          this.loading1 = true;
          let _this = this;
          api.listStaff(this.page, query)
            .then(function (res) {
              _this.loading1 = false;
              if (!res.data.success) {
                _this.$Notice.error({
                  title: res.data.msg,
                });
              } else {
                res.data.data.forEach(function (item) {
                  _this.options1.push({label: item.name, value: item.id});
                });
              }
            });
        }
      },
      dateChanged: function (date) {
        this.patent.item.postTime = date;
      },
      editPatent(index) {
        this.patent.item.id = this.patents[index].id;
        this.patent.item.title = this.patents[index].title;
        this.patent.item.subTitle = this.patents[index].subTitle;
        this.patent.item.postTime = this.patents[index].postTime;
        this.patent.item.url = this.patents[index].url;

        let _this = this;
        api.getAuthors(this.patents[index].id)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
            } else {
              _this.options1 = [];
              _this.patent.item.authors = [];
              res.data.data.forEach(function (item) {
                _this.options1.push({label: item.name, value: item.id});
                _this.patent.item.authors.push(item.id);
              });

              _this.patent.modal = true;
            }
          });
      },
      reloadPatent() {
        this.patent.loading = true;
        let _this = this;
        api.listPatent(this.page)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
              return;
            }
            _this.patents = res.data.data;
            _this.patent.loading = false;
          });
      },
      savePatent() {
        let body = {
          id: this.patent.item.id,
          title: this.patent.item.title,
          subTitle: this.patent.item.subTitle,
          authors: this.patent.item.authors.join(','),
          url: this.patent.item.url,
          postTime: this.patent.item.postTime
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

        if (!body.authors || !body.authors.length) {
          this.$Notice.error({
            title: '作者不能为空',
          });
          return;
        }

        if (!body.postTime) {
          this.$Notice.error({
            title: '发表时间不能为空',
          });
        } else {
          body.postTime = new Date(body.postTime);
        }

        let _this = this;
        api.savePatent(body)
          .then(function (res) {
            if (!res.data.success) {
              _this.$Notice.error({
                title: res.data.msg,
              });
            }
            _this.reloadPatent();
          })
      },
    },
    mounted: function () {
      this.reloadPatent();
    }
  }
</script>

<style scoped>

</style>
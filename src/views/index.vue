<style scoped lang="less">
</style>
<template>
    <Row >
        <Col span="8" offset="1" style="margin-top: 50px">
        <Button type="primary" @click="company.modal = true; company.item.id = null; company.item.pid = 0;">添加部门</Button>
        <Table :columns="company.columns"
               :stripe="true"
               :border="true"
               :loading="company.loading"
               :height="600"
               :data="companys">
        </Table>
        </Col>
        <Modal title="添加/修改部门"
               v-model="company.modal"
               @on-ok="saveCompany">
            <Form :model="company.item" :label-width="80">
                <FormItem label="名称">
                    <Input v-model="company.item.name"/>
                </FormItem>
            </Form>
        </Modal>
        <Col span="8" offset="1" style="margin-top: 50px">
        <Button type="primary" @click="project.modal = true; project.item.id = null; project.item.pid = 0;">添加项目</Button>
        <Table :columns="project.columns"
               :stripe="true"
               :border="true"
               :loading="project.loading"
               :height="600"
               :data="projects">
        </Table>
        </Col>
        <Modal title="添加/修改项目"
               v-model="project.modal"
               @on-ok="saveProject">
            <Form :model="project.item" :label-width="80">
                <FormItem label="名称">
                    <Input v-model="project.item.name"/>
                </FormItem>
            </Form>
        </Modal>


        <Col span="22" offset="1" style="margin-top: 50px; margin-bottom: 100px">
        <Button type="primary" @click="staff.modal = true; staff.item.id = null; staff.item.pid = 0;">添加人员信息</Button>
        <Table :columns="staff.columns"
               :stripe="true"
               :border="true"
               :loading="staff.loading"
               :height="1000"
               :data="staffs">
        </Table>
        <Page :total="staff.total"
              :current="staff.current"
              :page-size="20"
              @on-change="changePage"
              show-total></Page>

        </Col>
        <Modal title="移动到"
               v-model="staffModal"
               @on-ok="moveStaffCore">
            <Form :model="moveItem" :label-width="80">
                <Select v-model="moveItem.pid">
                    <OptionGroup label="部门">
                        <Option v-for="item in companys" :value="'0_' + item.id" :key="'0_' + item.id">{{ item.name }}</Option>
                    </OptionGroup>
                    <OptionGroup label="项目">
                        <Option v-for="item in projects" :value="'1_' + item.id" :key="'1_' + item.id">{{ item.name }}</Option>
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
                            <Option v-for="item in companys" :value="'0_' + item.id" :key="'0_' + item.id">{{ item.name }}</Option>
                        </OptionGroup>
                        <OptionGroup label="项目">
                            <Option v-for="item in projects" :value="'1_' + item.id" :key="'1_' + item.id">{{ item.name }}</Option>
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
                    <Input v-model="staff.item.qq" />
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
                    <DatePicker type="date" placeholder="出生日期" format="yyyy-MM-dd" v-model="staff.item.birthday"></DatePicker>
                </FormItem>
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
                        fixed: 'left',
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
                        width: 100,
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                        width: 200,
                    },
                    {
                        title: '手机号',
                        key: 'phone',
                        width: 200,
                    },
                    {
                        title: '广讯通',
                        key: 'gxtAccount',
                        width: 200,
                    },
                    {
                        title: '部门/项目',
                        key: 'pname',
                        width: 300,
                    },
                    {
                        title: '职位',
                        key: 'type',
                        width: 100,
                    },
                    {
                        title: 'QQ',
                        key: 'qq',
                        width: 100,
                    },
                    {
                        title: '微信',
                        key: 'wx',
                        width: 200,
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
                        width: 200,
                    },
                    {
                        title: '工作位置',
                        key: 'workAddress',
                        width: 200,
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
                        fixed: 'right'
                    }
                ],
            },
            staffModal: false,
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

        api.checkLogin()
            .then(function (res) {
                if (res.data.success) {
                    _this.reloadCompany();
                    _this.reloadProject();
                    _this.loadStaff();
                } else {
                    _this.$router.replace('/login');
                }
            })
    }
}
</script>

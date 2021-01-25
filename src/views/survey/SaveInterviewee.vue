<template>
    <div class="save-interviewee-content">
        <van-nav-bar
                title="调研用户"
                :fixed="fixed"
                left-arrow
                @click-left="onClickLeft"
        />
        <div class="register-tips">基本信息填写</div>
        <van-cell-group>
            <template v-for="(item, index) in filterFormList">
                <van-row type="flex" justify="center">
                    <van-col span="10" class="item-title">
                        {{ item.title }}
                    </van-col>
                    <van-col span="14" style="padding-left: 5px;">
                        <van-field v-if="item.type == 'text'" :type="item.type" :required="item.required"
                                   v-model="item.value" :placeholder="item.placeholder"/>
                        <van-field v-if="item.type == 'textarea'" type="textarea" autosize rows="3"
                                   v-model="item.value"></van-field>
                        <van-radio-group v-if="item.type == 'radio'" v-model="item.value">
                            <van-radio name="1">是</van-radio>
                            <van-radio name="0">否</van-radio>
                        </van-radio-group>
                    </van-col>
                </van-row>
            </template>
        </van-cell-group>

        <van-row type="flex" justify="center" class="register-button">
            <van-col span="22" class="submit-button">
                <van-button type="primary" size="large" @click.native="nextStep">{{isFinish?"完成":"下一步"}}</van-button>
            </van-col>
        </van-row>
    </div>
</template>

<script>
    import $http from './../../api/http';
    import $apis from './../../api/apis';
    import {Toast} from 'vant';
    import {getStorage} from "../../utils/storageData";

    export default {
        name: 'SaveInterviewee',
        components: {Toast},
        data() {
            return {
                fixed: true,
                isFinish: false,
                formData: {
                    // caseId: {
                    //   hidden: true,
                    //   value: "",
                    //   title: "调研问卷Id"
                    // },
                    // uid: {
                    //   hidden: true,
                    //   value: '',
                    //   title: '用户id',
                    // },
                    // caseUserId: {
                    //   hidden: true,
                    //   value: '',
                    //   title: '数据库中存的id'
                    // },
                    viewer: {
                        title: "调研人员",
                        value: "",
                        type: "text",
                    },
                    isRecord: {
                        title: "是否有录音",
                        value: "",
                        type: "radio",
                    },
                    name: {
                        title: "受访者姓名",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    phoneNum: {
                        title: "受访者电话",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    age: {
                        title: "受访者年龄",
                        value: "",
                        type: 'text',
                    },
                    sex: {
                        title: "受访者性别",
                        value: "",
                        type: "text",
                    },
                    education: {
                        title: "受访者学历",
                        value: "",
                        type: "text",
                    },
                    industry: {
                        title: "受访者所在行业",
                        value: "",
                        type: "text",
                    },
                    company: {
                        title: "受访者所在公司",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    post: {
                        title: "受访者职位",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    area: {
                        title: "受访者所在地区",
                        value: "",
                        type: "text",
                    },
                    // postLevel: {
                    //   title: "受访者职级",
                    //   value: "",
                    //   type: "text",
                    // },
                    remark: {
                        title: "访谈者及情况备注",
                        value: "",
                        type: "textarea",
                    }
                },
                formData2: {
                    name: {
                        title: "受访者姓名",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    company: {
                        title: "受访者所在公司",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    post: {
                        title: "受访者职位",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    phoneNum: {
                        title: "受访者电话",
                        value: "",
                        type: "text",
                        must: true,
                    },
                }
            }
        },
        computed: {
            filterFormList: function () {
                if (!getStorage("userId") || getStorage("userId") == "-100") {
                    return this.formData2;
                } else {
                    return this.formData;
                }
            }
        },
        mounted() {
            if (!this.$route.params.isNew) {
                if (this.$route.params.caseUserId || getStorage("caseUserId")) {
                    this.isFinish = true;
                    $http.get($apis.baseUrl + $apis.getCaseUser + "?uid=&caseUserId=" + (getStorage("caseUserId") || this.$route.params.caseUserId)).then(res => {
                        let data = res.data;
                        if (!getStorage("userId") || getStorage("userId") == "-100") {
                            this.formData2.name.value = data.name;
                            this.formData2.company.value = data.company;
                            this.formData2.post.value = data.post;
                            this.formData2.phoneNum.value = data.phoneNum;
                        } else {
                            this.formData.viewer.value = data.viewer;
                            this.formData.isRecord.value = data.isRecord;
                            this.formData.name.value = data.name;
                            this.formData.phoneNum.value = data.phoneNum;
                            this.formData.age.value = data.age;
                            this.formData.sex.value = data.sex;
                            this.formData.education.value = data.education;
                            this.formData.industry.value = data.industry;
                            this.formData.company.value = data.company;
                            this.formData.post.value = data.post;
                            this.formData.area.value = data.area;
                            // this.formData.postLevel.value = data.postLevel;
                            this.formData.remark.value = data.remark;
                        }
                    });
                }
            }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            nextStep() {
                const formData = this.filterFormList;
                let _this = this;
                let params = new FormData();
                params.append('viewer', formData.viewer ? formData.viewer.value : '');
                params.append('isRecord', formData.isRecord ? formData.isRecord.value : "");
                params.append('name', formData.name ? formData.name.value : "");
                params.append('phoneNum', formData.phoneNum ? formData.phoneNum.value : "");
                params.append('age', formData.age ? formData.age.value : "");
                params.append('sex', formData.sex ? formData.sex.value : "");
                params.append('education', formData.education ? formData.education.value : "");
                params.append('industry', formData.industry ? formData.industry.value : '');
                params.append('company', formData.company ? formData.company : '');
                params.append('post', formData.post ? formData.post.value : '');
                // params.append('postLevel', formData.postLevel ?formData.postLevel.value:'');
                params.append('area', formData.area ? formData.area.value : '');
                params.append('remark', formData.remark ? formData.remark.value : '');

                let caseUserId = this.$route.params.isNew ? '' : getStorage("caseUserId");
                let uid = this.$route.params.isNew ? '' : getStorage("uid");

                $http.post($apis.baseUrl + $apis.saveCaseUser, {
                    'userId': getStorage("userId") || "",
                    'caseId': '15',
                    'caseUserId': this.$route.params.caseUserId || caseUserId || '',
                    'uid': this.$route.params.uid || uid || '',
                    'viewer': formData.viewer ? formData.viewer.value : '',
                    'isRecord': formData.isRecord ? formData.isRecord.value : "",
                    'name': formData.name ? formData.name.value : "",
                    'phoneNum': formData.phoneNum ? formData.phoneNum.value : "",
                    'age': formData.age ? formData.age.value : "",
                    'sex': formData.sex ? formData.sex.value : "",
                    'education': formData.education ? formData.education.value : "",
                    'industry': formData.industry ? formData.industry.value : '',
                    'company': formData.company ? formData.company.value : '',
                    'post': formData.post ? formData.post.value : '',
                    'area': formData.area ? formData.area.value : '',
                    // 'postLevel': formData.postLevel ?formData.postLevel.value:'',
                    'remark': formData.remark ? formData.remark.value : '',
                }).then(res => {
                    if (res.data.Success == true) {
                        Toast({
                            message: '提交成功！',
                            type: 'success',
                            duration: 1500,
                            onClose: function () {
                                if (!getStorage("userId") || getStorage("userId") == "-100") {
                                    _this.$router.push({
                                        path: '/thanksPage'
                                    });
                                } else if (_this.isFinish) {
                                    _this.$router.push({
                                        path: '/surveyList'
                                    });
                                } else {
                                    _this.$router.push({
                                        path: '/surveyList'
                                    });
                                }
                            }
                        })
                    } else {
                        Toast({
                            message: '提交失败！',
                            type: 'error',
                            duration: 1500,
                            onClose: function () {
                                // _this.$router.push({
                                //   path: '/login'
                                // });
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .save-interviewee-content {
        background-color: #f5f5f5;
        padding-top: 46px;
        height: 100%;

        .register-tips {
            font-size: .3rem;
            color: #434343;
            padding: .2rem;
        }

        .van-cell-group {
            margin: 0 15px;

            ::v-deep.van-row {
                padding: 15px 10px;

                .item-title {
                    text-align: right;
                    /// width: 100%;
                    font-size: .3rem;
                    color: #8a8a8a;
                    line-height: 38px;
                }

                .van-col {
                    .van-cell {
                        padding: 0;
                    }

                    input[type=text] {
                        border: 1px solid #d8d8d8;
                        display: table-cell;
                        padding: 6px 0;
                        border-radius: 3px;
                        width: 100%;
                    }

                    textarea {
                        border: 1px solid #d8d8d8;
                        display: table-cell;
                        padding: 6px 12px;
                        border-radius: 3px;
                        width: 100%;
                    }

                    .van-radio-group {
                        display: flex;
                        justify-content: space-around;
                        height: 38px;
                        font-size: .3rem;
                    }
                }
            }
        }

        .register-button {
            background-color: #ffffff;

            .submit-button {
                margin: .1rem 0;

                .van-button--primary {
                    color: #fff;
                    background-color: #52a9ff;
                    border: 1px solid #52a9ff;
                    height: 40px;
                    border-radius: .3rem;
                    line-height: 40px;
                }
            }
        }
    }
</style>

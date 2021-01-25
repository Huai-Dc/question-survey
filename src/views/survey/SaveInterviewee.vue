<template>
    <div class="save-interviewee-content">
        <van-nav-bar
                title="用户信息"
                :fixed="fixed"
                left-arrow
                @click-left="onClickLeft"
        />
        <div class="register-tips">用户基本信息填写</div>
        <van-cell-group>
            <template v-for="(item, index) in filterFormList">
                <van-row type="flex" justify="center">
                    <van-col span="6" class="item-title">
                        {{ item.title }}
                    </van-col>
                    <van-col span="18" style="padding-left: 5px;">
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
                <van-button type="primary" size="large" @click.native="nextStep">{{"下一步"}}</van-button>
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
                    name: {
                        title: "姓名",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    phoneNum: {
                        title: "电话",
                        value: "",
                        type: "text",
                        must: true,
                    },
                    company: {
                        title: "所在公司",
                        value: "",
                        type: "text",
                        must: true,
                    },
                },
            }
        },
        computed: {
            filterFormList: function () {
                return this.formData;
            }
        },
        mounted() {
            // if (!this.$route.params.isNew) {
            //     if (this.$route.params.caseUserId || getStorage("caseUserId")) {
            //         this.isFinish = true;
            //         $http.get($apis.baseUrl + $apis.getCaseUser + "?uid=&caseUserId=" + (getStorage("caseUserId") || this.$route.params.caseUserId)).then(res => {
            //             let data = res.data;
            //             this.formData.name.value = data.name;
            //             this.formData.phoneNum.value = data.phoneNum;
            //             this.formData.company.value = data.company;
            //         });
            //     }
            // }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            nextStep() {
                const formData = this.filterFormList;
                let _this = this;
                let params = new FormData();
                if(formData.name.value === '' || formData.phoneNum.value === '' || formData.company === ''){
                    Toast({
                        message: '请完整填写信息！',
                        type: 'error',
                        duration: 1500,
                        onClose: function () {
                        }
                    })
                    return false;
                }

                params.append('name', formData.name ? formData.name.value : "");
                params.append('phoneNum', formData.phoneNum ? formData.phoneNum.value : "");
                params.append('company', formData.company ? formData.company : '');


                let caseUserId = this.$route.params.isNew ? '' : getStorage("caseUserId");
                let uid = this.$route.params.isNew ? '' : getStorage("uid");

                $http.post($apis.baseUrl + $apis.saveCaseUser, {
                    'name': formData.name ? formData.name.value : "",
                    'phoneNum': formData.phoneNum ? formData.phoneNum.value : "",
                    'company': formData.company ? formData.company.value : ''
                }).then(res => {
                    if (res.data.Success == true) {
                        Toast({
                            message: '提交成功！',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                // 进入问卷
                                this.$router.push({
                                    name: 'survey',
                                    params: {caseUserId: caseUserId}
                                })
                            }
                        })
                    } else {
                        Toast({
                            message: '提交失败！',
                            type: 'error',
                            duration: 1500,
                            onClose: function () {
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

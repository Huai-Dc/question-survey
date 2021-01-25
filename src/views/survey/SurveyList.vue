<template>
    <div class="survey-list-content">
        <van-nav-bar
                title="调研用户"
                :fixed="fixed"
        />
        <div class="survey-list" style="background-color: #f5f5f5;">
            <van-row v-for="(item, index) in surveyList" @click="goToSurvey(item.caseUserId)">
                <van-col span="4" style="line-height: 36px;height: 36px;margin: 10px 0;">
                    <div class="circle">{{index+1}}</div>
                </van-col>
                <van-col span="8">
                    <div class="survey-name">{{item.name}}</div>
                </van-col>
                <van-col span="12">
                    <div class="survey-date">{{item.date}}</div>
                </van-col>
            </van-row>
        </div>

        <div class="fixed-add-button" @click="gotoSavepage">+</div>
    </div>
</template>

<script>
    import $http from './../../api/http';
    import $apis from './../../api/apis'
    import {getStorage} from "@/utils/storageData";

    export default {
        name: 'SurveyList',
        data() {
            return {
                fixed: true,
                surveyList: [],
            }
        },
        mounted() {
            this.getSurveyList();
        },
        methods: {
            getSurveyList(surceyId) {
                let userId = getStorage("userId");
                $http.get($apis.baseUrl + $apis.getSurveyList + "15?type=" + (userId == 5 ? 1 : 0) + "&userId=" + (userId ? userId : "")).then(res => {
                    this.surveyList = res.data;
                });
            },
            gotoSavepage() {
                this.$router.push({
                    name: 'saveInterviewee',
                    params: {isNew: true}
                })
            },
            goToSurvey(caseUserId) {
                this.$router.push({
                    name: 'survey',
                    params: {caseUserId: caseUserId}
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .survey-list-content {
        background-color: #f5f5f5;
        padding-top: 46px;
        height: 100%;

        .survey-list {
            padding: .2rem;

            .van-row {
                background-color: #ffffff;
                margin-bottom: .15rem;
                border-radius: .1rem;

                .van-col {
                    .circle {
                        width: .4rem;
                        height: .4rem;
                        border-radius: .4rem;
                        background-color: #52a9ff;
                        color: #ffffff;
                        text-align: center;
                        margin: 10px;
                        font-size: .2rem;
                        line-height: .4rem;
                    }

                    .survey-name {
                        height: 36px;
                        line-height: 36px;
                        margin: 10px 0;
                        font-size: .35rem;
                    }

                    .survey-date {
                        height: 36px;
                        line-height: 36px;
                        margin: 10px 0;
                        color: #b8b8b8;
                        font-size: .3rem;
                    }
                }
            }
        }

        .fixed-add-button {
            width: 60px;
            height: 60px;
            position: fixed;
            bottom: 50px;
            right: 50px;
            border-radius: 30px;
            background-color: #52a9ff;
            text-align: center;
            line-height: 60px;
            font-size: 30px;
            color: white;
        }
    }
</style>

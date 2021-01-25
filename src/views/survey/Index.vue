<template>
    <div class="survey-content">
        <van-nav-bar
                title="问卷调查"
                :fixed="fixed"
                @click-right="onClickRight"
                left-arrow
                @click-left="onClickLeft"
        >
            <i class="van-icon van-icon-wap-nav" style="color: #000000; font-size: 26px;" slot="right"/>
        </van-nav-bar>
        <div class="question-tips"><span style="font-size: 14px; color: #52a9ff;">{{currentIndex}}</span> /
            {{questions.length}} <span v-if="currentQuestion">{{getAnswerType(currentQuestion.subAnswerType)}}</span>
        </div>
        <div v-if="currentQuestion" class="question-title">{{currentQuestion.describe}}</div>
        <div v-if="currentQuestion" class="question-area">
            <van-radio-group v-if="currentQuestion.subAnswerType == '1'" v-model="currentQuestion.value">
                <template v-for="(item, index) in currentQuestion.items">
                    <van-radio :name="item.itemId" @click="checkSub(item.checked, item)">{{item.itemName}}</van-radio>
                    <van-field
                            v-if="item.isCustom == 1"
                            v-show="item.itemId == currentQuestion.value"
                            v-model="item.otherText"
                            rows="3"
                            autosize
                            type="textarea"
                    />
                </template>
            </van-radio-group>
            <template v-if="currentQuestion.subAnswerType == '2'" v-for="(item, index) in currentQuestion.items">
                <van-checkbox v-model="item.checked" @change="checkSub(item.checked, item)">{{item.itemName}}
                </van-checkbox>
                <div v-if="item.childSubject && item.childSubject.childItems && item.childSubject.childItems.length>0">
                    <span v-show="item.checked">{{item.childSubject.sampleDesc}}:</span>
                    <van-radio-group v-show="item.checked"
                                     v-if="item.childSubject && item.childSubject.subAnswerType == '1'"
                                     v-model="item.childSubject.value">
                        <template v-for="(childItem, index) in item.childSubject.childItems">
                            <van-radio :name="childItem.itemId">{{childItem.itemName}}</van-radio>
                        </template>
                    </van-radio-group>
                    <template v-if="item.childSubject && item.childSubject.subAnswerType == '2'"
                              v-for="(childItem, index) in item.childSubject.childItems">
                        <template>
                            <van-checkbox v-show="item.checked" style="margin-left: 20px" v-model="childItem.checked"
                                          @change="checkSub(childItem.checked, item)">{{childItem.itemName}}
                            </van-checkbox>
                            <van-field
                                    v-if="childItem.isCustom == 1"
                                    v-show="childItem.checked"
                                    v-model="childItem.otherText"
                                    rows="3"
                                    autosize
                                    type="textarea"
                            />
                        </template>
                    </template>
                    <van-field
                            v-if="item.childSubject.subAnswerType == 3"
                            v-show="item.checked"
                            v-model="item.childSubject.childItems[0].otherText"
                            rows="3"
                            autosize
                            type="textarea"
                    />
                </div>
                <van-field
                        v-if="item.isCustom == 1"
                        v-show="item.checked"
                        v-model="item.otherText"
                        rows="3"
                        autosize
                        type="textarea"
                />
            </template>

            <van-field
                    v-if="currentQuestion.subAnswerType == 3"
                    v-model="currentQuestion.items[0].otherText"
                    rows="3"
                    autosize
                    type="textarea"
            />
        </div>

        <div class="handler-area">
            <van-button type="info" class="handle-button" :disabled="currentIndex <= 1"
                        @click="setCurrentQuestion(+currentIndex-1)">上一题
            </van-button>
            <van-button type="info" class="handle-button" v-if="currentIndex < questions.length"
                        @click="setCurrentQuestion(+currentIndex+1)">下一题
            </van-button>

            <van-button type="info" class="handle-button" v-if="currentIndex == questions.length" @click="finish">完成
            </van-button>
        </div>

        <!-- 弹出层 -->
        <van-popup v-model="show"
                   closeable
                   close-icon="close"
                   position="right"
                   :style="{width: '65%', height: '100%', minWidth: '200px'}"
        >
            <div class="draw-title">问题列表</div>
            <van-cell-group>
                <van-row v-for="(item, index) in questions" @click="setCurrentQuestion(index+1)">
                    <van-col span="2" class="item-index">
                        {{+index+1}}
                    </van-col>
                    <van-col span="22" class="item-title">
                        {{item.sampleDesc}}
                    </van-col>
                    <van-col span="2" class="item-state">

                    </van-col>
                </van-row>
            </van-cell-group>
        </van-popup>
    </div>
</template>

<script>
    import $http from './../../api/http';
    import $apis from './../../api/apis';
    import {getStorage, setStorage} from "@/utils/storageData";
    import {createUid} from "@/utils";

    export default {
        name: 'Index',
        data() {
            return {
                radio: "",
                show: false,
                fixed: true,
                currentIndex: 0,
                questions: [], // 问题列表
                currentQuestion: null,
            }
        },
        mounted() {
            this.getCaseUserId();
        },
        methods: {
            onClickRight() {
                this.show = true;
            },
            onClickLeft() {
                this.$router.go(-1);
            },
            getAnswerType(type) {
                // 1-单选 2-多选 3 - 文本输入
                let answerType;
                switch (type) {
                    case "1":
                        answerType = "（单选）";
                        break;
                    case "2":
                        answerType = "（多选）";
                        break;
                    case "3":
                        answerType = "（文本输入）";
                        break;
                }
                return answerType;
            },
            // 获取后端赋予的用户id
            getCaseUserId() {
                let uid = getStorage('uid');
                let caseUserId = this.$route.params.caseUserId || getStorage('caseUserId') || "";
                if (Object.prototype.toString.call(caseUserId) === '[Object Object]') caseUserId = "";
                if (uid || caseUserId) {
                } else {
                    uid = createUid();
                    setStorage('uid', uid);
                }
                if (caseUserId) {
                    this.getSurveyList("", caseUserId);
                    setStorage("caseUserId", caseUserId);
                } else {
                    $http.post($apis.baseUrl + $apis.saveCaseUser, {
                        'userId': getStorage("userId") || "-100",
                        'caseId': '15',
                        'uid': uid,
                    }).then(res => {
                        if (res.data && res.data.Success == true) {
                            caseUserId = res.data.htInfo.caseUserId;
                            setStorage("caseUserId", caseUserId);
                            this.getSurveyList("", caseUserId);
                        }
                    });
                }
            },
            getSurveyList(uid, caseUserId) {
                $http.get($apis.baseUrl + $apis.getCaseSubject + "/15?uid=" + uid + "&caseUserId=" + caseUserId).then(res => {
                    if (res.data.length > 0) {
                        let data = res.data;
                        data.map((item, index) => {
                            this.questions.push(JSON.parse(item.data));
                        });

                        this.setCurrentQuestion(1, true);
                    }
                })
            },
            setCurrentQuestion(index, flag) {
                if (!flag) this.saveSingleCase();
                this.currentIndex = index;
                this.currentQuestion = this.questions[+index - 1];
            },
            checkSub(checked, item) {
                console.log(item)
                console.log(this.questions)
            },
            finish() {
                this.saveSingleCase(true);
            },
            saveSingleCase(isFinish) {
                if (!this.currentQuestion) return false;

                if (this.currentQuestion.subAnswerType == 1) {
                    let value = this.currentQuestion.value;
                    this.currentQuestion.items.map((item, index) => {
                        if (item.itemId == value) {
                            item.checked = true;
                        } else {
                            item.checked = false;
                        }
                    })
                } else if (this.currentQuestion.subAnswerType == 3) {
                    this.currentQuestion.items[0].checked = true;
                }
                $http.post($apis.baseUrl + $apis.saveCaseAnswer, {
                    caseId: '15',
                    caseUserId: getStorage("caseUserId"),
                    data: JSON.stringify(this.currentQuestion)
                }).then(res => {
                    if (isFinish) {
                        this.$router.push({
                            path: '/thanksPage'
                        });
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .survey-content {
        background-color: #f5f5f5;
        padding-top: 46px;
        height: 100%;

        .question-tips {
            font-size: .3rem;
            color: #434343;
            padding: .25rem;
        }

        .question-title {
            padding: .25rem .2rem;
            font-size: .35rem;
        }

        ::v-deep.question-area {
            background-color: white;
            margin: 0 .25rem;
            padding: .2rem;
            font-size: .3rem;

            .van-checkbox, .van-radio {
                margin: .2rem 0;
            }

            textarea {
                border: 1px solid #d8d8d8;
                display: table-cell;
                padding: 6px 12px;
                border-radius: 3px;
                width: 100%;
            }
        }

        .handler-area {
            padding: .2rem .15rem;
            display: flex;
            justify-content: space-around;

            .handle-button {
                min-width: 2rem;
            }
        }

        .van-popup {
            background-color: #353535;

            .draw-title {
                margin: 0.2rem .3rem;
                padding: .2rem 0;
                border-bottom: 1px solid #ffffff;
                color: #FFFFFF;
                font-size: .4rem;
            }

            ::v-deep.van-hairline--top-bottom::after {
                border-width: 0 !important;
            }

            ::v-deep.van-cell-group {
                background-color: #353535;
                color: #ffffff;
                font-size: 12px;

                .van-row {
                    margin: 15px 5px;

                    .item-title {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
</style>

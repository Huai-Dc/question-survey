<template>
    <div class="survey-content">
        <div class="background">
        </div>
        <span style="margin: 2rem 0 .5rem 0">本次得分</span>
        <span class="score" style="margin-bottom: 1rem;">{{score}}</span>
        <span>感谢您的耐心回答！</span>
    </div>
</template>

<script>
    import {getStorage, setStorage} from "@/utils/storageData";
    import $http from './../../api/http';
    import $apis from './../../api/apis';

    export default {
        name: "survery-test",
        data(){
            return {
                score: 0
            }
        },
        mounted() {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
            this.getScore()
        },
        methods: {
            getScore(){
                let caseUserId = getStorage('caseUserId');
                $http.get($apis.baseUrl + '/home/calUserCaseScore?caseId=16&caseUserId=' + caseUserId).then(res => {
                    if (res.data && res.data.Success == true) {
                        console.log(res)
                        this.score = res.data.Value;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .survey-content {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;

        .background {
            object-fit: cover;
            margin: auto;
            position: absolute;
            z-index: -1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            visibility: visible;
            width: 100%;
            height: 100%;
            background: -moz-linear-gradient( top,#5091e0,#2861c4);
            background: -webkit-linear-gradient(top, #aecdf1, #99dfea);
            img {
                width: 100%;
                height: 100%;
            }
        }

        span {
            font-size: 24px;
            font-weight: bolder;
            display: block;
            text-align: center;
            color: #ffffff;
        }
    }
    .score{
        font-size: 1rem !important;
    }

</style>

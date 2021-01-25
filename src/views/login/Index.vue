<template>
    <div class="login-container">
        <div class="login-background">
            <img :src="require('@/assets/images/background.jpg')"/>
        </div>
        <div class="login-content">
            <!-- LOGO -->
            <van-row type="flex" class="logo" justify="center">
                <van-col span="8">问卷调查</van-col>
            </van-row>
            <!-- 登录表单1 -->
            <div class="form-content">
                <van-row class="user" type="flex" justify="center">
                    <van-col span="3" class="iconBar">
                        <van-icon name="contact"/>
                    </van-col>
                    <van-col span="17" class="inputBar">
                        <van-field v-model="loginForm.username" placeholder="请输入用户名"/>
                    </van-col>
                </van-row>
                <van-row class="password" type="flex" justify="center">
                    <van-col span="3" class="iconBar">
                        <van-icon name="lock"/>
                    </van-col>
                    <van-col span="17" class="inputBar">
                        <van-field v-model="loginForm.password" type="password" placeholder="请输入密码"/>
                    </van-col>
                </van-row>
                <van-row class="submit-button" type="flex" justify="center">
                    <van-col span="20">
                        <van-button type="primary" size="large" loading-text="登录中..." :loading="isLoading"
                                    @click.native="doLogin">{{showLoading}}
                        </van-button>
                    </van-col>
                </van-row>
            </div>
        </div>
    </div>
</template>

<script>
    import {setCookie, getCookie, setStorage} from '@/utils/storageData'
    import * as qs from 'qs'
    import { Toast } from 'vant'
    import $http from '@/api/http'
    import $apis from '@/api/apis'

    export default {
        name: "index",
        data(){
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                isLoading: false,
                checked: false, // 记住密码
            }
        },
        computed: {
            showLoading: function(){
                return this.isLoading ? '登录中...' : '登录'
            }
        },
        methods: {
            doLogin() { // 登录
                this.rememberLoginInfo();
                let _this = this;
                if (_this.isLoading) return false; // 正在加载
                let {username, password} = _this.loginForm;
                if (username != "" && password != "") {
                    _this.isLoading = true;
                    let postData = {
                        username: username,
                        password: password
                    };

                    $http.post($apis.baseUrl + $apis.login, {
                        "userName": username,
                        "passWord": password,
                    }).then(res => {
                        _this.isLoading = false;
                        if (res.data.Success) {
                            setStorage("userId", res.data.htInfo.userId);
                            this.$router.push({
                                path: '/surveyList'
                            });
                        }else{
                            Toast({
                                message: res.data.Message,
                                type: 'error',
                                duration: 1500,
                            })
                        }
                    })
                } else {
                    Toast.fail('登录名或密码不能为空！');
                }
            },
            rememberLoginInfo() {
                if (this.checked) {
                    let cookieInfo = qs.stringify({
                        username: this.loginForm.username,
                        password: this.loginForm.password,
                        checked: this.checked,
                    });
                    setCookie('Login_info', cookieInfo);
                } else {
                    setCookie('Login_info', null);
                }
            },
            setRememberInfo() {
                let info = qs.parse(getCookie('Login_info'));
                if (info) {
                    this.loginForm.username = info.username ? info.username : '';
                    this.loginForm.password = info.password ? info.password : '';
                    this.checked = info.checked ? info.checked : false;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
.login-container{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    .login-background{
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
    }
    .login-content{
        margin-top: 2rem;
        .logo{
            width: 100%;
            margin: .6rem 0;
            font-size: .5rem;
            color: white;
            text-align: center;
        }
    }
    .form-content{
        .user .van-col, .password .van-col{
            height: 44px;
            background-color: rgba(0,0,0,0.5);
        }
        .user{
            margin-bottom: .3rem;
        }
        .password{
            margin-bottom: .3rem;
        }

        .submit-button{
            .van-button--primary{
                color: #ffffff;
                background-color: #52a9ff;
                border: 1px solid #52a9ff;
            }
        }
        .iconBar{
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            margin-right: 2px;
            line-height: 35px;
            text-align: center;
        }
        .van-icon{
            font-size: .5rem;
            color: white;
        }
    }
}
</style>

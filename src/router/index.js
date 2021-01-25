import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/login/Index')
    },
    {
        path: '/survey',
        name: 'survey',
        component: () => import('@/views/survey/Index')
    },
    {
        path: '/saveInterviewee',
        name: 'saveInterviewee',
        component: () => import('@/views/survey/SaveInterviewee')
    },
    {
        path: '/surveyList',
        name: 'surveyList',
        component: () => import('@/views/survey/SurveyList')
    },
    {
        path: '/thanksPage',
        name: 'thanksPage',
        component: () => import('@/views/survey/SurveryOver')
    }
]

const router = new VueRouter({
    routes
})

export default router

/**
 * Created by huai on 2019-12-17
 */
'use strict';

export default {
  // "baseUrl": 'http://192.168.1.49:8000/',
  // "baseUrl": '/api',
  "baseUrl": 'http://59.61.72.34:6027/',
  "login": '/Account/JZQH_MobileLogin/',
  'getCaseUser':'/Home/GetCaseUser', /// ?uid=&caseUserId=
  "getSurveyList": '/Home/GetCaseUserList/', /// 后面加问卷id
  "getCaseSubject": '/Home/GetCaseSubject/',  // 获取问卷
  "saveCaseAnswer": '/Home/SaveCaseSubjectAnswer2/', /// 保存单个问题答案
  "saveCaseUser": '/Home/SaveCaseUser/',  // 保存调研用户信息
}

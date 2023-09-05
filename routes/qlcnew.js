var express = require('express');
var router = express.Router();


var LevelCompanyRouter = require('./qlcnew/level_company')
var InvitationRouter = require('./qlcnew/invitation')
var UserRouter = require('./qlcnew/user')
var ApplicationRouter = require('./qlcnew/application')
var ChangedepartmentalRouter = require('./qlcnew/changedepartmental')
var CalendarRouter = require('./qlcnew/calendar')
var FormCaculateTinhluong = require('./qlcnew/FormCaculateTinhluong') 



router.use('/LevelCompany', LevelCompanyRouter);
router.use('/Invitation', InvitationRouter);
router.use('/User', UserRouter);
router.use('/Application', ApplicationRouter);
router.use('/Changedepartmental', ChangedepartmentalRouter);
router.use('/Calendar', CalendarRouter);
router.use('/FormCaculateTinhluong', FormCaculateTinhluong);


module.exports = router;  
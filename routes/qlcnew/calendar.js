const router = require('express').Router();
const functions = require("../../services/functions");
const CalendarController = require("../../controllers/qlcnew/calendar");
const formData = require('express-form-data');

//Lấy danh sách toàn bộ lịch làm việc
router.get("/", formData.parse(), CalendarController.getAllCalendar);

// //:ấy danh sách lịch làm việc của một công ty
// router.get("/company/all", formData.parse(), CalendarController.getAllCalendarCompany)

//Lấy thông tin của 1 lịch làm việc
router.get("/:id", formData.parse(), CalendarController.getCalendarById)

//Tạo một lịch làm việc mới
router.post("/", formData.parse(), CalendarController.createCalendar)

//Chỉnh sửa một lịch làm việc đã có sẵn
router.post("/:id", formData.parse(), CalendarController.editCalendar)
//Copy một lịch làm việc đã có sẵn
router.post("/copy/:id", formData.parse(), CalendarController.copyCalendar)
module.exports = router
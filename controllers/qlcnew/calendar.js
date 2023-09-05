const Calendar = require("../../models/qlcnew/calendar");
const functions = require("../../services/functions");
const Users = require("../../models/Users");
const cron = require('node-cron');

// const shiftID = require("../../models/Users")
//Lấy danh sách toàn bộ lịch làm việc
exports.getAllCalendar = async (req, res) => {
    await functions.getDatafind(Calendar, {})
        .then((calendars) => functions.success(res, "Get data successfully", calendars))
        .catch((err) => functions.setError(res, err.message));
};

exports.createCalendar = async (req, res) => {
    const { 
        com_id, 
        calendarName, 
        idCalendarWork, 
        timeApply, 
        timeStart, 
        calendarDetail,
        shiftID } = req.body;

    if (!com_id) {
        functions.setError(res, "Company id required");
    } else if (typeof com_id !== "number") {
        functions.setError(res, "Company id must be a number");
    } else if (!calendarName) {
        functions.setError(res, "Calendar name required");
    } else if (!idCalendarWork) {
        functions.setError(res, "Calendar work required");
    } else if (!timeApply) {
        functions.setError(res, "Time apply required");
    } else if (!timeStart) {
        functions.setError(res, "Time start required");
        // } else if (getMonth(timeApply) !== getMonth(timeStart)) {
        //     functions.setError(res, "Time start must be in the same month as time apply");
        // } else if (!calendarDetail) {
        //     functions.setError(res, "calendarDetail required");
    } else {
        let maxId = await functions.getMaxID(Calendar);
        if (!maxId) {
            maxId = 0;
        }
        const _id = Number(maxId) + 1;
        const tCreate = timeApply != 0 ? new Date(timeApply * 1000) : null,
              tUpdate = timeStart != 0 ? new Date(timeStart * 1000) : null

        const calendar = new Calendar({
            _id: _id,
            com_id: com_id,
            shiftID: shiftID||0,
            calendarName: calendarName,
            idCalendarWork: idCalendarWork,
            timeApply: tCreate,
            timeStart: tUpdate,
            isCopy: false,
            timeCopy: null,
            calendarDetail: calendarDetail
        })

        await calendar.save()
            .then(() => {
                functions.success(res, "Calendar saved successfully", calendar);
            })
            .catch(err => functions.setError(res, err.message));
    }
}

exports.getCalendarById = async (req, res) => {
  
    try {
        const _id = req.params.id;
        console.log(_id)
        // const com_id = req.user.data.com_id
        const data = await functions.getDatafindOne(Calendar, { _id: _id });
        console.log(data)
        // const data = await Calendar.findOne({ _id: _id }).select(" com_id calendarName idCalendarWork").exec();
        if (data) {
            return await functions.success(res, 'Lấy lich thành công', data);
        };
        return functions.setError(res, 'Không có dữ liệu', 404);
    } catch (err) {
        functions.setError(res, err.message);
    };

}

exports.editCalendar = async (req, res) => {

    const _id = req.params.id;
    //   console.log(_id)
    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const { com_id, calendarName, idCalendarWork, timeApply, timeStart, calendarDetail,shiftID } = req.body;

        if (!com_id) {
            functions.setError(res, "Company id required");
        } else if (typeof com_id === "number") {
            functions.setError(res, "Company id must be a number");
        } else if (!calendarName) {
            functions.setError(res, "Calendar name required");z
        } else if (!idCalendarWork) {
            functions.setError(res, "Calendar work required");
        // } else if (typeof idCalendarWork !== "number") {
        //     functions.setError(res, "Calendar work must be a number")
        // } else if (!Number.isInteger(idCalendarWork) || idCalendarWork <= 0 || idCalendarWork >= 3) {
        //     functions.setError(res, "Calendar is invalid");
        } else if (!timeApply) {
            functions.setError(res, "Time apply required");
        } else if (!timeStart) {
            functions.setError(res, "Time start required");
        // } else if (timeApply.getMonth() !== timeStart.getMonth()) {
            functions.setError(res, "Time start must be in the same month as time apply");
        // } else if (!calendarDetail) {
        //     functions.setError(res, "Calendar required");
        } else {
            const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
            console.log(calendar)
            if (!calendar) {
                functions.setError(res, "Calendar does not exist");
            } else {
                await functions.getDatafindOneAndUpdate(Calendar, { _id: _id }, {
                    com_id: com_id,
                    shiftID: shiftID || 0,
                    calendarName: calendarName,
                    idCalendarWork: idCalendarWork,
                    timeApply: timeApply,
                    timeStart: timeStart,
                    isCopy: false,
                    timeCopy: null,
                    calendarDetail: calendarDetail
                })
                    .then((data) => functions.success(res, "Calendar edited successfully",data))
                    .catch((err) => functions.setError(res, err.message));
            }
        }
    }
}

//Copy một lịch làm việc đã có sẵn

exports.copyCalendar = async (req, res) => {
    const _id = req.params.id;
    if (isNaN(_id)) {
        functions.setError(res, "Id must be a number");
    } else {
        const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
      
        
        if (!calendar) {
            functions.setError(res, "Calendar does not exist");
        } else {
            let maxId = await functions.getMaxID(Calendar);
            if (!maxId) {
                maxId = 0;
            }
            const newId = Number(maxId) + 1;
            const beroreTimeStart = calendar.timeStart;
            const beforeDayOfWeek = beroreTimeStart.getDay();
            const newCalendar = new Calendar({
                ...calendar,
                _id: newId,
                isCopy: true,
                timeCopy:new Date(),

            })
            
            await newCalendar.save()
                .then(() => {
                    functions.success(res, "Calendar copied successfully", newCalendar);
                })
                .catch(err => functions.setError(res, err.message));
        }
    }
   // Thêm chức năng tự động copy vào cuối tháng
   cron.schedule('0 0 1 * *', async () => {
    try {
        // Lấy thời gian hiện tại
        const currentDate = new Date();
        
        // Kiểm tra xem có phải cuối tháng hay không (ngày là 1 và giờ là 0)
        if (currentDate.getDate() === 1 && currentDate.getHours() === 0) {
            // Thực hiện copy lịch làm việc từ tháng hiện tại sang tháng tiếp theo
            const calendar = await functions.getDatafindOne(Calendar, { _id: _id });
            // Lặp qua từng lịch làm việc và thực hiện copy
            
                let maxId = await functions.getMaxID(Calendar);
                if (!maxId) {
                    maxId = 0;
                }
                const newId = Number(maxId) + 1;
                const newCalendar = new Calendar({
                    ...calendar,
                    _id: newId,
                    timeStart: currentDate,
                    isCopy: true,
                    timeCopy: new Date(),
                });

                await newCalendar.save();
                functions.success(res, "Calendar copied successfully", newCalendar);

            
        }
    } catch (err) {
        functions.setError(res, err.message);
    }
});
};








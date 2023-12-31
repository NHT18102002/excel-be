const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://localhost:27017/api-base365');


const Tinhluong365ThuongPhatSchema = new Schema({
    pay_id: {
        type: Number,
        default:0
    },
    pay_id_user: {
        type: Number,
        default:0
    },
    pay_id_com: {
        type: Number,
        default:0
    },
    pay_price:{
        type: Number,
        default:0
    },
    pay_status:{
        type: Number,
        default:0
    },
    pay_case:{
        type: String,
        default:""
    },
    pay_day:{
        type: Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    pay_month:{
        type: Number,
        default:0
    },
    pay_year:{
        type: Number,
        default:0
    },
    pay_group:{
        type: Number,
        default:0
    },
    pay_nghi_le:{
        type: Number,
        default:0
    },
    pay_time_created:{
        type: Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    }
}, {
    collection: 'Tinhluong365ThuongPhat',
    versionKey: false,
    timestamp: true
});
// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
Tinhluong365ThuongPhatSchema.pre('save', async function(next) {
    try{
        let maxId = await connection.model("Tinhluong365ThuongPhat", Tinhluong365ThuongPhatSchema).find({},
            {pay_id:1}).sort({pay_id:-1}).limit(1);
        if(maxId && maxId.length){
            maxId = maxId[0].pay_id + 1;
            await Counter.findOneAndUpdate({TableId: 'Tinhluong365ThuongPhatId'}, {$set:{Count:maxId}});
            console.log('Cập nhật counter')
            next();
        }
        else{
            return false;
        }
    }
    catch(e){
        return next(e);
    }
});
module.exports = connection.model("Tinhluong365ThuongPhat", Tinhluong365ThuongPhatSchema);
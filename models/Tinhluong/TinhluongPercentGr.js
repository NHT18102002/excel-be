const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Counter = require('../Counter');
let connection = mongoose.createConnection('mongodb://localhost:27017/api-base365');


const TinhluongPercentGrSchema = new Schema({
    pr_id:{
        type: Number,
        require:true
    },
    pr_id_user: {
        type: Number,
        require:true
    },
    pr_id_group: {
        type: Number,
        require:true
    },
    pr_id_tl:{
        type: Number,
        default:0
    },
    pr_money:{
        type: Number,
        default:0
    },
    pr_rose:{
        type: Number,
        default:0
    },
    pr_lr_type:{
        type: Number,
        default:0
    },
    pr_time:{
        type:Date,
        default:new Date('1970-01-01T00:00:00.000+00:00')
    },
    pr_percent:{
        type:mongoose.Types.Decimal128,
        default:0
    },
},{
    collection: 'TinhluongPercentGr',
    versionKey: false,
    timestamp: true
})


// lúc insert lấy dữ liệu ở bảng Counter ra => tăng lên 1 rồi save 
TinhluongPercentGrSchema.pre('save', async function(next) {
    try{
        let maxId = await connection.model("TinhluongPercentGr", TinhluongPercentGrSchema).find({},
            {pr_id:1}).sort({pr_id:-1}).limit(1);
        if(maxId && maxId.length){
            console.log(maxId)
            maxId = maxId[0].pr_id + 1;
            await Counter.findOneAndUpdate({TableId: 'TinhluongPercentGrId'}, {$set:{Count:maxId}});
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

module.exports = connection.model("TinhluongPercentGr", TinhluongPercentGrSchema); 
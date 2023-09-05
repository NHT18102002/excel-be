const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cellvalueSchema = new Schema({
    com_id:{
        type: Number
    },
    cell:{
        type: String,
    },
    value: {
        type: String,
  
    },
  
});

module.exports = mongoose.model("Cellvalue", cellvalueSchema);

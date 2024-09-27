const mongoose = require('mongoose');

const PatentsFiledSchema = new mongoose.Schema({
    PatentTitle: { 
        type: String,
        required: true
        }, 
    Inventor: { 
        type: String,
        required: true
        }, 
    ApplicationNo: { 
        type: String,
        required: true
        }, 
        PatentYear : { 
            type: String,
            required:true

        }
});

module.exports = mongoose.model('PatentsFiled', PatentsFiledSchema);

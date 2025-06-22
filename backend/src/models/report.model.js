import mongoose from "mongoose";

const reportSchema= new mongoose.Schema({
    userId : {
        type : String,
        required : "true"
    },
    maximum : {
        type : Number,
        required : "true"
    },
    minimum : {
        type : Number,
        required : "true"
    },
    area : {
        type : String,
        required : "true"
    },
    age : {
        type : Number,
        required : "true"
    },
    gender : {
        type : String,
        required : "true"
    },
    image : {
        type : String,
        required : "true"
    },
    probability : {
        type : String,
        required : "true"
    },
    analysis : {
        type : String,
        required : "true"
    }
},
{timestamps: true});

const Report= new mongoose.model("Report", reportSchema);

export default Report; 
const mongoose = require("mongoose");

const course_student_results = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        //unique: true,
    },
    semester:{
        type:Number,
        required:true,
    },
    course:{
        type:String,
        required:true,
    },
    gpa:{
        type:String,
        default:"not known",
    }
}
);

const  individual_courses_results= mongoose.model("course_student_results", course_student_results);
module.exports = individual_courses_results;


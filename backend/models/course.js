const mongoose = require('mongoose')

const courses = mongoose.Schema({
    title : { type : String , required : true} ,
    description : { type : String } ,
    semester : {type : Number , required : true},
    department : {type : String , required : true},
    notes : [String],
    links : [String],
    pyq : [String]
})

const Courses = mongoose.model('courses', courses )
module.exports= Courses  


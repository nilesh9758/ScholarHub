const mongoose = require('mongoose')
const { boolean } = require('webidl-conversions')

const userSchema = mongoose.Schema({
    Roll_no : { type : String , required : true} ,
    Password : { type : String } ,
    isadmin : {type : Boolean} 
})

const User = mongoose.model('user', userSchema )
module.exports= User  


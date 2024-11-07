// overall semester ki cgpa ke liye 
const express = require('express')
const router = express.Router()

const SemGpa = require('../models/result_according_to_semester');

function check_if_teacher_or_admin(req){
    return req.body.userType==="admin" || req.body.userType==="teacher";
}

router.get('/',async (req,res)=>{
    const roll = req.user.rollNo;
    const sem_no = req.query.semester;

    try {
        data = await SemGpa.find({rollNo:roll , semester:sem_no});
        if (typeof data === 'undefined') {
            console.log('The variable is undefined');
            res.status(201).json({sgpa: "not uploaded"});
        } 
        else{
            console.log(data[0]);
            sgpa = data[0].sgpa;
            res.status(201).json({sgpa: sgpa});
        }
    }
    catch (error) {
        console.log(error,"smjhe")
        res.status(500);
    }
    res.end();
})

router.post('/' , async(req,res)=>{
    const roll = req.body.rollNo;
    const sem_no = req.body.semester;
    const sgpa = req.body.sgpa ; 

    if(!check_if_teacher_or_admin(req)){
        return res.status(401).send("Not an admin or a teacher");
    }

    try {
        const result_to_add = new SemGpa({
            rollNo : roll,
            semester : sem_no,
            sgpa : sgpa,
        });
        await result_to_add.save();
        console.log("Gpa added");
        res.status(201).json(req.body);
    }
    catch (error) {
        console.log(error)  
        res.status(500);
    }
})

module.exports=router;


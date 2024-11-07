const express = require('express');
const router = express.Router();

const individual_courses_results = require('../models/individual_courses_results');

function check_if_teacher_or_admin(req) {
    return req.body.userType === "admin" || req.body.userType === "teacher";
}

// Route to get the SGPA of a student for a specific course and semester
router.get('/', async (req, res) => {
    const roll= req.query.roll;
    const course = req.query.course;

    try {
        const data = await individual_courses_results.findOne({ rollNo: roll, course: course });
        if (!data) {
            return res.status(404).json({ message: "Data not found for the specified parameters." });
        }
        return res.status(200).json({ gpa: data.gpa });
    } catch (error) {
        console.error("Error fetching course results:", error);
        return res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

// Route to add SGPA for a course if the user is an admin or teacher
router.post('/', async (req, res) => {
    const roll = req.body.rollNo;
    const semester = req.body.semester;
    const course = req.body.course;
    const gpa = req.body.gpa;

    if (!check_if_teacher_or_admin(req)) {
        return res.status(401).json({ message: "Unauthorized: Only admin or teacher can add results." });
    }

    try {
           const result_to_add = new individual_courses_results({
            rollNo: roll,
            semester: semester,
            course: course,
            gpa: gpa,
        });
        await result_to_add.save();
        console.log("Data added successfully");
        return res.status(201).json(req.body);
    } catch (error) {
        console.error("Error adding data:", error);
        return res.status(500).json({ error: "An error occurred while saving data." });
    }
});

module.exports = router;



// const express = require('express')
// const router = express.Router()

// const individual_courses_results = require('../models/individual_courses_results');

// function check_if_teacher_or_admin(req){
//     return req.user.type==="admin" || req.user.type==="teacher";
// }

// router.get('/',async (req,res)=>{
//     const roll = req.user.rollNo;
//     const semester= req.query.semester;
//     const course = req.query.course;
//     try {
//         const data = await individual_courses_results.find({rollNo:roll ,semester:semester, course:course});
//         console.log(data[0]);
//         res.status(201).json({sgpa:data[0].gpa});
//     }
//     catch (error) {
//         console.log("error happened :",error)
//         res.status(500);
//     }
//     res.end();
// })


// router.post('/' , async(req,res)=>{
//     const roll = req.body.rollNo;
//     const semester = req.body.semester;
//     const course = req.body.course;
//     const gpa = req.body.gpa ; 

//     if(check_if_teacher_or_admin(req)){
//         try {
//             const result_to_add = new individual_courses_results({
//                 rollNo : roll,
//                 semester: semester,
//                 course : course,
//                 gpa : gpa,
//             });
//             await result_to_add.save();
    
//             console.log("data added");
//             res.status(201).json(req.body);
//         }
//         catch (error) {
//             console.log(error)  
//             res.status(500);
//         }
//     }
//     else{
//         return res.status(401).send("You are not admin or teacher")
//     }
// })

// module.exports=router;


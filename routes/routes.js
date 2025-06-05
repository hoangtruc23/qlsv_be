const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');
const subjectsController = require('../controllers/SubjectControllers');
const userController = require('../controllers/UserController');
const classController = require('../controllers/ClassControllser');
const gradesController = require('../controllers/GradesController');

router.get('/login', loginController.getAllLogins);
router.post('/login/check', loginController.checkLogin);
router.post('/create_user', loginController.registerUser);


//SUBJECTS
router.get('/subjects', subjectsController.getAllSubjects);
router.post('/add_subject', subjectsController.postNewSubject);
router.post('/assign_subject', subjectsController.assignTeacher);

//STUDENTS
router.get('/students', userController.getAllStudents);
router.get('/teachers', userController.getAllTeachers);

//CLASSES
router.get('/classes', classController.getAllClasses);
router.get('/assign_class', classController.postAssignClasses);
router.post('/add_class', classController.postNewClasses);
router.post('/assign_student_class', classController.assignStudentToClass);
router.post('/student_class', classController.getStudentsInClass);


//GRADES 
router.get('/grades/history/:student_class_id', gradesController.getGradeHistory);
router.post('/update_grades', gradesController.updateGrade);
// router.post('/history_grade', gradesController.getGradeHistory);

module.exports = router;
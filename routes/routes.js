const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');
const subjectsController = require('../controllers/SubjectControllers');
const userController = require('../controllers/UserController');
const classController = require('../controllers/ClassControllser');
const gradesController = require('../controllers/GradesController');


// LOGIN
/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Lấy danh sách login
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/login/check:
 *   post:
 *     summary: Kiểm tra thông tin đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/create_user:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */
router.get('/login', loginController.getAllLogins);
router.post('/login/check', loginController.checkLogin);
router.post('/create_user', loginController.registerUser);
router.post('/change_password', loginController.changePassword);


// SUBJECTS
/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Lấy danh sách môn học
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/add_subject:
 *   post:
 *     summary: Thêm môn học mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjectName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm thành công
 */

/**
 * @swagger
 * /api/assign_subject:
 *   post:
 *     summary: Gán môn học cho giáo viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacherId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gán thành công
 */
router.get('/subjects', subjectsController.getAllSubjects);
router.post('/add_subject', subjectsController.postNewSubject);
router.post('/assign_subject', subjectsController.assignTeacher);
router.get('/remove_subject/:subject_id', subjectsController.removeSubject);
router.post('/update_subject', subjectsController.updateSubject);


// STUDENTS
/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Lấy danh sách sinh viên
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Lấy danh sách giáo viên
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/students', userController.getAllStudents);
router.get('/teachers', userController.getAllTeachers);


// CLASSES
/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Lấy danh sách lớp học
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/assign_class:
 *   get:
 *     summary: Gán lớp học cho giáo viên
 *     responses:
 *       200:
 *         description: Gán thành công
 */

/**
 * @swagger
 * /api/add_class:
 *   post:
 *     summary: Thêm lớp học mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               className:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm thành công
 */

/**
 * @swagger
 * /api/assign_student_class:
 *   post:
 *     summary: Gán sinh viên vào lớp học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gán thành công
 */

/**
 * @swagger
 * /api/student_class:
 *   post:
 *     summary: Lấy danh sách sinh viên trong lớp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/classes', classController.getAllClasses);
router.get('/assign_class', classController.postAssignClasses);
router.post('/add_class', classController.postNewClasses);
router.post('/assign_student_class', classController.assignStudentToClass);
router.post('/student_class', classController.getStudentsInClass);
router.get('/classes/:class_id', classController.getStudentsByClass);
router.post('/updateClassStatus', classController.postUpdateClassStatus);


// GRADES
/**
 * @swagger
 * /api/grades/history/{student_class_id}:
 *   get:
 *     summary: Xem lịch sử điểm của sinh viên trong lớp
 *     parameters:
 *       - in: path
 *         name: student_class_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sinh viên trong lớp
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/update_grades:
 *   post:
 *     summary: Cập nhật điểm số
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_class_id:
 *                 type: string
 *               subject_id:
 *                 type: string
 *               grade:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.get('/grades/history/:student_class_id', gradesController.getGradeHistory);
router.post('/update_grades', gradesController.updateGrade);


module.exports = router;
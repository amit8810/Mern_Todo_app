import express from 'express';
const router = express.Router();

import {verifyJWT} from '../middlewares/auth.middleware.js'
import {createTodo, editTodo, changeTodoStatus, deleteTodo, getTodos} from '../controllers/todo.controller.js'


router.route('/create').post(verifyJWT, createTodo);
router.route('/edit/:todoId').patch(editTodo);
router.route('/change-status/:todoId').patch(changeTodoStatus);
router.route('/delete/:todoId').delete(deleteTodo);
router.route('/:userId').get(getTodos);


export default router;
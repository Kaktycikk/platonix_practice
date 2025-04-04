import express from 'express';
import { Router } from 'express';
import Todo from '../models/Todo.js';
import pool from '../vendor/db.js';
import { getAllTodos, createTodo, updateTodoStatus,
     updateMultipleTodos, resetAllTodos } 
     from '../vendor/db.js';

const router = Router()
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const todos = await getAllTodos();
        todos.forEach(todo => todo.completed = todo.completed === 1);
        res.render('index', {
            title: 'Todos list',
            isIndex: true,
            todos
        });
    } catch (error) {
        console.error('Ошибка при получении задач:', error);
        res.status(500).json({ message: 'Ошибка при загрузке задач' });
    }
});

router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create todo',
        isCreate: true
    });
});

router.post('/create', async (req, res) => {
    try {
        const { title } = req.body;
        await createTodo(title);
        res.redirect('/');
    } catch (error) {
        console.error('Ошибка при создании задачи:', error);
        res.status(500).json({ message: 'Ошибка при создании задачи' });
    }
});

router.post('/complete', async (req, res) => {
    try {
        const { id, completed } = req.body;
        const isCompleted = completed === '1';
        await updateTodoStatus(id, isCompleted);
        res.redirect('/');
    } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
        res.status(500).json({ message: 'Ошибка при обновлении задачи' });
    }
});

router.put('/update', async (req, res) => {
    try {
        const todos = req.body.todos;
        if (!todos) {
            return res.status(400).json({ message: 'No todos received' });
        }
        await updateMultipleTodos(todos);
        res.status(200).send('Задачи обновлены');
    } catch (error) {
        console.error('Ошибка при обновлении задач:', error);
        res.status(500).json({ message: 'Ошибка при обновлении задач' });
    }
});

router.put('/reset-all', async (req, res) => {
    try {
        await resetAllTodos();
        res.status(200).send('Статус всех задач сброшен');
    } catch (error) {
        console.error('Ошибка при сбросе статуса задач:', error);
        res.status(500).json({ message: 'Ошибка при сбросе статуса задач' });
    }
});

export default router;

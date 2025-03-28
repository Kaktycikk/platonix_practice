import express from 'express';
import { Router } from 'express';
import Todo from '../models/Todo.js';
import pool from '../index.js';
const router = Router()

router.use(express.json());
router.get('/', async (req, res) => {
    const todos = await Todo.getAll();

    todos.forEach(todo => {
        todo.completed = todo.completed === 1; 
    });

    res.render('index', {
        title: 'Todos list',
        isIndex: true,
        todos
    });
});


router.get('/create', (req, res) =>{
    res.render('create', {
        title: 'Create todo',
        isCreate: true
    })
})

router.post('/create', async (req, res) => {
    const { title } = req.body;

    await Todo.create(title);

    res.redirect('/');
});

router.post('/complete', async (req, res) => {
    const { id, completed } = req.body;
    const isCompleted = completed === '1';
    await pool.query(
        'UPDATE todos SET completed = ? WHERE id = ?',
        [isCompleted, id] 
    );
    res.redirect('/');
});

router.put('/update', async (req, res) => {
    const todos = req.body.todos; 
    
    if (!todos) {
        console.log('Received todos: undefined');
        return res.status(400).json({ message: 'No todos received' });
    }

    try {
 
        for (const todo of todos) {
            await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [todo.completed, todo.id]);
        }

        res.status(200).send('Задачи обновлены');
    } catch (error) {
        console.error('Ошибка при обновлении задач:', error);
        res.status(500).json({ message: 'Ошибка при обновлении задач' });
    }
});

router.put('/reset-all', async (req, res) => {
    try {
        await pool.query('UPDATE todos SET completed = 0');
        res.status(200).send('Статус всех задач сброшен');
    } catch (error) {
        console.error('Ошибка при сбросе статуса задач:', error);
        res.status(500).json({ message: 'Ошибка при сбросе статуса задач' });
    }
});

export default router;

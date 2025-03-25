import { Router } from 'express';
import Todo from '../models/Todo.js';
import pool from '../index.js';
const router = Router()

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

export default router;

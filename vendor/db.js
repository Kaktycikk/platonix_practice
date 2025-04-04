import unixTime from "unix-time";
import { mlog } from './logs.js';
import urlencode from 'urlencode';
import mysql from 'mysql2'

let sets = {
    host: 'platon.teyhd.ru',
    port: 3407,
    user: 'student',
    password: 'studpass',
    database: 'travkina_todo',
    charset : 'utf8mb4_general_ci',   
    waitForConnections: true,
    connectionLimit: 50,
    maxIdle: 50,
    idleTimeout: 60000,
    queueLimit:0,
    enableKeepAlive: true,
    keepAliveInitiaDelay: 0
}

const pool = mysql.createPool(sets).promise();

// Получить все задачи
export async function getAllTodos() {
    const [rows] = await pool.query('SELECT * FROM todos');
    return rows;
}

// Создать новую задачу
export async function createTodo(title) {
    const [result] = await pool.query('INSERT INTO todos (title, completed) VALUES (?, 0)', [title]);
    return result.insertId; // Возвращаем ID новой задачи
}

// Обновить статус задачи
export async function updateTodoStatus(id, completed) {
    const [result] = await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id]);
    return result.affectedRows; // Возвращаем количество измененных строк
}

// Массовое обновление задач
export async function updateMultipleTodos(todos) {
    for (const todo of todos) {
        await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [todo.completed, todo.id]);
    }
    return { message: 'Все задачи обновлены' };
}

// Сбросить статус всех задач
export async function resetAllTodos() {
    const [result] = await pool.query('UPDATE todos SET completed = 0');
    return result.affectedRows; // Возвращаем количество обновленных строк
}

export default pool;
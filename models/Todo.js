import pool from '../index.js';

class Todo {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM todos');
        return rows;
    }

    static async create(title) {
        const [result] = await pool.query(
            'INSERT INTO todos (title, completed) VALUES (?, ?)', 
            [title, false]
        );
        return result.insertId;
    }

    static async completeTodo(id) {
        await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [true, id]);
    }

    static async delete(id) {
        await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    }
}

export default Todo;

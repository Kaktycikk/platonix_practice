//МОДЕЛЬ РАБОТЫ С ТАБЛИЦЕЙ TODOS В БД
import pool from '../vendor/db.js';

class Todo {//static, потому что они не зависят от экземпляра класса.
    static async getAll() {//Получает все задачи
        const [rows] = await pool.query('SELECT * FROM todos')//для выполнения SQL-запроса.;
        return rows;//Возвращаем массив
    }

    static async create(title) {//Поздает новую задачу
        const [result] = await pool.query(//Выполняет SQL-запрос
            'INSERT INTO todos (title, completed) VALUES (?, ?)', //? – Это плейсхолдеры (защита от SQL-инъекций)
            [title, false]//Значения [title, false] заменяют ?
        );
        return result.insertId;//Возвращает id только что созданной задачи
    }

    static async completeTodo(id, completed) {//Обновляет статус задачи
        await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id]);//completed заменяет ?, например true (1) или false (0). id – ID задачи, которую обновляем.
    }//Ничего не возвращает
    
    static async delete(id) {//Удаляет задачу
        await pool.query('DELETE FROM todos WHERE id = ?', [id]);//Удаляет строку из такблицы, где id совпадает 
    }
}

export default Todo;

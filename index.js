import express from 'express';
import session from 'express-session';
import mysql from 'mysql2';
import MySQLStore from 'express-mysql-session';
import Handlebars from 'handlebars';
import exphbs from 'express-handlebars';
import todoRoutes from './routes/todos.js';
import path from 'path';
import { fileURLToPath } from 'url';



let sets = {
    host: 'platon.teyhd.ru',
    port: 3407,
    user: 'student',
    password: 'studpass',
    database: 'travkina_todo',
    charset : 'utf8mb4_general_ci',   
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const hbs = exphbs.create ({
    defaultLayout: 'main',
    extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));



app.use('/',todoRoutes)

const pool = mysql.createPool(sets).promise();
const PORT = process.env.PORT || 3000; 

export async function start() {
    try {
        const connection = await pool.getConnection();
        console.log('Успешное подключение к БД');
        connection.release();
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    } 
    catch (err) {
        console.error('Ошибка подключения к БД:', err);
    }
}

export default pool;
start()
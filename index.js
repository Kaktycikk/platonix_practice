import {mlog} from './vendor/logs.js'
process.on('uncaughtException', (err) => {
    mlog('Глобальный косяк приложения!!!', err.stack);
})


import express from 'express';
import exphbs from 'express-handlebars';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import unixTime from 'unix-time';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import pool  from './vendor/db.js';
import todoRoutes from './routes/todos.js';



//Создание Express-приложения
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();//Создание экземпляра Express
const hbs = exphbs.create ({//Настройка Handlebars
    defaultLayout: 'main',//Главный шаблон
    extname: 'hbs',
})
//Настройка Express
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
//Middleware
app.use(express.urlencoded({extended: true}))//Позволяет читать POST-данные из req.body
app.use(express.static(path.join(__dirname, 'public')));//Раздает файлы из public/ (CSS, JS, изображения)
app.use('/',todoRoutes)//Использует маршруты из todos.js

//Подключение к БД и запуск сервера

const PORT = process.env.PORT || 3000; 

export async function start() {
    try {
        const connection = await pool.getConnection();//Проверяет соединение с БД
        console.log('Успешное подключение к БД');
        connection.release();
        app.listen(PORT, () => {//Запускает сервер
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    } 
    catch (err) {
        console.error('Ошибка подключения к БД:', err);
    }
}

start()
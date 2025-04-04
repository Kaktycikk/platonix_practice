$(document).ready(function () {//Функция гарантирует, что код выполнится только после полной загрузки страницы.
    $('#save-all').click(function () {//Назначаем обработчик событий при клике на кнопку с id="save-all"
        const todos = [];//Массив будет хранить список задач (их ID и статус выполнения)

        $('input[type="checkbox"]').each(function () {//Используем функцию .each(), которая перебирает все чекбоксы на странице
            const id = $(this).closest('li').data('id');//находим ближайший родительский <li>, который содержит задачу.
            const completed = $(this).prop('checked') ? 1 : 0; //Проверяем, отмечен ли чекбокс (true/false).Если да, устанавливаем completed = 1, иначе completed = 0
            todos.push({ id, completed });//Добавляем объект { id, completed } в массив todos
        });
        //Отправка данных на сервер
        $.ajax({
            url: '/update', //Указываем URL, куда отправляется запрос
            method: 'PUT',//Метод запроса PUT (используется для обновления данных)
            contentType: 'application/json',//Формат отправляемых данных — JSON
            data: JSON.stringify({ todos }),  //Преобразуем массив todos в JSON-строку и отправляем.
            success: function () {//Если запрос успешно выполнен, выполняем следующие действия
                $('input[type="checkbox"]:checked').closest('li').find('span').addClass('completed');//Всем задачам, у которых чекбокс отмечен (:checked), добавляем class="completed" к <span>
                alert('Задачи обновлены');//Показываем пользователю всплывающее окно с сообщением 
            },
            error: function (xhr) {
                console.error('Ошибка при сохранении задач:', xhr.responseText);
                alert('Ошибка при сохранении задач');
            }
        });
    });

    $('#reset-all').click(function () {//Назначаем обработчик событий при клике на кнопку сброса (id="reset-all")
        $.ajax({//Отправляем AJAX-запрос PUT /reset-all (сервер сбросит статус всех задач)
            url: '/reset-all', 
            method: 'PUT',
            success: function () {
                $('input[type="checkbox"]').prop('checked', false); //Снимаем все галочки у checkbox
                $('span').removeClass('completed');  //Удаляем класс completed
            },
            error: function (xhr) {
                console.error('Ошибка при сбросе статуса задач:', xhr.responseText);
                alert('Ошибка при сбросе статуса задач');
            }
        });
    });
});

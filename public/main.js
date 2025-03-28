$(document).ready(function () {
    $('#save-all').click(function () {
        const todos = [];

        $('input[type="checkbox"]').each(function () {
            const id = $(this).closest('li').data('id');
            const completed = $(this).prop('checked') ? 1 : 0; 
            todos.push({ id, completed });
        });

        $.ajax({
            url: '/update', 
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ todos }),  
            success: function () {
                $('input[type="checkbox"]:checked').closest('li').find('span').addClass('completed');
                alert('Задачи обновлены');
            },
            error: function (xhr) {
                console.error('Ошибка при сохранении задач:', xhr.responseText);
                alert('Ошибка при сохранении задач');
            }
        });
    });

    $('#reset-all').click(function () {
        $.ajax({
            url: '/reset-all', 
            method: 'PUT',
            success: function () {
                $('input[type="checkbox"]').prop('checked', false); 
                $('span').removeClass('completed');  
            },
            error: function (xhr) {
                console.error('Ошибка при сбросе статуса задач:', xhr.responseText);
                alert('Ошибка при сбросе статуса задач');
            }
        });
    });
});

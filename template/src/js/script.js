$(document).ready(function(){
    $('.dual-panel--up').click(function() {
        $(this).addClass('dual-panel--active');
        // 1sec -> when the height animation is completed
        setTimeout(function () {
            $('.dual-panel__link').hide();
            $('.dual-panel--down').hide();
            $('.search').removeClass('search--hide');
            setTimeout(function () {
                // $('.search-form').removeClass('search-form--hide');
                $('.search-result').show();
                // $('.search-form__input').select();
            }, 10);
        }, 1000);
    });
    $('.search-input__input').keypress(function() {
        $('.search-input').addClass('animation');
        console.log($(this).val());
        if(!$(this).val()){
            $('.search-input').removeClass('animation');
        }
    });
});

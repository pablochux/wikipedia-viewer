$(document).ready(function(){
    $('.dual-panel--up').click(function() {
        $(this).addClass('dual-panel--active');
        // 1sec -> when the height animation is completed
        setTimeout(function () {
            $('.dual-panel__link').hide();
            $('.dual-panel--down').hide();
            $('.search').removeClass('search--hide');
            setTimeout(function () {
                $('.search-form').removeClass('search-form--hide');
                $('.search-form__input').select();
            }, 10);
        }, 1000);
    });
    // Search-form move up animation
    $('.search-form__icon').click(function() {
        $('.search-form').addClass('search-form--expanded');
        // Wikipedia API
        performWikiSearch($('.search-form__input').val());
        // Wikipedia API
    });
});


function performWikiSearch(search){
    var api = "http://en.wsikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";
    $.ajax({
        type: "GET",
        url: api + search + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function(data){
            console.log(data);
        },
        error: function(data){
            console.log(data);
            $('.search-error').show().addClass('search-error--active');
        }
    });
}

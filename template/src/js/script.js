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
        console.log($('.search-form__input').val());
        performWikiSearch($('.search-form__input').val());
        // Wikipedia API
    });
});


function performWikiSearch(search){
    var api = "http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";
    $.ajax({
        type: "GET",
        url: api + search + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function(data){
            console.log(data);
            displayArticles(data);
        },
        error: function(data){
            console.log(data);
            $('.search-error').show().addClass('search-error--active');
        }
    });
}

function displayArticles(data) {
    removeArticles();
    var articlesLayout = "";
    for(var id in data.query.pages){
        console.log(data.query.pages[id].title);
        console.log(data.query.pages[id].extract);
        $('.search-result').append("<div class='search-result-item'><a href='https://en.wikipedia.org/wiki/" + data.query.pages[id].title + "'><h1 class='search-result-item__title'>" + data.query.pages[id].title + "</h1><p class='search-result-item__body'>" + data.query.pages[id].extract + "</p></a></div>");
    }
    console.log(articlesLayout);
    return articlesLayout;
}

function removeArticles() {
    $('.search-result-item').remove();
}

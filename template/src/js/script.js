// -------------------
// functions
// -------------------
function displaySearchError(text) {
    $('.search-result').append('<div class="search-error u-center"><h1 class="search-error__header">' + text + '</h1></div>');
}
function wikipediaApiSearch(search){
    var api = "http://en.wkkikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";
    $.ajax({
        type: "GET",
        url: api + search + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function(data){
            $('.search-result').empty(); // Remove previous articles
            console.log(data);
            console.log('Test');
            if (typeof data.query == 'object') {
                displayArticles(data);
                $('.footer').removeClass('footer--hide');
            }else{
                console.log('NOTHING');
                displaySearchError('The search did not provide any results.');
            }
        },
        error: function(data){
            console.log(data);
            displaySearchError('The search could not be perfomed. </h1><h3 class="search-error__header">Please, try again in a few moments...</h3>');
        }
    });
}

function displayArticles(data) {
    for(var id in data.query.pages){
        console.log(data.query.pages[id].title);
        console.log(data.query.pages[id].extract);
        $('.search-result').append("<div class='search-result-item'><a href='https://en.wikipedia.org/wiki/" + data.query.pages[id].title + "'><h1 class='search-result-item__title'>" + data.query.pages[id].title + "</h1><p class='search-result-item__body'>" + data.query.pages[id].extract + "</p></a></div>");
    }
    // Add random article button
    $('.search-result').append('<a href="https://en.wikipedia.org/wiki/Special:Random" class="search-result-item search-result-item--random-article u-center">Random Wikipedia Article</a>');
}

function performWikiSearch(inputVal){
    if(inputVal){
        $('.search-form').addClass('search-form--expanded');
        // Wikipedia API
        console.log('Input value: ' + inputVal);
        wikipediaApiSearch($('.search-form__input').val());
    }else{
        $('.search-form__input').addClass('search-form__input--empty');
        console.log('Without value in the search-form__input');
    }
}

// -------------------
// Main script
// -------------------
$(document).ready(function(){
    $('.dual-panel--search').click(function() {
        $(this).addClass('dual-panel--active');
        $('.dual-panel--search').removeClass('dual-panel--search');
        // 1sec -> when the height animation is completed
        setTimeout(function () {
            $('.dual-panel__link').hide();
            $('.dual-panel--random-article').hide();
            $('.search').removeClass('search--hide');
            console.log(this);
            setTimeout(function () {
                $('.search-form').removeClass('search-form--hide');
                $('.search-form__input').select();
            }, 10);
        }, 1000);
    });
    // Search perfomed
    $('.search-form__icon').click(function() {
        performWikiSearch($('.search-form__input').val());
    });
    $("input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            performWikiSearch($('.search-form__input').val());
        }
    });
});

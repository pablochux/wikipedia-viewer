// -------------------
// functions
// -------------------
function displaySearchError(text) {
    search_result.append('<div class="search-error u-center"><h1 class="search-error__header">' + text + '</h1></div>');
}

function wikipediaApiSearch(search) {
    var api = "http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";
    $.ajax({
        type: "GET",
        url: api + search + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function(data) {
            search_result.empty(); // Remove previous articles
            console.log(data);
            console.log('Test');
            if (typeof data.query == 'object') {
                displayArticles(data);
            } else {
                console.log('NOTHING');
                displaySearchError('The search did not provide any results.');
            }
            footer.removeClass('footer--hide');
        },
        error: function(data) {
            displaySearchError('The search could not be perfomed. </h1><h3 class="search-error__header">Please, try again in a few moments...</h3>');
        }
    });
}
/*
 *   displayArticles -> query the data parameter (will be a json object from the ajax request)
 *                      appending all the useful information intro search-result.
 *                      And then, add the random-article button in the bottom of the page
 *
 *
 */
function displayArticles(data) {
    for (var id in data.query.pages) {
        // console.log(data.query.pages[id].title);
        // console.log(data.query.pages[id].extract);
        search_result.append("<div class='search-result-item'><a href='https://en.wikipedia.org/wiki/" + data.query.pages[id].title + "'><h1 class='search-result-item__title'>" + data.query.pages[id].title + "</h1><p class='search-result-item__body'>" + data.query.pages[id].extract + "</p></a></div>");
    }
    // Add random article button
    search_result.append('<a href="https://en.wikipedia.org/wiki/Special:Random" class="search-result-item search-result-item--random-article u-center">Random Wikipedia Article</a>');
}

function performWikiSearch(inputVal) {
    if (inputVal) {
        // Wikipedia API
        // console.log('Input value: ' + inputVal);
        wikipediaApiSearch(inputVal);
    } else {
        search_input.addClass('search-form__input--empty');
        // console.log('Without value in the search-form__input');
    }
}
// Usual elements
var search = $('.search'),
    search_form = $('.search-form'),
    search_input = $('.search-form__input'),
    search_icon = $('.search-form__icon'),
    search_result = $('.search-result');

var dualPanel_search = $('.dual-panel--search'),
    dualPanel_link = $('.dual-panel__link'),
    dualPanel_random = $('.dual-panel--random-article');

var footer = $('.footer');

// Other variables
var keyTimeout;
var doneTyppingInterval = 400; // in ms
var doneTypping = false;

// -------------------
// Main script
// -------------------
$(document).ready(function() {
    /*
     * Home page with a dual-panel:
     *   Search: dual-panel--search will transform and adopt all the body width,
     *           moving the dual-panel--random-article to the back, and then hide it.
     *
     *   Random Article -> will go to a Wikipedia Random Article
     */
    dualPanel_search.click(function() {
        $(this).addClass('dual-panel--active').removeClass('dual-panel--search');
        // 1sec -> when the height animation is completed
        setTimeout(function() {
            dualPanel_link.hide();
            dualPanel_random.hide();
            search.removeClass('search--hide');
            // console.log(this);
            setTimeout(function() {
                search_form.removeClass('search-form--hide');
                search_input.select();
            }, 10);
        }, 1000);
    });

    /*
     *   The search will be perfomed when the user stops typing
     *   The click in the icon or the enter key is not needed.
     *
     *
     */
    // Experiment
    search_icon.click(function() {
        performWikiSearch(search_input.val());
    });
    // End Experiment

    // Experiment
    // When keyup (suelta la tecla) -> empieza el cronometro para ver si pasan los segundos (si pasan, se hace la búsqueda en wikipedia)
    // Pero si vuelve a presionar una tecla (keydown) -> se reinicia el cronometro y no se hace una búsqueda

    search_input.keyup(function() {
        // Expand the search-form after a key is pressed
        search_form.addClass('search-form--expanded');

        // Deletes all the search-result-items when the input is empty
        if (!search_input.val()) {
            search_result.empty();
            search_form.removeClass('search-form--expanded');
        }

        // Se pone un contador para comprobar si se presiona otra tecla, en el caso de que no
        // se presione ninguna, el valor de doneTypping será verdadero por lo que se hará la búsqueda
        keyTimeout = setTimeout(function() {
            doneTypping = true;
        }, doneTyppingInterval);

        setTimeout(function() {
            if (doneTypping) {
                performWikiSearch(search_input.val());
            }
        }, doneTyppingInterval + 1);
    });

    search_input.keydown(function() {
        doneTypping = false;
        clearTimeout(keyTimeout);
    });
    // End Experiment
});

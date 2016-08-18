$(document).ready(function(){
    $('.dual-panel--up').click(function() {
        $(this).addClass('dual-panel--active');
        // 1sec -> when the height animation is completed
        setTimeout(function () {
            $('.dual-panel__link').hide();
            $('.dual-panel--down').hide();
        }, 1000);
    });
});

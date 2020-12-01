/* global SimpleBar */
function ui() {
    // Select UI
    $.fn.select2.defaults.set('width', '100%');
    $('.select-ui').each(function() {
        const el = $(this);
        const selectUI = el.select2({
            placeholder: el.data('placeholder')
        });

        // Update UI Scroll - Open dropdown
        selectUI.on('select2:open', function() {
            const id = $('.select2-results  > .select2-results__options').attr('id');
            $('.select2-results')
                .attr({ id: id + '-group' })
                .queue(function(next) {
                    new SimpleBar($('#' + id + '-group')[0]);
                    next();
                });
        });
    });

    // Range UI
    $('.range-ui').each(function(key) {
        const el = $(this);
        el.attr({ id: 'range-ui-' + key }).queue(function(next) {
            $('#range-ui-' + key).ionRangeSlider();
            next();
        });
    });

    // Scroll
    $('.scroll-ui').each(function(key) {
        const el = $(this);
        el.attr({ id: 'scroll-ui-' + key }).queue(function(next) {
            new SimpleBar($('#' + el.attr('id'))[0]);
            next();
        });
    });

    // File Browse UI
    $('.file-ui .file-ui-input').change(function(e) {
        if (typeof e.target.files[0] !== 'undefined') {
            const fileName = e.target.files[0].name;
            $(this)
                .siblings('.file-ui-label')
                .text(fileName);
        }
    });

    // Parallax
    $('[data-paroller-factor]').paroller();
}

// Image svg
function imgSVG() {
    $('img.svg').each(function() {
        const $img = $(this);
        const imgID = $img.attr('id');
        const imgClass = $img.attr('class');
        const imgURL = $img.attr('src');

        $.get(
            imgURL,
            function(data) {
                // Get the SVG tag, ignore the rest
                let $svg = $(data).find('svg');

                // Add replaced image's ID to the new SVG
                if (typeof imgID !== 'undefined') $svg = $svg.attr('id', imgID);

                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== 'undefined') $svg = $svg.attr('class', imgClass + ' replaced-svg');

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);
            },
            'xml'
        );
    });
}

function gotoTop() {
    const topTop = $('.toTop');
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) topTop.addClass('active');
        else topTop.removeClass('active');
    });
    topTop.click(function() {
        $('body,html').animate(
            {
                scrollTop: 0
            },
            500
        );
        return false;
    });
}

function init() {
    // Base
    // ui();
    // Image SVG
    imgSVG();
    // Go to top
    gotoTop();

    // $(window).on("debouncedresize", function (event) {
    //     // ...
    // });
    if (1 == 2) ui();
}

$('body').imagesLoaded(function() {
    init();
    $('body').addClass('loaded');
    $('.pageLoad').fadeOut();
});

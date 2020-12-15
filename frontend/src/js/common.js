// eslint-disable-next-line no-console
console.log('Common All Page');
(function($) {
    $(function() {
        $('.form-validate').each((i, val) => {
            $(val).validate();
        });
    });
})(jQuery);

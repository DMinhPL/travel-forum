// eslint-disable-next-line no-console
console.log('Common All Page');
(function($) {
    function ui_matchHeight() {
        $('.featuredPanel_item_content').matchHeight();
    }
    function ratingColor(dom) {
        const $rating = $(dom);
        $rating.each((i, val) => {
            const score = parseFloat($(val).text());
            if (score < 6) $(val).css({ backgroundColor: '#ff5a5a' });
            else if (score <= 7 && score >= 6) $(val).css({ backgroundColor: '#E88100' });
            else if (score < 8 && score > 7) $(val).css({ backgroundColor: '#DBAB0B' });
            else $(val).css({ backgroundColor: '#E8E100' });
        });
    }
    $(function() {
        const msg = 'This field is required.';

        $('.form-validate').each((i, val) => {
            $.validator.addMethod('pwcheck', function(value) {
                return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
            });
            //Email validation
            $.validator.addMethod(
                'i_mail',
                function(value, element) {
                    return this.optional(element) || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/i.test(value);
                },
                'Please enter a valid email address.'
            );
            $(val).validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                        i_mail: true,
                    },
                    password: {
                        required: true,
                        minlength: 8,
                        pwcheck: true,
                    },
                    confirmPassword: {
                        required: true,
                        minlength: 8,
                        equalTo: '#password',
                    },
                },
                messages: {
                    email: {
                        required: msg,
                    },
                    password: {
                        required: msg,
                        minlength: 'Please lengthen this text to 8 or more characters',
                        pwcheck: 'Contain upper case, lowercase and either a number or symbol',
                    },
                    confirmPassword: {
                        required: msg,
                        minlength: 'Please match to password above',
                        equalTo: 'The confirm password is not match',
                    },
                },
            });
        });
        new WOW().init();
        ui_matchHeight();
        ratingColor('.customer-rating');
        ratingColor('.featuredPanel_rating');
    });
})(jQuery);

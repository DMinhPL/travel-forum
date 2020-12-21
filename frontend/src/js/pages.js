(function($) {
    function detail_prop_gallery_banner(img) {
        //facncy-box
        $(`[data-fancybox=${img}]`).fancybox({
            aspectRatio: true,
            width: 900,
            // transitionEffect: "circular",
            // buttons: ['share', 'zoom', 'download', 'close'],
            // btnTpl: {
            //     download:
            //         '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;">' +
            //         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg>' +
            //         '</a>',

            //     zoom:
            //         '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}">' +
            //         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg>' +
            //         '</button>',

            //     close:
            //         '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
            //         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg>' +
            //         '</button>',
            //     // Arrows
            //     smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}">' + '<svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg>' + '</button>',
            // },
            hash: true,
            share: {
                url: function(instance, item) {
                    if (item.type === 'inline' && item.contentType === 'video') return item.$content.find('source:first').attr('src');

                    return item.src;
                },
            },
            thumbs: {
                autoStart: false, // Display thumbnails on opening
            },
        });
    }

    function upload_avatar(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('.avatar-upload #imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('.avatar-upload #imagePreview').hide();
                $('.avatar-upload #imagePreview').fadeIn(650);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(function() {
        $('.avatar-upload #imageUpload').change(function() {
            upload_avatar(this);
        });
        $('.grid-gallery').masonry();
    });
})(jQuery);

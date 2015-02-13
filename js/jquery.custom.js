/**
 * Created by thaimp on 2/5/2015.
 */
/*-----------------------------------------------------------------------------------

 Custom JS - All front-end jQuery

 -----------------------------------------------------------------------------------*/


/*-----------------------------------------------------------------------------------*/
/*	Let's get ready!
 /*-----------------------------------------------------------------------------------*/

jQuery(document).ready(function($) {

    function divideList(ele, num) {
        var list = ele,
            listNum = parseInt(list.length/num),
            listLeft = list.length%num;
        if (listLeft != 0) {
            ++listNum
        };

        for(var i = 0; i < list.length; i+=listNum) {
            list.slice(i, i+listNum).wrapAll("<li class='new'><ul></ul></li>");
        }
    }

    $(".box .border-box").each(function() {
        divideList($(this).find('ul li'), 2);
    })


    //jQuery('#slider').animate({height: 'auto'}, 200);

    if (jQuery.browser.msie && jQuery.browser.version == '7.0' )
        jQuery('body').addClass('ie7');

    if(jQuery('body').hasClass('ie7')) {

        jQuery('input#submit, .contactform button').css({
            border: '1px solid #d5d5d5'
        });

    }

    $('#fancybox-loading').hide();

    /*-----------------------------------------------------------------------------------*/
    /*	Superfish Settings - http://users.tpg.com.au/j_birch/plugins/superfish/
     /*-----------------------------------------------------------------------------------*/

    jQuery('#primary-nav ul').superfish({
        delay: 200,
        animation: {opacity:'show', height:'show'},
        speed: 'fast',
        autoArrows: true,
        dropShadows: false
    });

    /*-----------------------------------------------------------------------------------*/
    /*	Slider
     /*-----------------------------------------------------------------------------------*/

    function tz_sliderInit() {

        if(jQuery().sudoSlider || jQuery().slides) {

            var thumbs = jQuery('#pagination-slider .pagination li');

            thumbs.find('a').click( function() {

                thumbs.stop().animate({
                    marginTop: 25
                }, { duration: 200, queue: false });

                if(jQuery('body').hasClass('tz-light')) {

                    jQuery(this).parent().stop().animate({
                        marginTop: 21
                    }, { duration: 200, queue: false });

                } else {

                    jQuery(this).parent().stop().animate({
                        marginTop: 20
                    }, { duration: 200, queue: false });

                }

                return false;
            });


            jQuery("#slider").slides({
                generatePagination: false,
                autoHeight: false,
                width: 940
            });


            // Portfolio slider
            jQuery(".slider").slides({
                generatePagination: true,
                effect: 'fade',
                autoHeight: true,
                bigTarget: true,
                preload: true,
                preloadImage: jQuery("#loader").attr('data-loader')
            });

        }

        if(jQuery().jcarousel) {

            jQuery('#pagination-slider ul').jcarousel({
                scroll: 1
            });

        }


    }

    tz_sliderInit();

    /*-----------------------------------------------------------------------------------*/
    /*	Titles
     /*-----------------------------------------------------------------------------------*/

    var title = jQuery('.title-wrap');

    if(!jQuery('body').hasClass('single')) {
        title.hover( function () {
            jQuery(this).addClass('current');
        }, function () {
            jQuery(this).removeClass('current');
        });
    }

    /*-----------------------------------------------------------------------------------*/
    /*	PrettyPhoto Lightbox
     /*-----------------------------------------------------------------------------------*/

    function tz_fancybox() {

        if(jQuery().fancybox) {
            jQuery("a.lightbox").fancybox({
                'transitionIn'	:	'fade',
                'transitionOut'	:	'fade',
                'speedIn'		:	300,
                'speedOut'		:	300,
                'overlayShow'	:	true,
                'autoScale'		:	true,
                'titleShow'		: 	false,
                'margin'		: 	10
            });
        }
    }

    tz_fancybox();

    /*-----------------------------------------------------------------------------------*/
    /*	Portfolio Sorting
     /*-----------------------------------------------------------------------------------*/

    if (jQuery().quicksand) {

        (function($) {

            $.fn.sorted = function(customOptions) {
                var options = {
                    reversed: false,
                    by: function(a) {
                        return a.text();
                    }
                };

                $.extend(options, customOptions);

                $data = jQuery(this);
                arr = $data.get();
                arr.sort(function(a, b) {

                    var valA = options.by($(a));
                    var valB = options.by($(b));

                    if (options.reversed) {
                        return (valA < valB) ? 1 : (valA > valB) ? -1 : 0;
                    } else {
                        return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
                    }

                });

                return $(arr);

            };

        })(jQuery);

        jQuery(function() {

            var read_button = function(class_names) {

                var r = {
                    selected: false,
                    type: 0
                };

                for (var i=0; i < class_names.length; i++) {

                    if (class_names[i].indexOf('selected-') == 0) {
                        r.selected = true;
                    }

                    if (class_names[i].indexOf('segment-') == 0) {
                        r.segment = class_names[i].split('-')[1];
                    }
                };

                return r;

            };

            var determine_sort = function($buttons) {
                var $selected = $buttons.parent().filter('[class*="selected-"]');
                return $selected.find('a').attr('data-value');
            };

            var determine_kind = function($buttons) {
                var $selected = $buttons.parent().filter('[class*="selected-"]');
                return $selected.find('a').attr('data-value');
            };

            var $preferences = {
                duration: 500,
                adjustHeight: 'auto'
            }

            var $list = jQuery('#items');
            var $data = $list.clone();

            var $controls = jQuery('#controls');

            $controls.each(function(i) {

                var $control = jQuery(this);
                var $buttons = $control.find('a');

                $buttons.bind('click', function(e) {

                    var $button = jQuery(this);
                    var $button_container = $button.parent();
                    var button_properties = read_button($button_container.attr('class').split(' '));
                    var selected = button_properties.selected;
                    var button_segment = button_properties.segment;

                    if (!selected) {

                        $buttons.parent().removeClass();
                        $button_container.addClass('selected-' + button_segment);

                        var sorting_type = determine_sort($controls.eq(1).find('a'));
                        var sorting_kind = determine_kind($controls.eq(0).find('a'));

                        if (sorting_kind == 'all') {
                            var $filtered_data = $data.find('li');
                        } else {
                            var $filtered_data = $data.find('li.' + sorting_kind);
                        }

                        var $sorted_data = $filtered_data.sorted({
                            by: function(v) {
                                return parseInt(jQuery(v).find('.count').text());
                            }
                        });

                        $list.quicksand($sorted_data, $preferences, function () {
                            tz_fancybox();
                        });

                    }

                    e.preventDefault();

                });

            });

        });

    }

    /*-----------------------------------------------------------------------------------*/
    /*	Portfolio Dropdown
     /*-----------------------------------------------------------------------------------*/

    var drop = jQuery('#top');

    drop.toggle( function () {

        jQuery(this).find('ul').css({
            display: 'block'
        });

    }, function () {

        jQuery(this).find('ul').css({
            display: 'none'
        });

    });

    drop.find('ul li a').click( function() {

        var name = jQuery(this).text();

        drop.find('.top-link').text(name);

    });

    /*-----------------------------------------------------------------------------------*/
    /*	Additional Page Scripts
     /*-----------------------------------------------------------------------------------*/

    $(document).on('click', '.classes-section .class .class-name', function() {
        $('.classes-section .class .class-name').removeClass('expanded');
        $(this).toggleClass('expanded');
        $('.classes-section .class .class-name').not(this).next('.class-entry-content').stop(true,true).slideUp();
        $(this).next('.class-entry-content').stop(true,true).slideToggle();
    });

    $('.tier').each(function() {
        var $tier = $(this),
            classCount = $tier.find('.class').length;

        if (classCount % 2 != 0) {
            $tier.find('.class:last').addClass('centered');
        }
    });

    // Training Pages Accordion
    $(document).on('click', '.accordion-item .toggle-title', function() {
        var $title = $(this),
            $accordion = $title.parents('.accordion-item'),
            $content = $accordion.find('.item-content');

        if ( !$('.accordion-item .item-content').is(':animated') ) {
            $title.toggleClass('expanded');
            $content.stop().slideToggle();
        }

        return false;
    });

    $(window).load(function() {

        $('.tier').each(function() {
            var $tier = $(this),
                classMaxH = 0;

            $tier.find('.class').each(function() {
                var classH = $(this).height();
                if (classH > classMaxH) {
                    classMaxH = classH;
                }
            });
            $tier.find('.class').css('min-height', classMaxH);
        });
    });

    /*-----------------------------------------------------------------------------------*/
    /*	All done!
     /*-----------------------------------------------------------------------------------*/

});
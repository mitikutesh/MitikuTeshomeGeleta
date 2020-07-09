AOS.init({
    duration: 800,
    easing: 'slide',
    once: false
});

jQuery(document).ready(function ($) {

    "use strict";
// stepper 
    let curOpen;

    curOpen = $('.step')[0];

    $('.next-btn').on('click', function () {
        let cur = $(this).closest('.step');
        let next = $(cur).next();
        $(cur).addClass('minimized');
        setTimeout(function () {
            $(next).removeClass('minimized');
            curOpen = $(next);
        }, 400);
    });

    $('.close-btn').on('click', function () {
        let cur = $(this).closest('.step');
        $(cur).addClass('minimized');
        curOpen = null;
    });

    $('.step .step-content').on('click', function (e) {
        e.stopPropagation();
    });

    $('.step').on('click', function () {
        if (!$(this).hasClass("minimized")) {
            curOpen = null;
            $(this).addClass('minimized');
        } else {
            let next = $(this);
            if (curOpen === null) {
                curOpen = next;
                $(curOpen).removeClass('minimized');
            } else {
                $(curOpen).addClass('minimized');
                setTimeout(function () {
                    $(next).removeClass('minimized');
                    curOpen = $(next);
                }, 300);
            }
        }
    });
// 	var stepper1Node = document.querySelector('#stepper2')
// 	// var stepper1 = new Stepper(document.querySelector('#stepper1'))
//
// 	stepper1Node.addEventListener('show.bs-stepper', function (event) {
// 		console.warn('show.bs-stepper', event)
// 	})
// 	stepper1Node.addEventListener('shown.bs-stepper', function (event) {
// 		console.warn('shown.bs-stepper', event)
// 	})
//
// 	var stepper2 = new Stepper(document.querySelector('#stepper2'), {
// 		linear: false,
// 		animation: true,
//		
// 	})
    // var stepper3 = new Stepper(document.querySelector('#stepper3'), {
    // 	animation: true
    // })
    // var stepper4 = new Stepper(document.querySelector('#stepper4'))

    // $(".loader").delay(1000).fadeOut("slow");
    //  $("#overlayer").delay(1000).fadeOut("slow");	


    var siteMenuClone = function () {

        $('.js-clone-nav').each(function () {
            var $this = $(this);
            $this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
        });


        setTimeout(function () {

            var counter = 0;
            $('.site-mobile-menu .has-children').each(function () {
                var $this = $(this);

                $this.prepend('<span class="arrow-collapse collapsed">');

                $this.find('.arrow-collapse').attr({
                    'data-toggle': 'collapse',
                    'data-target': '#collapseItem' + counter,
                });

                $this.find('> ul').attr({
                    'class': 'collapse',
                    'id': 'collapseItem' + counter,
                });

                counter++;

            });

        }, 1000);

        $('body').on('click', '.arrow-collapse', function (e) {
            var $this = $(this);
            if ($this.closest('li').find('.collapse').hasClass('show')) {
                $this.removeClass('active');
            } else {
                $this.addClass('active');
            }
            e.preventDefault();

        });

        $(window).resize(function () {
            var $this = $(this),
                w = $this.width();

            if (w > 768) {
                if ($('body').hasClass('offcanvas-menu')) {
                    $('body').removeClass('offcanvas-menu');
                }
            }
        })

        $('body').on('click', '.js-menu-toggle', function (e) {
            var $this = $(this);
            e.preventDefault();

            if ($('body').hasClass('offcanvas-menu')) {
                $('body').removeClass('offcanvas-menu');
                $this.removeClass('active');
            } else {
                $('body').addClass('offcanvas-menu');
                $this.addClass('active');
            }
        })

        // click outisde offcanvas
        $(document).mouseup(function (e) {
            var container = $(".site-mobile-menu");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('offcanvas-menu')) {
                    $('body').removeClass('offcanvas-menu');
                }
            }
        });
    };
    siteMenuClone();


    var sitePlusMinus = function () {
        $('.js-btn-minus').on('click', function (e) {
            e.preventDefault();
            if ($(this).closest('.input-group').find('.form-control').val() != 0) {
                $(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
            } else {
                $(this).closest('.input-group').find('.form-control').val(parseInt(0));
            }
        });
        $('.js-btn-plus').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
        });
    };
    // sitePlusMinus();


    var siteSliderRange = function () {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 500,
            values: [75, 300],
            slide: function (event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        $("#amount").val("$" + $("#slider-range").slider("values", 0) +
            " - $" + $("#slider-range").slider("values", 1));
    };
    // siteSliderRange();


    var siteCarousel = function () {
        if ($('.nonloop-block-13').length > 0) {
            $('.nonloop-block-13').owlCarousel({
                center: false,
                items: 1,
                loop: true,
                stagePadding: 0,
                margin: 0,
                autoplay: true,
                nav: true,
                navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
                responsive: {
                    600: {
                        margin: 0,
                        nav: true,
                        items: 2
                    },
                    1000: {
                        margin: 0,
                        stagePadding: 0,
                        nav: true,
                        items: 3
                    },
                    1200: {
                        margin: 0,
                        stagePadding: 0,
                        nav: true,
                        items: 4
                    }
                }
            });
        }

        $('.slide-one-item').owlCarousel({
            center: false,
            items: 1,
            loop: true,
            stagePadding: 0,
            margin: 0,
            smartSpeed: 1000,
            autoplay: true,
            pauseOnHover: false,
            autoHeight: true,
            nav: false,
            navText: ['<span class="icon-keyboard_arrow_left">', '<span class="icon-keyboard_arrow_right">']
        });


    };
    siteCarousel();

    var siteStellar = function () {
        $(window).stellar({
            responsive: false,
            parallaxBackgrounds: true,
            parallaxElements: true,
            horizontalScrolling: false,
            hideDistantElements: false,
            scrollProperty: 'scroll'
        });
    };
    // siteStellar();


    var siteDatePicker = function () {

        if ($('.datepicker').length > 0) {
            $('.datepicker').datepicker();
        }

    };
    siteDatePicker();

    var siteSticky = function () {
        $(".js-sticky-header").sticky({topSpacing: 0});
    };
    siteSticky();

    // navigation
    var OnePageNavigation = function () {
        var navToggler = $('.site-menu-toggle');
        $("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a", function (e) {
            e.preventDefault();
            var uri = this.href;
            var hash = this.hash;
            var ofs = $(hash).offset();
            // prop, speed, easing, callback
            if ((hash !== "") && (ofs !== undefined)) {
                $('html, body').animate({
                    'scrollTop': ofs.top
                }, 600, 'easeInOutExpo', function () {
                    window.location.href = uri;
                });
            } else {
                window.location.href = uri;
            }

        });
    };
    OnePageNavigation();

    var siteScroll = function () {


        $(window).scroll(function () {

            var st = $(this).scrollTop();

            if (st > 100) {
                $('.js-sticky-header').addClass('shrink');
            } else {
                $('.js-sticky-header').removeClass('shrink');
            }

        })

    };
    siteScroll();


    var siteIstotope = function () {
        /* activate jquery isotope */
        var $container = $('#posts').isotope({
            itemSelector: '.item',
            isFitWidth: true
        });

        $(window).resize(function () {
            $container.isotope({
                columnWidth: '.col-sm-3'
            });
        });

        $container.isotope({filter: '*'});

        // filter items on button click
        $('#filters').on('click', 'button', function (e) {
            e.preventDefault();
            var filterValue = $(this).attr('data-filter');
            $container.isotope({filter: filterValue});
            $('#filters button').removeClass('active');
            $(this).addClass('active');
        });
    }

    siteIstotope();


    $('.fancybox').on('click', function () {
        var visibleLinks = $('.fancybox');

        $.fancybox.open(visibleLinks, {}, visibleLinks.index(this));

        return false;
    });

});

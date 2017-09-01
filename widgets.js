( function( $ ) {
	var body, masthead, menuToggle, siteNavigation, socialNavigation, siteHeaderMenu, resizeTimer, scrollTimer, searchToggle, siteSearch;

	function initMainNavigation( container ) {

		// Add dropdown toggle that displays child menu items.
		var dropdownToggle = $( '<button />', {
			'class': 'dropdown-toggle',
			'aria-expanded': false
		} ).append( $( '<span />', {
			'class': 'screen-reader-text',
			text: screenReaderText.expand
		} ) );

		container.find( '.menu-item-has-children > a' ).after( dropdownToggle );

		// Toggle buttons and submenu items with active children menu items.
		container.find( '.current-menu-ancestor > button' ).addClass( 'toggled-on' );
		container.find( '.current-menu-ancestor > .sub-menu' ).addClass( 'toggled-on' );

		// Add menu items with submenus to aria-haspopup="true".
		container.find( '.menu-item-has-children' ).attr( 'aria-haspopup', 'true' );

		container.find( '.dropdown-toggle' ).click( function( e ) {
			var _this            = $( this ),
				screenReaderSpan = _this.find( '.screen-reader-text' );

			e.preventDefault();
			_this.toggleClass( 'toggled-on' );
			_this.next( '.children, .sub-menu' ).toggleClass( 'toggled-on' );

			// jscs:disable
			_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
			// jscs:enable
			screenReaderSpan.text( screenReaderSpan.text() === screenReaderText.expand ? screenReaderText.collapse : screenReaderText.expand );
		} );
	}
	initMainNavigation( $( '.main-navigation' ) );

	masthead         = $( '#masthead' );
	menuToggle       = masthead.find( '#menu-toggle' );
	siteHeaderMenu   = masthead.find( '#site-header-menu' );
	siteNavigation   = masthead.find( '#site-navigation' );
	socialNavigation = masthead.find( '#social-navigation' );
	searchToggle     = masthead.find( '#search-toggle' );
	siteSearch       = masthead.find( '#site-search' );
	// Enable menuToggle.
	( function() {

		// Return early if menuToggle is missing.
		if ( ! menuToggle.length ) {
			return;
		}

		// Add an initial values for the attribute.
		//menuToggle.add( siteNavigation ).add( socialNavigation ).attr( 'aria-expanded', 'false' );

		menuToggle.on( 'click.fusion', function() {
			searchToggle.add(siteSearch).toggleClass( 'toggled-on', false );
			$( this ).add( siteHeaderMenu ).toggleClass( 'toggled-on' );

			// jscs:disable
			$( this ).add( siteNavigation ).attr( 'aria-expanded', $( this ).add( siteNavigation ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
			// jscs:enable
		} );
	} )();

	// Enable searcHToggle.
	( function() {

		// Return early if menuToggle is missing.
		if ( ! searchToggle.length ) {
			return;
		}

		// Add an initial values for the attribute.
		//searchToggle.add( siteNavigation ).add( socialNavigation ).attr( 'aria-expanded', 'false' );

		searchToggle.on( 'click.fusion', function() {
			menuToggle.add( siteHeaderMenu ).toggleClass( 'toggled-on', false );
			menuToggle.add( siteNavigation ).attr( 'aria-expanded', 'false' );

			$( this ).add( siteSearch ).toggleClass( 'toggled-on' );
			siteSearch.find('.search-field').focus();

			// jscs:disable
			//$( this ).add( siteNavigation ).add( socialNavigation ).attr( 'aria-expanded', $( this ).add( siteNavigation ).add( socialNavigation ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
			// jscs:enable
		} );
	} )();


	// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
	( function() {
		if ( ! siteNavigation.length || ! siteNavigation.children().length ) {
			return;
		}

		// Toggle `focus` class to allow submenu access on tablets.
		function toggleFocusClassTouchScreen() {
			if ( window.innerWidth >= 910 ) {
				$( document.body ).on( 'touchstart.fusion', function( e ) {
					if ( ! $( e.target ).closest( '.main-navigation li' ).length ) {
						$( '.main-navigation li' ).removeClass( 'focus' );
					}
				} );
				siteNavigation.find( '.menu-item-has-children > a' ).on( 'touchstart.fusion', function( e ) {
					var el = $( this ).parent( 'li' );

					if ( ! el.hasClass( 'focus' ) ) {
						e.preventDefault();
						el.toggleClass( 'focus' );
						el.siblings( '.focus' ).removeClass( 'focus' );
					}
				} );
			} else {
				siteNavigation.find( '.menu-item-has-children > a' ).unbind( 'touchstart.fusion' );
			}
		}

		if ( 'ontouchstart' in window ) {
			$( window ).on( 'resize.fusion', toggleFocusClassTouchScreen );
			toggleFocusClassTouchScreen();
		}

		siteNavigation.find( 'a' ).on( 'focus.fusion blur.fusion', function() {
			$( this ).parents( '.menu-item' ).toggleClass( 'focus' );
		} );
	} )();

	function initTabs() {
		$('.posts-tab .comment_count-tab-control').addClass('active-tab-control');
		$('.posts-tab .comment_count-tab').addClass('active-tab');

		$('.tab-control a').on('click.fusion', function( e ) {

			e.preventDefault();

			if ( $(this).hasClass('active-tab-control') ) {
				return;
			}

			parentWidget = $(this).parents('.widget');
			$('.posts-tab .comment_count-tab-control', parentWidget).toggleClass('active-tab-control');
			$('.posts-tab .comment_count-tab', parentWidget).toggleClass('active-tab');
			$('.posts-tab .date-tab-control', parentWidget).toggleClass('active-tab-control');
			$('.posts-tab .date-tab', parentWidget).toggleClass('active-tab');

		});
	}

	// Add the default ARIA attributes for the menu toggle and the navigations.
	function onResizeARIA() {
		if ( window.innerWidth < 910 ) {
			if ( menuToggle.hasClass( 'toggled-on' ) ) {
				menuToggle.attr( 'aria-expanded', 'true' );
			} else {
				menuToggle.attr( 'aria-expanded', 'false' );
			}

			if ( siteHeaderMenu.hasClass( 'toggled-on' ) ) {
				siteNavigation.attr( 'aria-expanded', 'true' );
				socialNavigation.attr( 'aria-expanded', 'true' );
			} else {
				siteNavigation.attr( 'aria-expanded', 'false' );
				socialNavigation.attr( 'aria-expanded', 'false' );
			}

			menuToggle.attr( 'aria-controls', 'site-navigation social-navigation' );
		} else {
			menuToggle.removeAttr( 'aria-expanded' );
			siteNavigation.removeAttr( 'aria-expanded' );
			socialNavigation.removeAttr( 'aria-expanded' );
			menuToggle.removeAttr( 'aria-controls' );
		}
	}


	$( document ).ready( function() {
		var body = $( document.body );
		var lastScrollTop = 0;

		$( window )
			.on( 'load.fusion', onResizeARIA )
			.on( 'scroll.fusion', function() {
				var st = $(this).scrollTop();

				var headerHeight = masthead.outerHeight();

				if ( Math.abs( lastScrollTop - st ) <= 60 ) return;

				if ( st > headerHeight  ) {
					if ( st < lastScrollTop ) {
						body.addClass( 'sticky-menu');
					} else {
						body.removeClass( 'sticky-menu');
					}
				} else {
					body.removeClass( 'sticky-menu');
				}

				lastScrollTop = st;

			});

		animation = 'slide';
		direction = 'horizontal';
		if ( sliderOptions.transition == 'fade') {
			animation = 'fade';
		}
		if ( sliderOptions.transition == 'slidev' ) {
				direction = 'vertical';
		} 

		$(".hentry").fitVids();
	
		$('#featured-posts').flexslider({
			selector: '.slides > article',
			animation: 'slide',
			directionNav: false,
			prevText: '<span class="screen-reader-text">' + sliderOptions.prevText + '</span>',
			nextText: '<span class="screen-reader-text">' + sliderOptions.nextText + '</span>',
			animation: animation,
			direction: direction,
			after: function ( slider ) {
				$('.current-slide-page').text( ( slider.currentSlide + 1 ) );
			}
		});
		
		initTabs();

		$('.load-more a').on('click.fusion', function (e) {
			e.preventDefault();

			//widgetId = $(this).parents('.widget').attr("id");
			$(this).addClass('loading').text( screenReaderText.loadingText );

			$.ajax({
				type: "GET",
				url: $(this).attr('href') + '#main',
				dataType: "html",
				success: function (out) {
					result = $(out).find('#main .post');
					nextlink = $(out).find('#main .load-more a').attr('href');
					$('#main .load-more').before( result.fadeIn(800) );
					$('#main .load-more a').removeClass('loading').text( screenReaderText.loadMoreText );
					if (nextlink != undefined) {
						$('#main .load-more a').attr('href', nextlink);
					} else {
						$('#main .load-more').remove();
					}
				}
			});
		});

		if ( screenReaderText.sticky != '' ) {
			$( screenReaderText.sticky ).theiaStickySidebar({
				additionalMarginTop: 40
			});
		}

	} );

} )( jQuery );

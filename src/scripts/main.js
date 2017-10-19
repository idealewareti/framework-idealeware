; (function ($) {

	"use strict";

	$(document).ready(function () {

		$('[data-toggle="popover"]').popover();

		// REDIRECT TO HTTPS
		if (location.href.indexOf("https://") == -1 && location.hostname != 'localhost' && !/^\d+[.]/.test(location.hostname)) {
			location.href = location.href.replace("http://", "https://");
		}

		// AJUSTA MENU PRINCIPAL (responsivo)
		var ajustNav = function () {
			var $mainNav = $('#main-nav');
			var $bigSale = $('#big-sale');
			var $level1 = $('#main-nav .level1-item');
			var width = $('.container', $mainNav).outerWidth();
			var widthLevel1 = 0;

			if ($bigSale.length) {
				width = width - $bigSale.outerWidth();
			}

			$level1.removeClass('hidden');
			$.each($level1, function () {
				var $this = $(this);
				widthLevel1 += $this.outerWidth();
				if (widthLevel1 > width) {
					$this.addClass('hidden');
				} else {
					$this.removeClass('hidden');
				}
			});
		}

		// ajustNav();
		// $(window).resize(function(event) {
		// 	ajustNav();
		// });

		$('.btn-open-content').on('click', function (event) {
			var $this = $(this);
			var id = $this.attr('data-id');
			if ($(id).length) {
				if ($(id).is(':visible')) {
					$(id).slideUp();
					$this.find('.fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
				} else {
					$(id).slideDown();
					$this.find('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
				}
			}
			return false;
		});
		$('.btn-open-content').click(function (event) {
			var $this = $(this);
			var id = $this.attr('data-id');
			if ($(id).length) {
				if ($(id).is(':visible')) {
					$(id).slideUp();
					$this.find('.fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
				} else {
					$(id).slideDown();
					$this.find('.fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
				}
			}
			return false;
		});
		$('#btn-search').on('click', function (event) {

			alert('agit');
			$('#search-box .mask').hide();
			$('#search-box #form-search').css('top', '-100%');
			$('#search-box').show();
			$('#search-box .mask').fadeIn(300);
			$('#search-box #form-search').css('top', 0);
			return false;
		});
		$('#search-box .btn-close,#search-box .mask').click(function (event) {
			$('#search-box #form-search').css('top', '-100%');
			$('#search-box .mask').fadeOut(300, function () {
				$('#search-box').hide();
			});

			return false;
		});

	});

	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "100",
		"timeOut": "2000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
  		"hideMethod": "fadeOut"
	}


})(jQuery);
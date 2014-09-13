	var CarouselContainer;

	(function() {

		//This is basically the container of the Carousel, here we manage
		// the transition process
		CarouselContainer = Backbone.View.extend({
			el: '.carousel_container ul',


			initialize: function() {
				this.currentPixels = 0;
				this.listenTo(this.model, 'showNext', this.showNext);
				this.listenTo(this.model, 'showPrevious', this.showPrevious);
				this.listenTo(this.model, 'collectionReady', this.removeLoadingScreen);
			},


			slide: function(pixels) {
				$('.carousel_container ul').animate({
					marginLeft: pixels
				}, 1500);
			},

			showPrevious: function() {
				this.currentPixels += IMAGES_WIDTH;
				this.slide(this.currentPixels);
			},

			showNext: function() {
				this.currentPixels -= IMAGES_WIDTH;
				this.slide(this.currentPixels);
			},

			removeLoadingScreen: function() {
				$('.carouselCollection').css('background-color', '#000000');
				$('#floatingBarsG').hide();
			}
		});

	}());
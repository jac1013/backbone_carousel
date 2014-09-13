var CarouselButtons;
var CarouselContainer;
var CarouselBlocks;

(function() {

	//The buttons are the triggers, so they deserve a Backbone represantion
	//It's important too that they have to change states depending on the model
	//being show
	CarouselButtons = Backbone.View.extend({
		el: '.button_container',

		events: {
			"click #next": "triggerSlide",
			"click #previous": "triggerSlide",
		},

		initialize: function() {
			this.listenTo(this.model, 'edgeCarousel', this.changeButtonState);
			this.listenTo(this.model, 'notInEdgeAnymore', this.changeButtonState);
			this.listenTo(this.model, 'collectionReady', this.changeButtonState);
			disableButton('previous');
			disableButton('next');

		},

		triggerSlide: function(evt) {
			if (evt.target.id == NEXT) {
				this.model.trigger('showNext');
				this.model.trigger('triggerSlide', LEFT);
			} else {
				this.model.trigger('showPrevious');
				this.model.trigger('triggerSlide', 'right');
			}

		},

		changeButtonState: function(whichButton) {
			switch (whichButton) {
				case NEXT:
					disableButton('next');
					break;
				case PREVIOUS:
					disableButton('previous');
					break;
				case INITIAL_STATE:
					$('#next').removeClass();
					$('#next').prop('disabled', false);
					$('#next').addClass(NEXT);
					break;
				default:
					$('#previous').removeClass();
					$('#next').removeClass();
					$('#previous').prop('disabled', false);
					$('#next').prop('disabled', false);
					$('#next').addClass(NEXT);
					$('#previous').addClass(PREVIOUS);
					break;
			}
		}

	});

	//this function is meant to be inside the CarouseButtons view but
	// I just created outside to show how to use private functions with
	// backbone, sometimes we need 'helpers' function that doesn't fit
	// in any of our Backbone code so this is the elegant way to do it
	var disableButton = function(id) {
		var button = $('#' + id);
		button.prop('disabled', true);
		button.removeClass();
		button.addClass('disabled');
	};

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

	//Here we render every li with its random image.
	CarouselBlocks = Backbone.View.extend({
		tagName: 'li',

		initialize: function() {
			this.listenTo(this.model, 'collectionReady', this.render);
		},

		template: _.template('<img src="<%= image %>" alt="">'),

		render: function() {
			var self = this;
			_.each(carouselCollection.models, function(model) {
				model.chooseARandomImage();
				self.$el.html(self.template(model.toJSON()));
				carouselContainer.$el.append(self.$el.html());

			});
			$('.carousel_container').fadeOut(0);
			$('.carousel_container').fadeIn(1000);

		}
	});

}());
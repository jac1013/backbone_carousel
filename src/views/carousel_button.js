var CarouselButtons;

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

}());
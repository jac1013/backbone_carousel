	var Carousel;

	// I love to use an instantaneous ran function (anonymous function)
// to have all the functionality of the app private, this also help us
// to only expose what we want, for example we could delete all the lines
// above and declared them inside of the inner function and the app
// will still works, I let them outside to expose the backbone code
// but this is not necessary I just write it above to explain this.
	(function() {
		// This is the model that contains what the collection fetched
		// It is also responsible for almost most of the logic of the app
		// via triggering, this is called event-driven development.
		 Carousel = Backbone.Model.extend({

			initialize: function() {
				this.currentModel = 0;
				this.on('triggerSlide', this.adjustModelFromCollection, this);

			},

			isOnEdge: function() {
				var title = carouselModel.get('title');
				if (title === FIRST_BLOCK) {
					this.trigger('edgeCarousel', PREVIOUS);
				} else if (title === FORTH_BLOCK) {
					this.trigger('edgeCarousel', NEXT);
				} else {
					this.trigger('notInEdgeAnymore');
				}
			},

			adjustModelFromCollection: function(whichDirection) {
				if (whichDirection === LEFT) {
					carouselModel = carouselCollection.at(++this.currentModel);
				} else {
					carouselModel = carouselCollection.at(--this.currentModel);
				}
				this.isOnEdge();
			},

			chooseARandomImage: function() {
				var limit = this.get('images').length;
				var randomImageNumber = Math.floor((Math.random() * limit) + 0);
				this.set('image', this.get('images')[randomImageNumber]);
			}
		});

	}());
/* I let all the code in a single file on purpose, I have (as I said in
the job application) some background with MarionetteJS and I really like
the folder organization for that kind of projects, for example, Collections, Views and Models
go in different folders, I'm totally aware of it (and for production is a must) but I let this one
like this for simplicity (Irony, in larger projects the correct way is what give us simplicity)*/

var Carousel;
var CarouselButtons;
var CarouselContainer;
var CarouselImageCollection;
var CarouselBlocks;

// I love to use an instantaneous ran function (anonymous function)
// to have all the functionality of the app private, this also help us
// to only expose what we want, for example we could delete all the lines
// above and declared them inside of the inner function and the app
// will still works, I let them outside to expose the backbone code
// but this is not necessary I just write it above to explain this.
(function() {

	//some contants that aren't global thanks to our inner function wrap.
	var FIRST_BLOCK = 'First Block';
	var FORTH_BLOCK = 'Forth Block';
	var NEXT = 'next';
	var PREVIOUS = 'previous';
	var LEFT = 'left';
	var INITIAL_STATE = 'initialState';
	var IMAGES_WIDTH = 935;
	var SERVER_TIME_EMULATION = 3000;

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
		var button = $('#'+id);
		button.prop('disabled', true);
		button.removeClass();
		button.addClass('disabled');
	}

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

		removeLoadingScreen: function(){
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

	CarouselImageCollection = Backbone.Collection.extend({
		model: Carousel,
		url: "ourServiceUrl",

		initialize: function() {
			this.emulateRetreavingData();
		},

		emulateRetreavingData: function() {
			var self = this;
			this.add(new Carousel({
				title: "First Block",
				images: ['assets/images/image1.jpg', 'assets/images/image2.jpg']
			}));
			this.add(new Carousel({
				title: "Second Block",
				images: ['assets/images/image3.jpg', 'assets/images/image4.jpg']
			}));
			this.add(new Carousel({
				title: "Third Block",
				images: ['assets/images/image5.jpg', 'assets/images/image6.jpg']
			}));
			this.add(new Carousel({
				title: "Forth Block",
				images: ['assets/images/image7.jpg', 'assets/images/image8.jpg']
			}));
			//the timeout is to emulate the delay of the server.
			setTimeout(function() {
				self.trigger('collectionReady');
				carouselModel.trigger('collectionReady', 'initialState');
			}, SERVER_TIME_EMULATION);
		}

	});

	var carouselModel = new Carousel();
	var buttons = new CarouselButtons({
		model: carouselModel
	});
	var carouselContainer = new CarouselContainer({
		model: carouselModel
	});
	var carouselCollection = new CarouselImageCollection();
	var carouselBlocks = new CarouselBlocks({
		model: carouselCollection
	});

}());
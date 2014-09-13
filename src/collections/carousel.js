var CarouselImageCollection;

(function() {

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

}());
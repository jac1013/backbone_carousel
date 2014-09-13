var CarouselBlocks;

(function() {

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
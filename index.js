var Express = require('express');
var Twit = require('twit');
var _ = require('lodash/core');

var T = new Twit({
	consumer_key: 		'5js6h2I8ADLr1GDWfshnFAkVb',
	consumer_secret: 	'r95yuyyYkNBZqmYp4NJ1adGecpmhc9G6OOmvvarpWm311i4Blz', 
	app_only_auth:      true

});

function twitterSearch(req, res) {
	var size = req.params.size === undefined ? 1 : req.params.size;

	T.get('search/tweets', {
		q: req.params.q,
		count: size
	}).catch(function (err) {
		console.log('some error', err.stack);
		// post a http 500
	}).then(function(result) {
		// lets reformat result.data, retrieve only minimal values

		var out = _.map(result.data.statuses, function(status) {
			var basic = _.pick(status,[
				'created_at',
				'text'
				]);

			var media = _.map(status.entities.media, function(item) {
				return _.pick(item,[
					'media_url',
					'type'
					]);
			});

			var user = _.pick(status.user, [
				'name',
				'screen_name',
				'location',
				'profile_image_url'
				]);

			return _.extend(basic,{ media : media },user);
		})

		res.jsonp(out);
	});
}


var app = Express();
app.set('port', (process.env.PORT || 3000));
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://s.codepen.io');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// ROUTES FOR OUR API
// =============================================================================
var router = Express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.route('/search/:q/:size*?').get(twitterSearch);

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(app.get('port'), function () {
  console.log('restify-twitter is running on port', app.get('port'));
});
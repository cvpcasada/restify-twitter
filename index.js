var Express = require('express');
var Twit = require('twit');


var T = new Twit({
	consumer_key: 		'5js6h2I8ADLr1GDWfshnFAkVb',
	consumer_secret: 	'r95yuyyYkNBZqmYp4NJ1adGecpmhc9G6OOmvvarpWm311i4Blz', 
	app_only_auth:      true

});

function twitterSearch(req, res) {
	var count = (typeof req.params.count != 'undefined') ? req.params.count : 1;

	T.get('search/tweets', {
		q: req.params.q,
		count: count
	}).catch(function (err) {
		console.log('some error', err.stack);
		// post a http 500
	}).then(function(result) {
		res.send(result.data)
	});
}


var app = Express();
app.set('port', (process.env.PORT || 3000));


// ROUTES FOR OUR API
// =============================================================================
var router = Express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.route('/search/:q/:count*?').get(twitterSearch);

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(app.get('port'), function () {
  console.log('restify-twitter is running on port', app.get('port'));
});
var Express = require('express');
var Twit = require('twit');


var T = new Twit({
	consumer_key: 		'5js6h2I8ADLr1GDWfshnFAkVb',
	consumer_secret: 	'r95yuyyYkNBZqmYp4NJ1adGecpmhc9G6OOmvvarpWm311i4Blz', 
	app_only_auth:      true

});

function respond(req, res) {
	var count = (req.params.count) ? req.params.count : 1;

	T.get('search/tweets', {
		q: req.params.q,
		count: count
	}).catch(function (err) {
		console.log('some error', err.stack);
		// post a http 500
	}).then(function(result) {
		res.send(result.data)
	});

  //res.send('hello ' + req.params.name);
}


var app = Express();

app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/search/:q/:count', respond);

app.listen(app.get('port'), function () {
  console.log('restify-twitter is running on port', app.get('port'));
});
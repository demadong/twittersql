var express = require('express');
var router = express.Router();
// could use one line instead: var router = require('express').Router();
var tweetBank = require('../models/index');

router.get('/', function (req, res) {
  tweetBank.Tweet.findAll({ include: [ tweetBank.User ] }).then(function(tweets) {
    console.log(tweets[0].dataValues.User.dataValues);
    return tweets.map(function(tweet) {
      return {
        "name": tweet.dataValues.User.dataValues.name,
        "id": tweet.dataValues.id,
        "text": tweet.dataValues.tweet
      }
    })
  }).then(function(tweetsArray){
	res.render( 'index', { title: 'Twitter.js', tweets: tweetsArray } );
  })
});

function usersTweets (req, res){
	var user = req.params.name
	tweetBank.User.findOne({where: {name: user}}).then(function(foundUser){
		return foundUser;
  	}).then(function(foundUser) {
    	return tweetBank.Tweet.findAll({where: {UserId: foundUser.dataValues.id}})
  	}).then(function(tweet){
    	return tweet.map(function(singleTweet){
      		return {
        		"name": user,
        		"id": singleTweet.dataValues.id,
        		"text": singleTweet.dataValues.tweet
      		}
    	})
  	}).then(function(tweetsArray){
  		res.render("index", {tweets: tweetsArray});
  	})
};

function userTweetById(req, res) {
  var user = req.params.name,
      tweetId = req.params.id;
  tweetBank.User.findOne({where: {name: user}}).then(function(foundUser){
    return foundUser;
  }).then(function(foundUser) {
    return tweetBank.Tweet.findAll({where: {UserId: foundUser.dataValues.id, id: tweetId}})
  }).then(function(tweet){
    return {
      "name": user,
      "id": tweetId,
      "text": tweet[0].dataValues.tweet
    };
  }).then(function(tweetsArray) {
  	console.log(tweetsArray);
  	res.render('index', {tweets: [tweetsArray]})
  })
};

// function addTweet(req, res) {
// 	var user = req.params.name,
// 		tweetText = req.params.text;
// 	tweetBank.User.findAll({where: {name: user}})
// 	.then(function(user) {
// 		return user.id
// 	})
// 	.then(function(userId) {
// 		tweetBank.Tweet.create()
		
// 	})
// 	tweetBank.Tweet.findAll().then(function(tweets) {
// 		tweetBank.Tweet.create({ })
// 	});
// }

function addTweet(req, res) {
	var user = req.params.name,
		tweetText = req.params.text,
		newTweetId = 0;
	tweetBank.Tweet.findAll()
	.then(function (tweetsList) {
		newTweetId=tweetsList.length+1;
		return tweetsList.length+1;
	}).then(function (newId) {
		tweetBank.User.findAll({where: {name: user}})
		.then(function(user) {
			return user.id
		})
		.then(function(userId) {
			tweetBank.Tweet.create({id: newId, UserId: userId, tweetText});
		})
	}).then(function() {
		res.redirect('/');
	})
}





router.get('/users/:name', usersTweets);
router.get('/users/:name/tweets/:id', userTweetById);

// note: this is not very REST-ful. We will talk about REST in the future.
router.post('/submit', addTweet);

module.exports = router;

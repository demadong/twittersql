// pull in the Sequelize library
var Sequelize = require('sequelize');
// create an instance of a database connection
// which abstractly represents our app's mysql database
var twitterjsDB = new Sequelize('twitterjs', 'root', null, {
    dialect: "mysql",
    port:    3306,
});

// open the connection to our database
twitterjsDB
  .authenticate()
  .catch(function(err) {
    console.log('Unable to connect to the database:', err);
  })
  .then(function() {
    console.log('Connection has been established successfully.');
  });

var Tweet = require('./tweet')(twitterjsDB);
var User = require('./user')(twitterjsDB);

// adds a UserId foreign key to the `Tweet` table
User.hasMany(Tweet);
Tweet.belongsTo(User);


// User.findOne().then(function (user) {
//     // console.log(user.dataValues);
//     // user.dataValues.id
//     Tweet.findAll({where: {UserId: user.dataValues.id}}).then(function(tweet){
//       console.log(tweet[0].dataValues);
//       tweet.map(function(singleTweet) {return singleTweet.dataValues})
//     });
// });

// function add(name, text) {

// };

// function list() {

// };

function findByUserAndId(properties) {
  var user = properties.user,
      tweetId = properties.tweetId;
  return User.findOne({where: {name: user}}).then(function(foundUser){
    return foundUser;
  }).then(function(foundUser) {
    return Tweet.findAll({where: {UserId: foundUser.dataValues.id, id: tweetId}})
  }).then(function(tweet){
    return tweet[0].dataValues;
  })
};

function findByUser(properties) {
  var user = properties.user
  return User.findOne({where: {name: user}}).then(function(foundUser){
    return foundUser;
  }).then(function(foundUser) {
    return Tweet.findAll({where: {UserId: foundUser.dataValues.id}})
  }).then(function(tweet){
    return tweet.map(function(singleTweet){
      return singleTweet.dataValues;
    })
  })
};

// find({user: "Zeke", tweetId: 1}).then(function(tweet){
//   console.log(tweet);
// });
// {user: David Yang, tweetId: 5}


module.exports = {
    User: User,
    Tweet: Tweet
};
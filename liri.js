
// Read and set environment 
require("dotenv").config();

// Twitter NPM package.
var Twitter = require("twitter");

// Spotify-api NPM package.
var Spotify = require("node-spotify-api");

// API keys
var keys = require("./keys.js");

// Npm package.
var request = require("request");

// FS package for read/write.
var fs = require("fs");

// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);

// FUNCTIONS

// Writes to the log.txt file
var getArtistNames = function(artist) {
  return artist.name;
};

// Spotify search
var getMeSpotify = function(songName) {
  if (songName === undefined) {
    songName = "What's my age again";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

// Twitter Search
var getMyTweets = function() {
  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: 'ChrisPrieto11'
  };
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log("");
        console.log(tweets[i].text);
      }
    }
  });
};

// Movie Search
var getMeMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  });
};

// Command to log text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    }
    else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

// Commands 
var pick = function(caseData, functionData) {
  switch (caseData) {
  case "my-tweets":
    getMyTweets();
    break;
  case "spotify-this-song":
    getMeSpotify(functionData);
    break;
  case "movie-this":
    getMeMovie(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

// Arguments and executes 
var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

// MAIN PROCESS
runThis(process.argv[2], process.argv[3]);

// .prompt([
//   {
//     type: "list",
//     message: "What would you like to do?",
//     choices: ["Get Tweets", "Search Spotify", "Search Movies", "Surprise Me"],
//     name: "userAction"
//   }
// ])
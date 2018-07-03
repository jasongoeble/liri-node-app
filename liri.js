//required node configurations and keys for api functionality
require("dotenv").config();
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");

//storing keys for spotify and twitter authentication in variables
var spotty = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//variables for holding tweet information
var postDate = "";
var tweetText = "";

//variables for capturing user input and passing information to functions
var wholeStatement = process.argv;
var userInput = "";
var userFunction = process.argv[2];
//var userSpecification = process.argv[3];


function operate(action)
{
    switch (action){
        case "my-tweets":
            twitterReading();
            break;
        case "spotify-this-song":
            for (var j = 3; j < wholeStatement.length; j++)
            {
            userInput = userInput +" "+ wholeStatement[j]; 
            }
            spotifyReading(userInput);
            break;
        case "movie-this":
            for (var i = 3; i < wholeStatement.length; i++)
            {
                if (i>3 && i<wholeStatement.length)
                {
                    userInput = userInput +"+"+ wholeStatement[i]; 
                }
                else
                {
                    userInput += wholeStatement[i];
                }
            }
            movieCall(userInput);
            break;
        case "do-what-it-says":
            fileRead();
            break;
        default:
            break;
    }
}

//this is the function that runs when the user wants to read twitter messages
function twitterReading()
{
    client.get("search/tweets", {q: "CwruJason"}, function(error, tweets, response) 
    {
        if (error)
        {
            console.log(error);
        }
        if(!error && response.statusCode === 200)
        {
            for (var t = 0; t < tweets.statuses.length; t++)
            {
                postDate = tweets.statuses[t].created_at;
                postDate = postDate.substr(0,19);
                tweetText = tweets.statuses[t].text;
                console.log("Tweet posted on: " + postDate);
                console.log("Tweet text: " + tweetText);
            }
        }
    });

}

//this is the function that runs when the user wants spotify information 
function spotifyReading(songName)
{
    //if the user does not enter a track title, then we will search for The Sign
    if (songName == "")
    {
        songName = "The Sign";
    }
    else
    {}

    //method for searching for a track on Spotify
    spotty.search({ type: "track", query: songName}, function(err, data) {
        if (err) 
        {
            console.log("Error occurred: " + err);
            return;
        }
        if(!err)
        {
            console.log("Your search request for "+songName+" has been passed to Spotify, and here are the results:");
            for (var s = 0; s < data.tracks.items.length; s++)
            {
                console.log("**************************************************")
                //song name
                console.log("Here are the results from spotify for the song: " + data.tracks.items[s].name);
                //artist name
                console.log("The artists name is: " + data.tracks.items[s].artists[0].name);
                //album name
                console.log("The track is on the " + data.tracks.items[s].album.name +" album.");
                //preview url
                console.log("You can preview this song at: " + data.tracks.items[s].preview_url)
                console.log("**************************************************")

            
            }
        }
        });
}

//this is the function that runs when the user requests movie information
function movieCall(movieName)
{
    //if the user does not enter a movie name, then the title is set to Mr Nobody
    if(movieName == "")
    {
        movieName = "Mr+Nobody";
    }
    else
    {}
    
    //build of the omdbapi query line with a specified movie title that includes the rotten tomatoes information
    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

    request (queryURL, function(error, response, body){

        if (error)
        {
            console.log(error);
        }

        //when there is no error and the status code is good...display the required omdb information
        if(!error && response.statusCode === 200)
        {

            console.log("The movie title you've inquired about is: " + JSON.parse(body).Title + ".");
            console.log(JSON.parse(body).Title + " was released in " + JSON.parse(body).Year + ".");
            console.log(JSON.parse(body).Title + " was rated " +  JSON.parse(body).imdbRating + " by IMDB.");
            console.log(JSON.parse(body).Title + " was rated " + JSON.parse(body).tomatoRating + " by Rotten Tomatoes.");
            console.log(JSON.parse(body).Title + " was created in " + JSON.parse(body).Country + ".");
            console.log(JSON.parse(body).Title + " was produced in " + JSON.parse(body).Language + ".");
            console.log("The plot of " + JSON.parse(body).Title + " is: " + JSON.parse(body).Plot + ".");
            console.log(JSON.parse(body).Actors + " all starred in " + JSON.parse(body).Title + ".");
        }
    });
}

//this is the function that runs when the user wants to run the random.txt file operation
function fileRead()
{
    //this reads the text from a specified file
    fs.readFile("random.txt", "utf8", function(err, data){
        //if there is an error it will display to the terminal
        if (err){
            console.log(err);
        }

        //parse the data in the file by comma
        var dataArray = data.split(",");
        console.log(dataArray);

        //there is no need to loop through the array
        //because we know that there are only two elements and what they are they are assigned to the appropriate variables
        userFunction = dataArray[0];
        userSpecification = dataArray[1];
        console.log(userFunction);
        console.log(userSpecification);
    });

    //after parsing the file data, call the operation function passing the appropriate info based on the file contents
    operate(userFunction);
}

//this is intentionally placed AFTER all of the functional operations are defined
operate(userFunction);
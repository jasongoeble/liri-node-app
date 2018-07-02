//required node configurations and keys for api functionality
require("dotenv").config();
var fs = rquire("fs");
var request = require("request");
var twitter = require("twitter");
var spotty = require("node-spotify-api");
var keys = require("./keys.js");


var spotify = new spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var userFunction = process.argv[2];
var userSpecification = process.argv[3]

function operate(action, details)
{
    switch (action){
        case "my-tweets":
            twitterReading();
            break;
        case "spotify-this-song":
            spotifyReading(details);
            break;
        case "movie-this":
            movieCall(details);
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

}

//this is the function that runs when the user wants spotify information 
function spotifyReading()
{

}

//this is the function that runs when the user requests movie information
function movieCall(movieName)
{
    request ("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function(error, response, body){

        if (error)
        {
            console.log(error);
        }

        if(!error && response.statusCode === 200)
        {
            console.log("The movie title you've inquired about is: " + movieName + ".");
            console.log(movieName + "was released in " + JSON.parse(body).Year) + ".";
            console.log(movieName + "was rated " +  JSON.parse(body).imdb_rating + " by IMDB.");
            console.log(movieName + "was rated " + JSON.parse(body).tomato_rating + " by Rotten Tomatoes.");
            console.log(movieName + "was created in " + JSON.parse(body).Country + ".");
            console.log(movieName + "was produced in " + JSON.parse(body).Language + ".");
            console.log("The plot of " + movieName + " is: " + JSON.parse(body).Plot + ".");
            console.log(JSON.parse(body).Actors + " all starred in " + movieName + ".");

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

        //there is no need to loop through the array
        //because we know that there are only two elements and what they are they are assigned to the appropriate variables
        userFunction = dataArray[0];
        userSpecification = dataArray[1];
    });

    //after parsing the file data, call the operation function passing the appropriate info based on the file contents
    operate(userFunction, userSpecification);
}

//this is intentionally placed AFTER all of the functional operations are defined
operate(userFunction, userSpecification);
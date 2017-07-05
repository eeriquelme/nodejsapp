var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var videoTitles = []; // Stores just the texts with titles of videos.
var videoLinks = []; //  Stores an array of video links.
var videoImages = []; //
var express = require('express');
var app = express();
var path = require('path');
var cool = require('cool-ascii-faces');


var port = normalizePort(process.env.PORT || '5050');
app.set('port', port);

var server = http.createServer(app);


app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/view/index.html'));
});

app.get('/videos', function(req, res){
  res.sendFile(path.join(__dirname + '/view/videos.html'));
})

app.get('/', function(req, res){
  if (req.url === "/index"){
    fs.readFile("view/index.html", function(error, pageResp){
      if(error){
        resp.writeHead(404);
        resp.write('Content not found.');
      }
      else {
        resp.writeHead(200, { 'Content-Type' : 'text/html' });
        resp.write(pageResp);
      }
      resp.end();
    });
  }
  else {
    resp.writeHead(200, { 'Content-Type' : 'text/html'});
    resp.end();
  }

  request('https://www.youtube.com/channel/UC_MsL0rupMTjgVaHLCb5wew/videos', function(err, resp, body) {
      if (!err && resp.statusCode === 200){
        $ = cheerio.load(body);
        $('.yt-uix-sessionlink', '#channels-browse-content-grid').each(function() {
          var videoLink = $(this).attr('href');
          videoLinks.push('https://www.youtube.com/' + videoLink);
        });
        // Gets video titles.
        var data = $('.yt-uix-sessionlink', '#channels-browse-content-grid').text();
        // Push all titles to the videoTitles array.
        videoTitles.push(data);


        // Get all the thumb images from videos
        $('img', '#channels-browse-content-grid').each(function() {
          var img = $(this).attr('src');
          videoImages.push(img);
        });
       // Saves images to images folder
       for (var i = 0; i < videoImages.length; i++){
         request(videoImages[i]).pipe(fs.createWriteStream('images/thumb' + i + '.png'));
       }
      }
    // Print title of videos to the console.
    console.log(videoTitles.toString());
    // Print links of videos to the console.
    console.log(videoLinks);
  });
  // End of scraping methods.
});


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


app.listen(process.env.PORT || 5050, function() {
  console.log('listening on', http.address().port);
});
//server.listen(5050);

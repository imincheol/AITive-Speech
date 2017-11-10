// 네이버 음성합성 Open API 예제
var express = require('express');
var app = express();

var client_id = 'NAVER_DEVELOPER_CLINET_ID';
var client_secret = 'NAVER_DEVELOPER_CLINET_SECET';

var fs = require('fs');


app.get('/tts', function (req, res) {
    console.log("tts");
    var lines = readLocalSampleFile();
    // loadSpeechLine(lines);
});

function readLocalSampleFile() {

    var file  =  fs.readFileSync(__dirname + '/sample.txt', "utf8");
    var fileContent = "" + file;
    console.log('chars : ' + fileContent.length);

    var MAX_LEN = 1000;

    var lines = fileContent.split("\n");
    console.log('lines : ' + lines.length);

    var speechLines = [];
    var currentLineIndex = 0;
    var stackedChars = 0;
    lines.forEach(function(line){

        // 제한갯수보다 많으면 다음 줄로 이동
        if ( stackedChars > MAX_LEN ) {
            currentLineIndex += 1;
            stackedChars = 0;
        }

        // 현재 줄이 없으면 빈값 생성
        if ( !speechLines[currentLineIndex] ){
            speechLines[currentLineIndex] = "";
        }

        // 현재 줄에 추가
        speechLines[currentLineIndex] += line;
        stackedChars += line.length;
    });

    console.log('req speech line length : ' + speechLines.length);
    return speechLines;
}

// loadSpeechLine(speechLines);

var speechCount = 1;
function loadSpeechLine(lines) {
    if ( !lines || lines.length < 1) {
        console.log("Complete.");
        return;
    }

    console.log("Left lines : " + lines.length);
    getSpeechTextMp3(lines.shift(), speechCount++ ,function() {
        loadSpeechLine(lines);
    });
}
function getSpeechTextMp3(text, i, complete) {
    var api_url = 'https://openapi.naver.com/v1/voice/tts.bin';
    var request = require('request');
    // var request = getRequest();
    var options = {
        url: api_url,
        // form: {'speaker':'mijin', 'speed':'0', 'text':text}, // Woman
        // form: {'speaker':'jinho', 'speed':'-5', 'text':text}, // Man 1.5
        // form: {'speaker':'jinho', 'speed':'0', 'text':text}, // Man 1(normal)
        form: {'speaker':'jinho', 'speed':'2', 'text':text}, // Man 0.8
        // form: {'speaker':'jinho', 'speed':'5', 'text':text}, // Man 0.5
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
    var writeStream = fs.createWriteStream('./tts'+ i +'.mp3');
    var _req = request.post(options).on('response', function(response) {
        console.log('statusCode : ' + response.statusCode); // 200
        console.log('contentType : ' + response.headers['content-type']);
        complete();
    });
    _req.pipe(writeStream); // file로 출력
    // _req.pipe(res); // 브라우저로 출력
}

function getRequest() {
    return require('request');
}

app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/tts app listening on port 3000!');
});


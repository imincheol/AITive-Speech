var express = require('express');
var router = express.Router();

var fs = require('fs');

// 번역 요청
router.post('/', function (req, res) {
    var datas = req.body;
    console.log('tts datas : ', datas);

    var request = getRequest();
    var options = getTtsOptions(datas);
    console.log(options);

    var fileName = new Date().getTime() + "_" + parseInt(Math.random() * 100) + ".mp3";

    var writeStream = fs.createWriteStream(__dirname + '/../public/files/' + fileName);
    var _req = request.post(options).on('response', function (response) {
        console.log('statusCode : ' + response.statusCode); // 200
        console.log('contentType : ' + response.headers['content-type']);
        // complete();
    });
    _req.pipe(writeStream); // file로 출력
    // _req.pipe(res); // 브라우저로 출력

    writeStream.on('finish', function () {
        // console.log('파일 쓰기 완료');
        res.send({
            result: 'success',
            data: {
                url: "/files/" + fileName
            }
        });
    });
});
module.exports = router;


const VOICE_PERSON = {
    KR: {
        LADY: {
            'speaker': 'mijin',
            'speed': '-1',
        },
        MAN: {
            'speaker': 'jinho',
            'speed': '2',
        }
    },
    EN: {
        LADY: {
            'speaker': 'clara',
            'speed': '0',
        },
        MAN: {
            'speaker': 'matt',
            'speed': '0',
        }
    }
}

function getRequest() {
    return require('request');
}

function getTtsOptions(datas) {

    var client_id = datas.client_id;
    var client_secret = datas.client_secret;
    var text = datas.text;
    var lang = datas.language;

    var api_url = 'https://openapi.naver.com/v1/voice/tts.bin';
    var options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };

    // set country and sex 
    var person = VOICE_PERSON.KR.LADY;
    if ( lang == "en" ) {
        person = VOICE_PERSON.EN.LADY;
    }
    options.form = person;

    // set text
    options.form.text = text;

    return options;
}
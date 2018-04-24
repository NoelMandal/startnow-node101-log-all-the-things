const express = require('express');
const fs = require('fs');
const app = express();


app.use((req, res, next) => {
    var agent = req.headers['user-agent'];
    var time = (new Date().toISOString());
    var method = req.method;
    var resource = req.path;
    var version = ('HTTP/' + req.httpVersion);
    var status = 200;
    var allData = `${agent.replace(',','')},${time},${method},${resource},${version},${status}\n`;

    fs.appendFile('/Users/totz/oca/startnow-node101-log-all-the-things/server/log.csv', allData, err =>{
        if(err) throw('err');
    });
    console.log(allData);
    next()
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.get('/logs', (req, res) => {
    var bufferString;
    var array = [];
    var headers;
    var jsonArray;
    var jsonObj = [];
        fs.readFile('/Users/totz/oca/startnow-node101-log-all-the-things/server/log.csv', (err, data) => {
        if (err) throw err;
            bufferString = data.toString();
            array = bufferString.split("\n");
            headers = array[0].split(",");
            for (var i = 1; i < array.length - 1; i++) {
                jsonArray = array[i].split(",");
                var obj = {};
                    for (var j = 0; j < jsonArray.length; j++) {
                        obj[headers[j]] = jsonArray[j];
                    }
                jsonObj.push(obj);
            }
            res.send(jsonObj);
      });
});
module.exports = app;
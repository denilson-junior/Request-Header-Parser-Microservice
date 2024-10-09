// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();
const os = require('os');
const axios = require('axios');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/whoami', async function (req, res) {
  let publicIP = await getPublicIP()

  res.json({
    ipaddress: publicIP,
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// aux functions
function returnIPAddress() {
  const networkInterfaces = os.networkInterfaces()

  for (const interfaceName in networkInterfaces) {
    for (const interfaceSelected of networkInterfaces[interfaceName]) {
      if (interfaceSelected.family === 'IPv4' && !interfaceSelected.internal) {
        return interfaceSelected.address
      }
    }
  }
}

function returnSystemLanguage() {
  const language = process.env.LANG
    || process.env.LANGUAGE
    || process.env.LC_ALL
    || process.env.LC_MESSAGES
    || process.env.USERLANGUAGE
    || 'pt-BR,pt;q=0.8'

  return language
}

async function getPublicIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json')
    const publicIP = response.data.ip

    return publicIP
  } catch (err) {
    console.error('Error fetching public IP: ', err)
  }
}
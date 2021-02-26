const express = require('express');
const router = express.Router();
var axios = require("axios").default;

router.get('/test', async (req, res) => { 

  res.status(200).json("test");

});

router.get('/', async (req, res) => {

  const data = await GetData();

  res.status(200).json(data);

});

async function GetData() {

  // var header = {
  //   headers: {
  //     'x-rapidapi-key': 'a1132eddecmsh03305a8dc157bfdp1438cbjsn24afae5eb725',
  //     'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  //   }
  // };


  // var data = await axios.get('https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-summary', { region: 'US' }, header);

  // return data;


  //'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-summary',

  //https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes

  //https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers

  //





  var options = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
    params: { region: 'DE',  symbols: 'DRI.F', exchange: 'EUR' },
    headers: {
      'x-rapidapi-key': 'a1132eddecmsh03305a8dc157bfdp1438cbjsn24afae5eb725',
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };

  //router.get('https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-summary', options)

  //const resp = await axios.get('https://jsonplaceholder.typicode.com/posts',);

  let data = await axios.request(options).then(function (response) {
    console.log(response.data);
    return response.data;
  }).catch(function (error) {
    console.error(error);
  });

  return data;

}

module.exports = router;
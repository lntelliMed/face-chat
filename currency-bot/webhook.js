'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const convertCurrency = (amountToConvert, outputCurrency, cb) => {
  const {
    amount,
    currency
  } = amountToConvert;
  return request({
    url: 'https://api.fixer.io/latest',
    qs: {
      base: currency,
      symbols: outputCurrency
    },
    method: 'GET',
    json: true
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let computedValue = Math.round(body.rates[outputCurrency] * amount);
      cb(null, `${amount} ${currency} converts to about ${outputCurrency} ${computedValue} as per current rates!`);
    } else {
      cb(error, null);
    }
  });

}

app.post('/', (req, res, next) => {
  let {
    queryResult
  } = req.body;

  if (queryResult) {
    const {
      outputCurrency,
      amountToConvert
    } = queryResult.parameters;

      if (amountToConvert.currency === outputCurrency) {
        const {
          amount,
          currency
        } = amountToConvert;
        let responseText = `Hmm, ${amount} ${outputCurrency} is obviously equal to ${amount} ${outputCurrency}!`;
        let respObj = {
          fulfillmentText: responseText
        }
        res.json(respObj);
      } else {
        convertCurrency(amountToConvert, outputCurrency, (error, result) => {
          if (!error && result) {
            let respObj = {
              fulfillmentText: result
            }
            res.json(respObj);
          }
        });
      }
  }

  return next();
});

app.listen(PORT, () => console.log(`CurrencyConverter running on ${PORT}`));

'use strict';

var curl = require('../../curl');

function messageListener(db, from, channel, message, reply) {
  if ('@btc' === message) {
    //curl http://preev.com/pulse/units:btc+usd/sources:bitstamp | jq .btc | jq .usd | jq .bitstamp | jq .last
    curl('http://preev.com/pulse/units:btc+usd/sources:bitstamp', function (resp) {
      var last = JSON.parse(resp).btc.usd.bitstamp.last;
      reply({ to: channel, message: '$' + last });
    });
  }

}

module.exports = messageListener;
'use strict';

var irc = require('irc');

// Use instrumented code for code coverage tests                                 
var lib = process.env.LIB_COV ? 'lib-cov' : 'lib';                               

var fsdb = require('./' + lib + '/fsdb');
var main = require('./' + lib + '/main');                                

var config = fsdb.load('config.json');
var client = new irc.Client(config.irc.host, config.irc.user, config.irc.opts);

main(client, 'config.json');

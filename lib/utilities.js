'use strict';

function bot() {
  return process.env.IRC_USER;
}

function sms() {
  var preq = require('preq');
  return function(db,to, message) {
    preq.post({
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      uri: 'http://textbelt.com/text',
      body: 'number=' + to + '&message=' + encodeURIComponent(message),
    }).catch(function (e) {
      console.error('contact.sms', e);
    });
  };
}

function email() {
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');
  var transporter = nodemailer.createTransport(
    smtpTransport(
      [
	"smtps://",
	process.env.SMTP_USERNAME,
	":",
	encodeURIComponent(process.env.SMTP_PASSWORD),
	"@",
	process.env.SMTP_SERVER
      ].join('')
    )
  );
  return function(db, to, subject, body) {
    var mail = {
      from: bot() + ' <' + process.env.SMTP_SENDER + '>',
      to: to,
      subject: subject,
      text: body
    };
    transporter.sendMail(
      mail,
      function (e) {
        if (e) {
          console.error('contact.email', e);
        }
      }
    );
  };
}

function uuid() {
  var uuid = require('node-uuid');
  return function() {
    return uuid.v4();
  };
}

function now() {
  var now = new Date();
  return date_format(now);
}

function date_format(d) {
  var dateFormat = require('dateformat');
  return dateFormat(d, "h:MM TT Z") + ' on ' + dateFormat(d, "ddd, mmm dS, yyyy");
}

function regexMatch(regex,str) {
  var result;
  var tokens = [];
  while ((result = regex.exec(str)) !== null) {
    tokens.push(result[1]);
  }
  return tokens;
}

function timeout(f,time) {
  setTimeout(f,time);
}

module.exports.email       = email();
module.exports.sms         = sms();
module.exports.uuid        = uuid();
module.exports.now         = now;
module.exports.date_format = date_format;
module.exports.bot         = bot;
module.exports.regex_match = regexMatch;
module.exports.timeout     = timeout;

'use strict';

var KryptoGame = require('../../krypto-game.js');

function messageListener(db, from, channel, message, reply) {
  if (/^@krypto/.test(message)) { 
    db.krypto = db.krypto || {}; db.krypto[channel] = db.krypto[channel] || new KryptoGame.Krypto();
    if (KryptoGame.okToGuess(db.krypto[channel])) {
      db.krypto[channel].guesser = from;
      reply({ to: channel, message: from +  ': OK - take a guess.'});
    } else {
      reply({ to: channel, message: from +  ': sorry, but ' + db.krypto[channel].guesser + ' already is guessing.'}); 
    }
  }
  if (/^@cards/.test(message)) {
      db.krypto = db.krypto || {};
      db.krypto[channel] = db.krypto[channel] || new KryptoGame.Krypto(); 
      reply({ to: channel, message: db.krypto[channel].hand.slice(0,5).join(', ') + ' Objective Card: ' + db.krypto[channel].hand[5]});
  }
  if (/^@guess/.test(message)) {
      db.krypto = db.krypto || {};
      db.krypto[channel] = db.krypto[channel] || new KryptoGame.Krypto(); 

      if (KryptoGame.okToGuess(db.krypto[channel])) {
        reply({ to: channel, message: from +  ': please say "@krypto" first!'}); 
      } else {
        if (db.krypto[channel].guesser != from) {
          reply({ to: channel, message: from +  ': sorry, but it\'s ' + db.krypto[channel].guesser + '\'s turn.'});
        } else {
          var match = /^@guess\s+(.*)$/.exec(message);
          if (KryptoGame.checkSolution(db.krypto[channel], from,match[1])) {
            reply({ to: channel, message: from +  ': Nice job! You got it correct!'});
            db.krypto[channel] = new KryptoGame.Krypto();
            reply({ to: channel, message: db.krypto[channel].hand.slice(0,5).join(', ') + ' Objective Card: ' + db.krypto[channel].hand[5]});
          } else {
            reply({ to: channel, message: from +  ': Sorry, your answer is incorrect.'});
          }
          db.krypto[channel].guesser = null;
        }
      }
  }
}

module.exports = messageListener;
module.exports.help = [{ cmd:'@krypto',
                         syntax: '@krypto',
                         output: {success: ['<user>: OK - take a guess.',
                                            '<card>, <card>, <card>, <card>, <card> Objective Card: <card>'],
                                  failure: ['<user>: Sorry, but <user> already is guessing.']}
                       }, 
                       {cmd: '@cards', 
                        syntax: '@cards',
                        output: { success: ['<card>, <card>, <card>, <card>, <card> Objective Card: <card>'],
                                  failure: ['']}
                       },
                       {cmd: '@guess',
                        syntax: '@guess <expression>',
                        output: { success: ['<user>: Nice job! You got it correct!'],
                                  failure: ['<user>: please say "@krypto": first!',
                                           '<user>: sorry, but it\'s <user>\'s turn.',
                                           '<user>: Sorry, your answer is incorrect.']}
                       }];


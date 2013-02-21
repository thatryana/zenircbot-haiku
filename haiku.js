
var ZenIRCBot = require('zenircbot-api').ZenIRCBot;
var zen = new ZenIRCBot();
var sub = zen.get_redis_client();
var request = require('request');

zen.register_commands('haiku.js', [{
    name: '!haiku',
    description: 'Fetch a randomly generated haiku from http://haiku-battle.heroku.com/battle/random_haiku'
}]);

sub.subscribe('in');
sub.on('message', function( channel, message ) {
    var msg = JSON.parse(message);
    if (msg.version == 1) {
        if (msg.type == 'privmsg') {
            if (/^!haiku/i.test(msg.data.message)) {
                console.log('sending request');
                request('http://haiku-battle.heroku.com/game/random_haiku.json', function(error, response, body) {
                    var haiku = JSON.parse(body).haiku;
                    for (var h in haiku) {
                        zen.send_privmsg(msg.data.channel, haiku[h]);
                    }
                });
            }
        }
    }
});

const Twit = require('twit');

require('dotenv').config();

/* Configure a API do Twitter */
const Bot = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000,
});

var TWITTER_SEARCH_PHRASE = 'açaí';

console.log('O Bot está rodando...');

/* BotRetweet (): para retuitar os tweets recentes */
function BotRetweet() {
	const stream = Bot.stream('statuses/filter', {
		track: TWITTER_SEARCH_PHRASE,
		// language: 'pt'
	});

	stream.on('tweet', tweet => {
		if (isReply(tweet)) {
			console.warn('Esse tweet é um retweet!');
		} else {
			Bot.post('statuses/retweet/:id', {
				id: tweet.id_str
			}, (error, response) => {
				if (error) {
					console.log('O bot não pôde retweetar, : ' + error);
				} else {
					console.log('Bot retweetou : ' + response.text);
				}
			});
		}
	});
};

function isReply(tweet) {
	if (tweet.retweeted_status
		|| tweet.in_reply_to_status_id
		|| tweet.in_reply_to_status_id_str
		|| tweet.in_reply_to_user_id
		|| tweet.in_reply_to_user_id_str
		|| tweet.in_reply_to_screen_name)
		return true
}

// Exportações
module.exports = {
	Bot,
	BotRetweet,
	isReply,
}
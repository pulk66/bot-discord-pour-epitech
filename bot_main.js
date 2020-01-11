const Discord = require('discord.js');
const client = new Discord.Client();
var balance = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	const phr = message.content.split(' ');
	if (phr[0] === '!ping') {
		message.reply('pong');
	}
	if (phr[0] === '!AddRole') {
		if (message.member.roles.some(r => ["Administrateur-de-Génie"].includes(phr[1]))) {
			console.log("ça marche");
		} else {
			console.log("ca ne marche pas");
		}
	}
	if (phr[0] === '!balance') {
		if (phr[1] === 'mount') {
			const auteur = message.member.id;
			console.log(auteur);
			if (!balance.hasOwnProperty(auteur)) {
				balance[auteur] = 0;
			}
			message.reply(balance[auteur]);
		}
	}
});

client.on('guildMemberAdd', user => {
	const channel = user.guild.channels.find(ch => ch.name === 'général');
	channel.send(`Bienvenue ${user}`);
});

client.login('NjY0OTM4MDY5MTk1MjI3MTU2.XhhDOg.F5QgaY5U4gWhRBgBUx6BatActLM');
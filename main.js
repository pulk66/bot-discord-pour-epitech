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
	if (phr[0] === '!help') {
		message.author.send('Voici les commandes actuellement disponibles pour vous : \n\
		!help : vous envoie toute la liste des commandes disponibles \n\
monnaie : \n\
		!balance mount : donne la somme que vous posseder en ce moment');
	}
});

client.on('guildMemberAdd', user => {
	const channel = user.guild.channels.find(ch => ch.name === 'général');
	channel.send(`Bienvenue ${user}`);
});

client.on('guildMemberRemove', user => {
	const channel = user.guild.channels.find(ch => ch.name === 'général');
	channel.send(`Au revoir ${user} et a bientôt`);
})

client.login('NjY0OTM4MDY5MTk1MjI3MTU2.XhhDOg.F5QgaY5U4gWhRBgBUx6BatActLM');
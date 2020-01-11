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
			if (balance[message.author.id] === undefined) {
				balance[message.author.id] = 0;
			}
			message.reply(balance[message.author.id]);
		}
		if (phr[1] === 'pay') {
			const destinataire = phr[3].substring(3, phr[3].length - 1);
			if (balance[destinataire] === undefined) {
				balance[destinataire] = 0;
			}
			if (balance[message.author.id] === undefined) {
				balance[message.author.id] = 0;
			} 
			if (balance[message.author.id] < parseInt(phr[2], 10)) {
				message.reply("Vous n'avez pas assez d'argent sur votre compte");
			} else {
				balance[destinataire] += parseInt(phr[2], 10);
				balance[message.author.id] -= parseInt(phr[2], 10);
				message.reply("La transaction a bien était effectué");
			}
		}
	}
	if (phr[0] === '!give') {	
		if (balance[message.author.id] === undefined) {
			balance[message.author.id] = 0;
		}
		balance[message.author.id] += parseInt(phr[1], 10);
		message.reply(balance[message.author.id]);
	}
	if (phr[0] === '!help') {
		message.author.send('Voici les commandes actuellement disponibles pour vous : \n\
		!help : vous envoie toute la liste des commandes disponibles \n\
monnaie : \n\
		!balance mount : donne la somme que vous posseder en ce moment \n\
		!balance pay [montant] [destinataire] : paye le destinataire du montant indiqué');
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
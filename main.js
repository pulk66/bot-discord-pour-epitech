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
			if (phr[2] === undefined) {
				message.reply("il manque le destinataire");
			} else if (phr[2][0] != '<') {
				message.reply("le destinataire n'est pas bien écrit");
			} else {
				const destinataire = phr[2].substring(3, phr[2].length - 1);
				if (balance[destinataire] === undefined) {
					balance[destinataire] = 0;
				}
				message.reply(balance[destinataire]);
			}
		}
		if (phr[1] === 'pay') {
			if (phr[3] === undefined) {
				message.reply("Il manque le destinataire");
			} else if (phr[3][0] != '<') {
				message.reply("le destinataire n'est pas bien écrit");
			} else if (phr[2] != parseInt(phr[2], 10)) {
				message.reply("le montant indiqué n'est pas valide");
			} else {
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
		if (phr[1] === 'give') {	
			if (message.member.hasPermission("ADMINISTRATOR")) {
				console.log(phr[3][0]);
				if (phr[3] === undefined) {
					message.reply("Il manque le destinataire");
				} else if (phr[3][0] != '<') {
					message.reply("le destinataire n'est pas bien écrit");
				} else if (phr[2] != parseInt(phr[2], 10)) {
					message.reply("la valeur indiqué n'est pas bonne");
				} else {
					const destinataire = phr[3].substring(3, phr[3].length - 1);
					if (balance[destinataire] === undefined) {
						balance[destinataire] = 0;
					}
					balance[destinataire] += parseInt(phr[2], 10);
					message.reply("Le don a bien était fait");					
				}
			} else {
				message.reply("Vous n'avez pas la permission d'utiliser cette commande");
			}
		}
		if (phr[1] === 'remove') {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				if (phr[3] === undefined) {
					message.reply("Il manque le destinataire");
				} else if (phr[3][0] != '<') {
					message.reply("le destinataire n'est pas bien écrit");
				} else if (phr[2] != parseInt(phr[2], 10)) {
					message.reply("le montant indiqué n'est pas valide");
				} else {
					const destinataire = phr[3].substring(3, phr[3].length - 1);
					if (balance[destinataire] === undefined) {
						balance[destinataire] = 0;
					}
					if (balance[destinataire] >= phr[2]) {
						balance[destinataire] -= parseInt(phr[2], 10);
					} else {
						balance[destinataire] = 0;
					}
					message.reply("le montant a bien était enlevé");				
				}
			} else {
				message.reply("Vous n'avez pas la permission de faire cette commande");
			}
		}
	}
	if (phr[0] === '!help') {
		message.author.send('Voici les commandes actuellement disponibles pour vous : \n\
		!help : vous envoie toute la liste des commandes disponibles \n\
monnaie : \n\
		!balance mount : donne la somme que vous posseder en ce moment \n\
		!balance pay [montant] [destinataire] : paye le destinataire du montant indiqué \n\
		!balance give [montant] [destinataire] : (ADMINISTRATEUR SEULEMENT) ajoute le montant au destinataire\n\
		!balance remove [montant] [destinataire] : (ADMINISTRATEUR SEULEMENT) retire le montant du destinataire');
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

client.login('NjY0OTM4MDY5MTk1MjI3MTU2.Xhr98w.ZAYn-ae1jQT2m0koxB5FM8RpNh4');
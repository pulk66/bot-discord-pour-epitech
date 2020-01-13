//RENTRER LE TOKEN DU BOT
const TOKEN = "NjY0OTM4MDY5MTk1MjI3MTU2.Xht_MQ.hpKoGKW4D8WNq4Vheho3KTgmEcY";

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
let fichier_balance = fs.readFileSync('argent.json');
let balance = JSON.parse(fichier_balance);
let fichier_meme_categories = fs.readFileSync('meme_categories.json');
let meme_categories = JSON.parse(fichier_meme_categories);
let fichier_meme_a_valider = fs.readFileSync('meme_a_valider.json');
let meme_a_valider = JSON.parse(fichier_meme_a_valider);
let fichier_all_meme = fs.readFileSync('all_meme.json');
let all_meme = JSON.parse(fichier_all_meme);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	const phr = message.content.split(' ');
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
				}
			} else {
				message.reply("Vous n'avez pas la permission d'utiliser cette commande");
			}
			fs.writeFileSync('argent.json', JSON.stringify(balance));				
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
		if (phr[1] === 'reset') {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				if (phr[2] === 'Confirm') {
					balance = {};
					message.reply("Toute l'économie a bien était remise a 0, plus personne n'a d'argent");
				} else {
					message.reply("Etes vous sur de ça ? Si vous faites cette commande vous aller supprimer l'argent de tout les utilisateur de ce serveur.\n\
				Pour confirmer tappez '!balance reset Confirm'");
				}
			} else {
				message.reply("Vous n'avez pas la permission d'utiliser cette commande");
			}
		}
		fs.writeFileSync('argent.json', JSON.stringify(balance));
	}
	if (phr[0] === '!meme') {
		if (phr[1] === 'add') {
			if (phr[2] === 'catégories') {
				if (message.member.hasPermission("ADMINISTRATOR")) {
					if (phr[3] === undefined) {
						message.reply("le nom de la catégorie n'a pas était mentionnée");
					} else {
						meme_categories.push(phr[3]);
						fs.writeFileSync('meme_categories.json', JSON.stringify(meme_categories));
						fs.writeFileSync(phr[3] + '.json', '[]');
						message.reply("La catégorie a bien était ajouter");
					}
				} else {
					message.reply("Vous n'avez pas la permission de faire cette commande");
				}
			}
			if (phr[2] === 'meme') {
				if (phr[4] === undefined) {
					message.reply("le nom ou l'url n'a pas était mentionnée");
				} else {
					if (all_meme[phr[3]] === undefined && meme_a_valider[phr[3]] === undefined) {
						meme_a_valider[phr[3]] = phr[4];
						fs.writeFileSync('meme_a_valider.json', JSON.stringify(meme_a_valider));
						message.reply("la proposition a bien était faites");
					} else {
						message.reply("le nom proposé est déja pris");
					}
				}
			}
		}
		if (phr[1] === 'remove') {
			if (phr[2] === 'catégories') {
				if (message.member.hasPermission("ADMINISTRATOR")) {
					if (phr[3] === undefined) {
						message.reply("Le nom de la catégorie n'a pas était mentionnée");
					} else {
						const index = meme_categories.indexOf(phr[3]);
						meme_categories.splice(index, 1);
						if (index < 0) {
							message.reply("la catégorie n'existe pas");
						} else {
							message.reply("la catégorie a bien était enlevé");
						}
						fs.writeFileSync('meme_categories.json', JSON.stringify(meme_a_valider));
					}
				} else {
					message.reply("Vous n'avez pas la permission de faire cette commande");
				}
			}
		}
		if (phr[1] === 'catégories') {
			var txt = "";
			for (element in meme_categories) {
				txt += "- ";
				txt += meme_categories[element];
				txt += "\n";
			}
			message.reply(txt);
		}
	}
	if (phr[0] === '!help') {
		message.author.send('Voici les commandes actuellement disponibles pour vous : \n\
		!help : vous envoie toute la liste des commandes disponibles \n\
monnaie : \n\
		!balance mount : donne la somme que vous posseder en ce moment \n\
		!balance pay [montant] [destinataire] : paye le destinataire du montant indiqué \n\
		!balance give [montant] [destinataire] : (ADMINISTRATEUR SEULEMENT) ajoute le montant au destinataire\n\
		!balance remove [montant] [destinataire] : (ADMINISTRATEUR SEULEMENT) retire le montant du destinataire\n\
		!balance reset : (ADMINISTRATEUR SEULEMENT) remet à 0 l\'argent de tout les utilisateur');
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

client.login(TOKEN);
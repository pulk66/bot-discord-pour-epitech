//RENTRER LE TOKEN DU BOT
const TOKEN = "NjY0OTM4MDY5MTk1MjI3MTU2.Xig48Q.70MbIsgFRdsfez50xwtrCUECs8E";

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
let fichier_balance = fs.readFileSync('../file/money/argent.json');
let balance = JSON.parse(fichier_balance);
let fichier_meme_categories = fs.readFileSync('../file/meme/meme_categories.json');
let meme_categories = JSON.parse(fichier_meme_categories);
let fichier_meme_a_valider = fs.readFileSync('../file/meme/meme_a_valider.json');
let meme_a_valider = JSON.parse(fichier_meme_a_valider);
let fichier_all_meme = fs.readFileSync('../file/meme/all_meme.json');
let all_meme = JSON.parse(fichier_all_meme);
let fichier_invite = fs.readFileSync('../file/game/invite.json');
let invite = JSON.parse(fichier_invite);
let fichier_current_game = fs.readFileSync('../file/game/current_game.json');
let current_game = JSON.parse(fichier_current_game);
let playlist_name_fichier = fs.readFileSync('../file/music/playlist_name.json');
let playlist_name = JSON.parse(playlist_name_fichier);
let all_music_fichier = fs.readFileSync('../file/music/all_music.json');
let all_music = JSON.parse(all_music_fichier);

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	const phr = message.content.split(' ');
	if (phr[0] === '!song') {
		if (message.member.voiceChannelID === undefined) {
			message.reply("connecter vous sur un vocal");
			console.log(message.member);
		} else if (phr[1] === 'play') {
			if (phr[2] === undefined) {
				message.reply("Vous n'avez pas mentionnée de chanson ou de playlist a lancer");
			} else if (phr[2].startsWith('http')) {
				var voiceChannel = message.member.voiceChannel
				voiceChannel.join().then(connection =>  {
					const stream = ytdl(phr[2]);
					const dispatcher = connection.playStream(stream);
				});
			} else if (phr[2] === 'playlist') {
				if (phr[3] === undefined) {
					message.reply("Le nom n'a pas était mentionnée");
				} else if (playlist_name[phr[3]] === undefined) {
					message.reply("la playlist n'existe pas");
				} else {
					message.reply("lancer la playlist");
				}
			} else if (all_music[phr[2]] === undefined) {
				message.reply("la musique n'est pas dans les fichier");
			} else {
				var voiceChannel = message.member.voiceChannel
				voiceChannel.join().then(connection =>  {
					const stream = ytdl(all_music[phr[2]]);
					const dispatcher = connection.playStream(stream);
				});
			}
		}
		if (phr[1] === 'music') {
			if (phr[2] === 'add') {
				if (phr[4] === undefined) {
					message.reply("l'url ou le nom de la musique n'a pas était mentionnée");
				} else if (all_music[phr[3]] === undefined) {
					all_music[phr[3]] = phr[4];
					fs.writeFileSync('../file/music/all_music.json', all_music);
				} else {
					message.reply("le nom de la musique existe déja");
				}
			}
			if (phr[2] === 'remove') {
				if (phr[3] === undefined) {
					message.reply("Vous n'avez pas mentionnée le nom de la musique");
				} else if (all_music[phr[3]] === undefined) {
					message.reply("le nom de la musique n'existe pas");
				} else {
					delete all_music[phr[3]];
					fs.writeFileSync('../file/music/all_music.json', all_music);
				}
			}
		}
		if (phr[1] === 'playlist') {
			if (phr[2] === 'add') {
				if (message.member.hasPermission("ADMINISTRATOR")) {
					if (phr[3] === 'music') {
						if (phr[4] === undefined) {
							message.reply("Vous n'avez pas mentionnée le nom de la musique");
						} else if (playlist_name.indexOf(phr[4]) >= 0) {
							let fichier = fs.readFileSync('../file/music/' + phr[4] + '.json');
							let list = JSON.parse(fichier);
						} else {
							message.reply("le nom de la playlist n'existe pas");
						}
					} else {
						if (phr[4] === undefined) {
							message.reply("Vous n'avez pas mentionnée le nom de la playlist");
						} else if (playlist_name.indexOf(phr[4]) < 0) {
							playlist_name.push(phr[4]);
							fs.writeFileSync('../file/music/playlist_name.json', playlist_name);
						} else {
							message.reply("Le nom de la playlist existe déja");
						}
					}
				} else {
					message.reply("Vous n'avez pas la permission de faire cette commande");
				}
			}
			if (phr[2] === 'remove') {
				if (message.member.hasPermission("ADMINISTRATOR")) {
					if (phr[3] === undefined) {
						message.reply("Vous n'avez pas mentionnée le nom de la playlist");
					} else if (playlist_name.indexOf(phr[3]) < 0) {
						message.reply("le nom de la playlist n'existe pas");
					} else {
						playlist_name.splice(playlist_name.indexOf[phr[3]], 1);
						fs.unlinkSync("../file/music/" + phr[3] + '.json');
					}
				} else {
					message.reply("Vous n'avez pas la permission de faire cette commande");
				}
			}
		}
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
			fs.writeFileSync('../file/money/argent.json', JSON.stringify(balance));				
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
		fs.writeFileSync('../file/money/argent.json', JSON.stringify(balance));
	}
	if (phr[0] === '!meme') {
		if (phr[1] === 'add') {
			if (phr[2] === 'catégories') {
				if (message.member.hasPermission("ADMINISTRATOR")) {
					if (phr[3] === undefined) {
						message.reply("le nom de la catégorie n'a pas était mentionnée");
					} else {
						meme_categories.push(phr[3]);
						fs.writeFileSync('../file/meme/meme_categories.json', JSON.stringify(meme_categories));
						fs.writeFileSync("../file/meme/" + phr[3] + '.json', '[]');
						message.reply("La catégorie a bien était ajouter");
					}
				} else {
					message.reply("Vous n'avez pas la permission de faire cette commande");
				}
			}
			if (phr[2] === 'meme') {
				if (phr[4] === undefined) {
					message.reply("le nom ou l'url n'a pas était mentionnée");
				} else if (all_meme[phr[3]] === undefined && meme_a_valider[phr[3]] === undefined) {
					meme_a_valider[phr[3]] = phr[4];
					fs.writeFileSync('../file/meme/meme_a_valider.json', JSON.stringify(meme_a_valider));
					message.reply("la proposition a bien était faites");
				} else {
					message.reply("le nom proposé est déja pris");
				}
			}
		}
		if (phr[1] === 'check') {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				let txt = "";
				message.reply("Voici la liste des meme a vérifier");
				for (element in meme_a_valider) {
					txt += "- ";
					txt += element + " : " + meme_a_valider[element];
					message.channel.send(txt);
					txt = "";
				}
			} else {
				message.reply("Vous n'avez pas la permission de faire cette commande");
			}
		}
		if (phr[1] === 'valid') {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				if (phr[3] === undefined) {
					message.reply("le nom ou la catégorie du meme n'a pas était mentionnée");
				} else if (meme_categories.indexOf(phr[3]) < 0) {
					message.reply("La catégorie mentionnée n'existe pas");
				} else if (meme_a_valider[phr[2]] === undefined) {
					message.reply("le nom n'est pas dans la liste des meme a valider");
				} else {
					let fichier = fs.readFileSync("../file/meme/" + phr[3] + '.json');
					let list = JSON.parse(fichier);
					all_meme[phr[2]] = meme_a_valider[phr[2]];
					fs.writeFileSync('../file/meme/all_meme.json', JSON.stringify(all_meme));
					list.push(phr[2]);
					fs.writeFileSync("../file/meme/" + phr[3] + '.json', JSON.stringify(list));
					delete meme_a_valider[phr[2]];
					fs.writeFileSync('../file/meme/meme_a_valider.json', JSON.stringify(meme_a_valider));
					message.reply("le meme est validé");

				}
			} else {
				message.reply("Vous n'avez pas la permission de faire cette commande");
			}
		}
		if (phr[1] === 'remove') {
			if (phr[2] === 'catégories') {
				if (message.member.hasPermission("ADMINISTRATOR")) {
					if (phr[3] === undefined) {
						message.reply("Le nom de la catégorie n'a pas était mentionnée");
					} else if (meme_categories.indexOf(phr[3]) < 0) {
						message.reply("la catégorie n'existe pas");
					} else {
						let fichier = fs.readFileSync("../file/meme/" + phr[3] + '.json');
						let list = JSON.parse(fichier);
						for (element in list) {
							delete all_meme[list[element]];
						}
						fs.writeFileSync('../file/meme/all_meme.json', JSON.stringify(all_meme));
						meme_categories.splice(meme_categories.indexOf(phr[3]), 1);
						fs.unlinkSync("../file/meme/" + phr[3] + '.json');
						message.reply("la catégorie a bien était enlevé");
					}
					fs.writeFileSync('../file/meme/meme_categories.json', JSON.stringify(meme_categories));
				} else {
					message.reply("Vous n'avez pas la permission de faire cette commande");
				}
			}
			if (phr[2] === 'meme') {
				if (message.member.hasPermission("ADMINISTRATOR")) {
					if (phr[4] === undefined) {
						message.reply("le nom du meme ou la catégorie n'a pas était indiqué");
					} else if (meme_categories.indexOf(phr[4]) < 0) {
						message.reply("La catégorie n'existe pas");
					} else {
						let fichier = fs.readFileSync("../file/meme/" + phr[4] + ".json");
						let list = JSON.parse(fichier);
						if (list.indexOf(phr[3]) < 0) {
							message.reply("le meme n'existe pas dans cette catégorie");
						} else {
							list.splice(list.indexOf(phr[3]), 1);
							fs.writeFileSync("../file/meme/" + phr[4] + '.json', JSON.stringify(list));
							delete all_meme[phr[3]];
							fs.writeFileSync('../file/meme/all_meme.json', JSON.stringify(all_meme));
							message.reply("Le meme a bien était supprimer");
						}
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
		if (phr[1] === 'random') {
			const size = Object.keys(all_meme).length;
			let random = getRandomInt(size);
			message.reply({file: all_meme[Object.keys(all_meme)[random]]});
		}
		if (phr[1] === 'all_meme') {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				for (element in all_meme) {
					message.channel.send(element,{file: all_meme[element]});
				}
			} else {
				message.reply("Vous n'avez pas la permission d'utiliser cette commande");
			}
		}
		if (meme_categories.indexOf(phr[1]) >= 0) {		
			let fichier = fs.readFileSync("../file/meme/" + phr[1] + ".json");
			let list = JSON.parse(fichier);
			message.reply({file: all_meme[list[Object.keys(list)[getRandomInt(Object.keys(list).length + 1)]]]});
		} 
	}
	if (phr[0] === '!game') {
		if (phr[1] === 'invite') {
			if (phr[2] === 'list') {
				if (phr[3] === 'all') {
					if (message.member.hasPermission("ADMINISTRATOR")) {
						for (element in invite) {
							message.channel.send(`<@${invite[element][0]}> invite <@${invite[element][1]}> a jouer au ${invite[element][2]}`);
						}
					} else {
						message.reply("Vous n'avez pas la permission de faire cette commande");
					}
				} else {
					message.reply("Voici les invitations que vous avez :");
					for (element in invite) {
						if (invite[element][0] === message.member.id || invite[element][1] === message.member.id) {
							message.channel.send(`<@${invite[element][0]}> invite <@${invite[element][1]}> a jouer au ${invite[element][2]}`);
						}
					}
				}
			}
			if (phr[2] === 'accept') {
				if (phr[3] === undefined) {
					message.reply("le pseudo de l'invitation n'a pas était mentionnée");
				} else {
					for (element in invite) {
						let envoyeur = phr[3].substring(3, phr[3].length - 1);
						if (invite[element][0] === envoyeur && invite[element][1] === message.member.id) {
							let i = 0;
							while (!(current_game[i] === undefined)) {
								i++;
							}
							message.channel.send(`<@${invite[element][0]}> a accepter l'invitation de <@${invite[element][1]}>`);
							current_game[i] = [invite[element][0], invite[element][1], invite[element][2]];
							fs.writeFileSync('../file/game/current_game.json', JSON.stringify(current_game));
							invite.splice(invite.indexOf(element), 1);
							fs.writeFileSync('../file/game/invite.json', JSON.stringify(invite));
						}
					}
				}
			}
			if (phr[2] === 'refuse') {
				if (phr[3] === undefined) {
					message.reply("Le pseudo de l'invitation n'a pas était mentionnée");
				} else {
					for (element in invite) {
						let envoyeur = phr[3].substring(3, phr[3].length - 1);
						if (invite[element][0] === envoyeur && invite[element][1] === message.member.id) {
							invite.splice(invite.indexOf(element), 1);
							fs.writeFileSync('../file/game/invite.json', JSON.stringify(invite));
							message.channel.send(`<@${message.member.id}> a refuser l'invitation de ${phr[3]}`);
						}
					}
				}
			}
		}
		if (phr[1] === 'morpion') {
			if (phr[2] === 'invite') {
				if (phr[3] === undefined) {
					message.reply("Vous n'avez pas mentionnée contre qui vous voulez jouer");
				} else {
					let player1 = message.member.id;
					let player2 = phr[3].substring(3, phr[3].length - 1);
					let i = 0;
					let possibility = true;
					while (!(invite[i] === undefined)) {
						if (!(invite[i] === undefined)) {
							if (invite[i][0] === player1 && invite[i][1] === player2 && invite[i][2] === "morpion") {
								possibility = false;
							}
						}
						i++;
					}
					if (possibility) {
						invite[i] = [player1, player2, "morpion"];
						message.channel.send(`<@${player2}>, Voulez vous jouer contre <@${player1}> ?`);
					} else {
						message.reply("vous avez déja fait une invitation pour cette personne");
					}
					fs.writeFileSync("../file/game/invite.json", JSON.stringify(invite));
				}
			}
		}
	}
	if (phr[0] === '!help') {
		message.author.send('Voici les commandes actuellement disponibles pour vous : \n\
		\n\
		!help : vous envoie toute la liste des commandes disponibles \n\
		\n\
monnaie : \n\
		!balance mount : donne la somme que vous posseder en ce moment \n\
		!balance pay [montant] [destinataire] : paye le destinataire du montant indiqué \n\
		!balance give [montant] [destinataire] : (ADMINISTRATEUR SEULEMENT) ajoute le montant au destinataire\n\
		!balance remove [montant] [destinataire] : (ADMINISTRATEUR SEULEMENT) retire le montant du destinataire\n\
		!balance reset : (ADMINISTRATEUR SEULEMENT) remet à 0 l\'argent de tout les utilisateur\n\
		\n\
meme : \n\
		!meme catégories : permet de lister toutes les catégories existantes \n\
		!meme add meme [nom] [url] : permet de faire la proposition d\'un meme \n\
		!meme add catégorie [nom] : (ADMINISTRATEUR SEULEMENT) permet de créer une catégorie \n\
		!meme random : permet d\'afficher un meme random parmis tout les meme existants \n\
		!meme [catégorie] : permet d\'afficher un meme de la catégorie voulu \n\
		!meme valid [nom] [catégorie] : (ADMINISTRATEUR SEULEMENT) permet de ranger un meme proposé dans une catégorie déja créer \n\
		!meme all_meme : (ADMINISTRATEUR SEULEMENT) permet d\'afficher tout les meme existant validée \n\
		!meme check : (ADMINISTRATEUR SEULEMENT) permet de voir tout les meme qui ont était proposé \n\
		!meme remove catégories [nom] : (ADMINISTRATEUR SEULEMENT) permet de supprimer une catégorie complète et tout ses memes \n\
		!meme remove meme [nom] [catégorie] : (ADMINISTRATEUR SEULEMENT) permet de supprimer un meme avec son nom et sa catégorie');
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
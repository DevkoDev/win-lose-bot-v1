const data = require("./data.json");
const config = require("./config.json");
const fs = require('fs')
var moment = require('moment');

const {
    Client,
    Intents,
    MessageEmbed
} = require('discord.js');
const {
    openStdin
} = require("process");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

client.login(config.botToken);

client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
});
let Data = data

let list = []
for (let index = 0; index < 14; index++) {
    list.push("You threw your bean bag far to short");
    list.push("You threw your bean bag far to far");
    list.push("You threw your bean bag far to wide");
    list.push("Oops, you lost the cornhole match!");
    list.push("You hit someone in the sack, come back tomorrow.");
    list.push("Your beanbag ripped open! Come back later.");
    list.push("You spawned in with no bean bag, Try again.");
    list.push("You didn't throw the bag, Party foul. ");
    list.push("You threw the bag backwards, L.");
    list.push("You broke the board, Pay up.");
    list.push("You placed the beanbag in the hole while the other person was looking away. Cheating is no way to get into the fren club. Come back tomorrow.");
    list.push("You threw the beanbag into the ocean, no one wins gg.");
    list.push("You threw the beanbag into your own hole. What are you doing? Game over.");
}

list.push("Woohoo, you made it! Cya in the club.");
list.push("Score! Welcome to the frens club.");
list.push("You lost, but you are throwing up a rainbow, YOU'RE IN BRO!");

client.on('messageCreate', message => {
    try {
        let d = new Date()
        let role = message.guild.roles.cache.get(`${config.roleID}`);
        if (message.content.startsWith(config.command)) {
            let test = Data.id[message.author.id];
            if (test == undefined) {
                // new user
                let randomElement = Math.floor(Math.random() * list.length)

                if (randomElement >= (list.length - 3)) {
                    const exampleEmbed = new MessageEmbed()
                        .setColor('#00FF00')
                        .setTitle('Boarding success!')
                        .setDescription(list[randomElement] + ` - <@${message.author.id}>`)
                        .setFooter({
                            text: "The role has been assigned."
                        });

                    message.channel.send({
                        embeds: [exampleEmbed]
                    });
                    message.member.roles.add(role);
                }
                if (randomElement < (list.length - 3)) {
                    const exampleEmbed = new MessageEmbed()
                        .setColor('#FF0000')
                        .setTitle('Boarding failure')
                        .setDescription(list[randomElement] + ` - <@${message.author.id}>`)
                        .setFooter({
                            text: "Try again after 24h."
                        });

                    message.channel.send({
                        embeds: [exampleEmbed]
                    });
                }
                Data.id[message.author.id] = (moment(d.getTime()).unix())
                Data.result[message.author.id] = randomElement
            } else {
                // old user
                if (test + (24 * 60 * 60) < (moment(d.getTime()).unix()) && Data.result[message.author.id] < (list.length - 3)) {
                    let randomElement = Math.floor(Math.random() * list.length)
                    if (randomElement >= (list.length - 3)) {

                        const exampleEmbed = new MessageEmbed()
                            .setColor('#00FF00')
                            .setTitle('Boarding success!')
                            .setDescription(list[randomElement] + ` - <@${message.author.id}>`)
                            .setFooter({
                                text: "The role has been assigned."
                            });

                        message.channel.send({
                            embeds: [exampleEmbed]
                        });
                        message.member.roles.add(role);
                    }
                    if (randomElement < (list.length - 3)) {
                        const exampleEmbed = new MessageEmbed()
                            .setColor('#FF0000')
                            .setTitle('Boarding failure')
                            .setDescription(list[randomElement] + ` - <@${message.author.id}>`)
                            .setFooter({
                                text: "Try again after 24h."
                            });

                        message.channel.send({
                            embeds: [exampleEmbed]
                        });

                    }
                    Data.id[message.author.id] = (moment(d.getTime()).unix())
                    Data.result[message.author.id] = randomElement
                } else {
                    if (Data.result[message.author.id] >= (list.length - 3)) {

                        const exampleEmbed = new MessageEmbed()
                            .setColor('#00FF00')
                            .setTitle('Boarding success!')
                            .setDescription(list[Data.result[message.author.id]] + ` - <@${message.author.id}>`)
                            .setFooter({
                                text: "The role has been assigned."
                            });

                        message.channel.send({
                            embeds: [exampleEmbed]
                        });
                        message.member.roles.add(role);
                    }
                    if (Data.result[message.author.id] < (list.length - 3)) {
                        const exampleEmbed = new MessageEmbed()
                            .setColor('#FF0000')
                            .setTitle('Boarding failure')
                            .setDescription(list[Data.result[message.author.id]] + ` - <@${message.author.id}>`)
                            .setFooter({
                                text: "Try again later." + ` -- ${moment.duration(Data.id[message.author.id] - (moment(d.getTime()).unix()) ,'seconds').humanize()} left`
                            });

                        message.channel.send({
                            embeds: [exampleEmbed]
                        });

                    }

                }
            }
            fs.writeFile('data.json', JSON.stringify(Data), function (err) {
                if (err) throw err;

            });
        }
    } catch (error) {
        console.log(error)
    }

})

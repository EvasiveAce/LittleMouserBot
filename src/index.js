require('dotenv').config();
var cron = require("cron");

const {Client, GatewayIntentBits, EmbedBuilder, PermissionBitField, Permissions, SlashCommandBuilder} = require ('discord.js');
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});


client.on("ready", (x) => {
    console.log(`${x.user.tag} is ready.`)
    client.user.setActivity('Scavenging for Cheese - !cheeseme')
    fetchAllMessages()

    const cheeseme = new SlashCommandBuilder()
    .setName('cheeseme')
    .setDescription('Shows a funny Cheese World moment');

    client.application.commands.create(cheeseme);
})

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName==='cheeseme'){
        randomImage()
        interaction.reply(imageToSend)
    }
  })

const messages = [];
let imageToSend = "";

let refresh = new cron.CronJob('00 00 00 * * *', () => {
  fetchAllMessages();
});


async function fetchAllMessages() {
    const cwMoments = client.channels.cache.get("820332605543022622");
  
    // Create message pointer
    let message = await cwMoments.messages
      .fetch({ limit: 1 })
      .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
  
    while (message) {
      await cwMoments.messages
        .fetch({ limit: 100, before: message.id })
        .then(messagePage => {
          messagePage.forEach(msg => messages.push(msg));
  
          // Update our message pointer to be the last message on the page of messages
          message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
        });
    }
  
    //const randomElement = messages[Math.floor(Math.random() * messages.length)];
    console.log(messages[0]);  // Print all messages
    
  }

client.on('messageCreate', async message => {
    if (message.content === '!cheeseme') {
        randomImage()
        message.channel.send(imageToSend)
        
    }
    if (message.content === '🧀') {
        message.channel.send("*Gulp*")
    }
    if (message.content === '🪤') {
        message.channel.send("*Eek!!*")
    }
})


async function randomImage() {
    const randomElement = messages[Math.floor(Math.random() * messages.length)];
    if (randomElement.attachments.size > 0) {
         randomElement.attachments.forEach(Attachment => {
            imageToSend = Attachment.url
         })
    } else {
        randomImage()
    }
}

refresh.start()
client.login(process.env.TOKEN);


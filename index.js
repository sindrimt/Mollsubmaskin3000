import Discord from "discord.js";
import "dotenv/config";

import { main } from "./mollsub.js";

const client = new Discord.Client({ intents: 32767 });
const prefix = process.env.PREFIX;

client.on("ready", (message) => {
    console.log("serving");
    client.channels.fetch("880738403040239678").then((channel) => {
        //channel.send("test");
    });
});

client.on("messageCreate", (message) => {
    // If message starts with prefix, we do the following under
    if (message.content.startsWith(prefix)) {
        let userMessage = message.content.split(prefix)[1].trim();
        console.log(userMessage);

        message.channel.send(`Checking if "${userMessage}" has mollsub . . .`);

        return main(userMessage)
            .then((result) => {
                console.log(result);
                message.channel.send(`:partying_face: ${userMessage} is ${result} :partying_face:`);
            })
            .catch((err) => {
                console.log(err);
                message.channel.send(`${userMessage} is not mollsub :(`);
            });
    }
});

client.login(process.env.SECRET_TOKEN);

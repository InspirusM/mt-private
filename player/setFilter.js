const { MessageEmbed } = require('discord.js');

module.exports = async (msg, player, filter, state) => {

  const delay = ms => new Promise(res => setTimeout(res, ms))
  
  if(filter === "reset") {
    player.node.send({
       op: "filters",
       guildId: msg.guild.id,
       ...msg.client.filters.reset
     });
   let m = await msg.channel.send(`Disabling **${filter}**. It may take few seconds...`)
   let embed = new MessageEmbed()
   .setDescription(`Disabled ${filter}`)
   .setColor(msg.client.utils.hexColor);
   await delay(6100);
   return m.edit('', embed);
 }   

  if(!state) {
     player.node.send({
        op: "filters",
        guildId: msg.guild.id,
        ...msg.client.filters.reset
      });
    let m = await msg.channel.send(`Disabling **${filter}**. It may take few seconds...`)
    let embed = new MessageEmbed()
    .setDescription(`Disabled ${filter}`)
    .setColor(msg.client.utils.hexColor);
    await delay(6100);
    return m.edit('', embed);
  } else if(state) {
    switch (filter) {
      case 'bass': 
        player.node.send({
        op: "filters",
        guildId: msg.guild.id,
        ...msg.client.filters.bass
      });
      break;
      case 'bassboost':
        player.setEQ(...Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.65 })));
      break;
      case 'nightcore':
        player.node.send({
        op: "filters",
        guildId: msg.guild.id,
        ...msg.client.filters.nightcore
      });
      break;
    }
  };
  
  const m = await msg.channel.send(`Enabling **${filter}**. It may take few seconds...`)
  const embed = new MessageEmbed()
  .setDescription(`Enabled ${filter}`)
  .setColor(msg.client.utils.hexColor);
  await delay(6100)
  return m.edit('', embed);
  
  
};
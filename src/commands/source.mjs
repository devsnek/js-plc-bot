import env from '../env';

discord.interactions.commands.register({
  name: 'source',
  description: 'Get my source!',
}, async (interaction) => {
  await interaction.respond(env.SOURCE_URL);
});

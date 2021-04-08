import env from '../env';
import { slashCommand } from '../slash';

discord.interactions.commands.register({
  name: 'source',
  description: 'Get my source!',
}, slashCommand(async (interaction) => {
  await interaction.respond(env.SOURCE_URL);
}));

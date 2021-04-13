import env from '../env';
import { slashCommand } from '../slash';

const { SELF_ASSIGN_PREFIX } = env;

const group = discord.interactions.commands.registerGroup({
  name: 'roles',
  description: 'group commands',
});

async function getRoles(interaction) {
  const guild = await interaction.getGuild();
  return (await guild.getRoles())
    .filter((r) => r.name.startsWith(SELF_ASSIGN_PREFIX))
    .map((r) => ({ id: r.id, name: r.name.slice(SELF_ASSIGN_PREFIX.length) }));
}

group.register({
  name: 'list',
  description: 'list available roles for self assignment',
}, slashCommand(async (interaction) => {
  const roles = await getRoles(interaction);
  await interaction.respond(roles.map((r) => `"${r.name}"`).join(', '));
}));

group.register({
  name: 'toggle',
  description: 'toggle a self-assignable role',
  options: (opts) => ({
    name: opts.string('name of role'),
  }),
}, slashCommand(async (interaction, { name }) => {
  const roles = await getRoles(interaction);
  const role = roles.find((r) => r.name === name);
  if (role) {
    if (interaction.member.roles.includes(role.id)) {
      await interaction.member.removeRole(role.id);
      await interaction.respond(`The "${role.name}" role has been removed!`);
    } else {
      await interaction.member.addRole(role.id);
      await interaction.respond(`You now have the "${role.name}" role!`);
    }
  } else {
    await interaction.respond('Unknown role. Use `/roles list` to see available roles.');
  }
}));

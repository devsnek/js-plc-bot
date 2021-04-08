import * as tags from '../tags';
import { checkStaff } from '../moderation';
import { slashCommand } from '../slash';

const group = discord.interactions.commands.registerGroup({
  name: 'tags',
  description: 'tag management',
});

group.register({
  name: 'learn',
  description: 'Learn something new',
  options: (opt) => ({
    name: opt.string('name of thing to learn'),
    value: opt.string('thing to learn'),
  }),
}, slashCommand(async (interaction, { name, value }) => {
  await checkStaff(interaction);
  await tags.put(name, value);
  await interaction.respond(`Learned "${name}":\n${value}`);
}));

group.register({
  name: 'forget',
  description: 'Forget something',
  options: (opt) => ({
    name: opt.string('name of thing to forget'),
  }),
}, slashCommand(async (interaction, { name }) => {
  await checkStaff(interaction);
  await tags.delete(name);
  await interaction.respond(`"${name}" has been unlearned`);
}));

group.register({
  name: 'alias',
  description: 'Alias a name to something previously learned',
  options: (opt) => ({
    to: opt.string('name of learned thing'),
    from: opt.string('name of alias'),
  }),
}, slashCommand(async (interaction, { from, to }) => {
  await checkStaff(interaction);
  await tags.alias(from, to);
  await interaction.respond(`Created an alias from "${from}" to "${to}"`);
}));

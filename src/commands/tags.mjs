import * as tags from '../tags';
import { checkStaff } from '../moderation';

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
}, async (interaction, { name, value }) => {
  try {
    await checkStaff(interaction);
    await tags.put(name, value);
    await interaction.respond(`Learned "${name}":\n${value}`);
  } catch (e) {
    await interaction.respond(e.message);
  }
});

group.register({
  name: 'forget',
  description: 'Forget something',
  options: (opt) => ({
    name: opt.string('name of thing to forget'),
  }),
}, async (interaction, { name }) => {
  try {
    await checkStaff(interaction);
    await tags.delete(name);
    await interaction.respond(`"${name}" has been unlearned`);
  } catch (e) {
    await interaction.respond(e.message);
  }
});

group.register({
  name: 'alias',
  description: 'Alias a name to something previously learned',
  options: (opt) => ({
    to: opt.string('name of learned thing'),
    from: opt.string('name of alias'),
  }),
}, async (interaction, { from, to }) => {
  try {
    await checkStaff(interaction);
    await tags.alias(from, to);
    await interaction.respond(`Created an alias from "${from}" to "${to}"`);
  } catch (e) {
    await interaction.respond(e.message);
  }
});

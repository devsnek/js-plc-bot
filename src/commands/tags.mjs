import * as tags from '../tags';

export async function learn(message) {
  const [rawName, rawValue] = message.content.split('=');
  const name = rawName.trim().toLowerCase();
  const value = rawValue.trim();
  try {
    await tags.put(name, value);
    await message.reply(`Learned "${name}":\n${value}`);
  } catch (e) {
    await message.reply(e.message);
  }
}
learn.staffOnly = true;

export async function unlearn(message) {
  const name = message.content.trim();
  try {
    await tags.delete(name);
    await message.reply(`"${name}" has been unlearned`);
  } catch (e) {
    await message.reply(e.message);
  }
}
unlearn.staffOnly = true;

export async function alias(message) {
  const [rawAlias, rawName] = message.content.split('=');
  const alias = rawAlias.trim().toLowerCase();
  const name = rawName.trim().toLowerCase();
  try {
    await tags.alias(alias, name);
    await message.reply(`Created an alias from "${alias}" to "${name}"`);
  } catch (e) {
    await message.reply(e.message);
  }
}
alias.staffOnly = true;

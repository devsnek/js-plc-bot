import { TAGS } from '../tags';

export async function learn(message) {
  const [rawName, rawValue] = message.content.split('=');
  const name = rawName.trim().toLowerCase();
  const value = rawValue.trim();
  const entry = await TAGS.get(name);
  if (typeof entry === 'object' && entry !== null) {
    await message.reply(
      `"${name}" is an alias and cannot be given a value.`,
    );
    return;
  }
  await TAGS.put(name, value);
  await message.reply(`Learned "${name}":\n${value}`);
}
learn.staffOnly = true;

export async function unlearn(message) {
  const name = message.content.trim();

  const entry = await TAGS.get(name);
  if (typeof entry === 'string'
      || (typeof entry === 'object' && entry !== null)) {
    await TAGS.delete(name);
    await message.reply(`"${name}" has been unlearned`);
  } else {
    await message.reply(`"${name}" was never learned`);
  }
}
unlearn.staffOnly = true;

export async function alias(message) {
  const [rawAlias, rawName] = message.content.split('=');
  const alias = rawAlias.trim().toLowerCase();
  const name = rawName.trim().toLowerCase();
  await TAGS.put(alias, { alias: name });
  await message.reply(`Created an alias from "${alias}" to "${name}"`);
}
alias.staffOnly = true;

import env from '../env';

export async function source(message) {
  await message.reply(`${message.author.toMention()}, My source is available at ${env.SOURCE_URL}`);
}

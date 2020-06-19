import * as commands from '.';

export async function help(message) {
  await message.reply(`Available commands:\n${Object.keys(commands).join(', ')}`);
}

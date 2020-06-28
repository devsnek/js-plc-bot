import * as commands from './commands';
import * as tags from './tags';
import { checkDisplayName } from './moderation';
import env from './env';

const {
  STAFF_ROLE_ID,
  PYLON_BOT_ID,
  TAG_PREFIX,
} = env;

const COMMAND_PREFIX = new RegExp(String.raw`^<@!?${PYLON_BOT_ID}>`);

discord.registerEventHandler('MESSAGE_CREATE', async (message) => {
  if (message.author.bot || !(message instanceof discord.GuildMemberMessage)) {
    return;
  }

  if (message.content.startsWith(TAG_PREFIX)) {
    const match = message.content.match(/<@!?\d+>$/);
    let tagName;
    if (match) {
      tagName = message.content
        .slice(TAG_PREFIX.length)
        .slice(0, -match[0].length)
        .trim();
    } else {
      tagName = message.content.slice(TAG_PREFIX.length);
    }
    const entry = await tags.get(tagName);
    if (entry !== null) {
      if (match) {
        await message.reply(`${match[0]}, ${entry}`);
      } else {
        await message.reply(entry);
      }
    }
  } else if (COMMAND_PREFIX.test(message.content)) {
    const replaced = message.content.replace(COMMAND_PREFIX, '').trim();
    const commandName = replaced.split(/\b/)[0];
    if (commandName in commands) {
      const isStaff = message.member.roles.includes(STAFF_ROLE_ID);
      const command = commands[commandName];
      if (!isStaff && command.staffOnly) {
        await message.reply(`${message.author.toMention()}, You don't have permission to use this command`);
        return;
      }
      message.content = replaced.slice(commandName.length + 1);
      try {
        await command(message);
      } catch (e) {
        await message.reply(`${message.author.toMention()}, ${e.message}`);
      }
    }
  } else if (message.content.includes('www.w3schools.com')) {
    await message.reply(`${message.author.toMention()}, try to avoid w3schools.com. <https://developer.mozilla.org/> is a good alternative.`);
  }
});

discord.registerEventHandler('GUILD_MEMBER_UPDATE', async (member) => {
  await checkDisplayName(member);
});

discord.registerEventHandler('GUILD_MEMBER_ADD', async (member) => {
  await checkDisplayName(member);
});

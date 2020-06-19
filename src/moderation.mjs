import env from './env';

const { HOIST_REPLACEMENT_NICK } = env;

export async function checkDisplayName(member) {
  const displayName = member.nick || member.user.username;

  if (displayName.startsWith('!')) {
    await member.edit({
      nick: HOIST_REPLACEMENT_NICK,
    });
  }
}

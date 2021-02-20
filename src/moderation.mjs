import env from './env';

const { HOIST_REPLACEMENT_NICK, STAFF_ROLE_ID } = env;

export async function checkStaff(interaction) {
  const isStaff = interaction.member.roles.includes(STAFF_ROLE_ID);
  if (!isStaff) {
    throw new Error('You are not authorized');
  }
}

export async function checkDisplayName(member) {
  const displayName = member.nick || member.user.username;

  if (displayName.startsWith('!')) {
    await member.edit({
      nick: HOIST_REPLACEMENT_NICK,
    });
  }
}

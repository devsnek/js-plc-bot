export async function checkDisplayName(member) {
  const displayName = member.nick || member.user.username;

  if (displayName.startsWith('!')) {
    await member.edit({
      nick: '💩',
    });
  }
}

const SELF_ASSIGN_PREFIX = 'SA: ';

export async function role(message) {
  const guild = await message.getGuild();
  const roles = (await guild.getRoles())
    .filter((r) => r.name.startsWith(SELF_ASSIGN_PREFIX))
    .map((r) => ({ id: r.id, name: r.name.slice(SELF_ASSIGN_PREFIX.length) }));

  if (message.content === '') {
    await message.reply(`Available roles for self-assignment: ${roles.map((r) => `"${r.name}"`).join(', ')}`);
  } else {
    const role = roles.find((r) => r.name === message.content);
    if (role) {
      if (message.member.roles.includes(role.id)) {
        await message.member.removeRole(role.id);
        await message.reply(`The "${role.name}" role has been removed!`);
      } else {
        await message.member.addRole(role.id);
        await message.reply(`You now have the "${role.name}" role!`);
      }
    } else {
      await message.reply('Unknown role. Send `@Pylon role` to see available roles.');
    }
  }
}

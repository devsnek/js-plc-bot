export function slashCommand(f) {
  return async (interaction, ...args) => {
    try {
      await f(interaction, ...args);
    } catch (e) {
      await interaction.respond(`:x: ${e.message}`);
    }
  };
}

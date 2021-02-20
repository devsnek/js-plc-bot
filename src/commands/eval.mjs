import {
  Agent,
  setSurroundingAgent,
  ManagedRealm,
  Value,
  Type,
  CreateDataProperty,
  OrdinaryObjectCreate,
  inspect,
} from '@engine262/engine262';
import { burst } from '../burst';
import { checkStaff } from '../moderation';

function run(source, features) {
  const log = [];

  const agent = new Agent({ features });
  setSurroundingAgent(agent);

  const realm = new ManagedRealm();
  const s = realm.scope(() => {
    {
      const print = new Value((args) => {
        log.push(args.map((a) => inspect(a)).join(' '));
        return Value.undefined;
      });
      CreateDataProperty(realm.GlobalObject, new Value('print'), print);
    }

    {
      const console = OrdinaryObjectCreate(agent.intrinsic('%Object.prototype%'));
      CreateDataProperty(realm.GlobalObject, new Value('console'), console);

      [
        'log',
        'warn',
        'debug',
        'error',
      ].forEach((method) => {
        const fn = new Value((args) => {
          log.push(args.map((a, i) => {
            if (i === 0 && Type(a) === 'String') {
              return a.stringValue();
            }
            return inspect(a);
          }).join(' '));
          return Value.undefined;
        });
        CreateDataProperty(console, new Value(method), fn);
      });

      CreateDataProperty(console, new Value('clear'), new Value(() => {
        log.length = 0;
        return Value.undefined;
      }));
    }

    CreateDataProperty(
      realm.GlobalObject,
      new Value('spec'),
      new Value(([v]) => {
        if (v && v.nativeFunction && v.nativeFunction.section) {
          return new Value(v.nativeFunction.section);
        }
        return Value.undefined;
      }),
    );

    const result = realm.evaluateScript(source, { specifier: 'eval' });
    return inspect(result);
  });

  return { log, result: s };
}

discord.interactions.commands.register({
  name: 'eval',
  description: 'Run some JS in a sandbox',
  options: (opts) => ({
    source: opts.string('js source'),
  }),
}, async (interaction, { source }) => {
  const { log, result } = await burst(() => run(source, []));

  await interaction.respond(`\
\`\`\`js
${log.length > 0 ? `${log.join('\n')}` : result}
\`\`\`
`);
});

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
discord.interactions.commands.register({
  name: 'debug',
  description: 'debug',
  options: (opts) => ({
    source: opts.string('source'),
  }),
}, async (interaction, { source }) => {
  try {
    await checkStaff(interaction);
    const r = await AsyncFunction('pylon', 'discord', 'interaction', source)(pylon, discord, interaction);
    await interaction.respond(r === undefined ? 'undefined' : JSON.stringify(r));
  } catch (e) {
    await interaction.respond(e.message);
  }
});

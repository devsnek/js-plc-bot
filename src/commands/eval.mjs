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
import { burst } from '../burst.mjs';

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

    const result = realm.evaluateScript(source);
    return inspect(result);
  });

  return { log, result: s };
}

async function evil(message) {
  const {
    groups: {
      rawFeatures,
      defeatured,
    },
  } = /(--features=(?<rawFeatures>\S+) )?(?<defeatured>.*)/s.exec(message.content);
  const features = rawFeatures ? rawFeatures.split(',') : [];

  const source = defeatured
    .replace(/^\s*```(js|javascript)?/, '')
    .replace(/```\s*$/, '');

  const { log, result } = await burst(() => run(source, features));

  await message.reply(`${message.author.toMention()}
\`\`\`js
${log.length > 0 ? `${log.join('\n')}\n` : ''}${result}
\`\`\`
`);
}
export { evil as eval };

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
export async function debug(message) {
  const source = message.content
    .replace(/^```(js|javascript)?/, '')
    .replace(/```$/, '');
  const r = await AsyncFunction('pylon', 'discord', 'message', source)(pylon, discord, message);
  await message.reply(r === undefined ? 'undefined' : JSON.stringify(r));
}
debug.staffOnly = true;

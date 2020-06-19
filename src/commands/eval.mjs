import {
  Agent,
  Realm,
  Value,
  Object as APIObject,
  Abstract,
  inspect,
} from '@engine262/engine262';
import { burst } from '../burst.mjs';

function run(source) {
  const log = [];

  const agent = new Agent();

  const s = agent.scope(() => {
    const realm = new Realm();
    {
      const print = new Value(realm, (args) => {
        log.push(args.map((a) => inspect(a)).join(' '));
        return Value.undefined;
      }, [], realm);
      Abstract.CreateDataProperty(realm.global, new Value(realm, 'print'), print);
    }

    {
      const console = new APIObject(realm);
      Abstract.CreateDataProperty(realm.global, new Value(realm, 'console'), console);

      [
        'log',
        'warn',
        'debug',
        'error',
        'clear',
      ].forEach((method) => {
        const fn = new Value(realm, (args) => {
          log.push(args.map((a, i) => {
            if (i === 0 && Abstract.Type(a) === 'String') {
              return a.stringValue();
            }
            return inspect(a);
          }).join(' '));
          return Value.undefined;
        });
        Abstract.CreateDataProperty(console, new Value(realm, method), fn);
      });
    }

    Abstract.CreateDataProperty(
      realm.global,
      new Value(realm, 'spec'),
      new Value(realm, ([v]) => {
        if (v && v.nativeFunction && v.nativeFunction.section) {
          return new Value(realm, v.nativeFunction.section);
        }
        return Value.undefined;
      }),
    );

    const result = realm.evaluateScript(source);
    return inspect(result, realm);
  });

  return { log, result: s };
}

async function evil(message) {
  const source = message.content
    .replace(/^```(js|javascript)?/, '')
    .replace(/```$/, '');

  const { log, result } = await burst(() => run(source));

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
  const r = AsyncFunction('pylon', 'discord', 'message', source)(pylon, discord, message);
  await message.reply(JSON.stringify(await r));
}
debug.staffOnly = true;

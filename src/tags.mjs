const TAGS = new pylon.KVNamespace('tags');

export async function put(name, value) {
  const entry = await TAGS.get(name);
  if (typeof entry === 'object') {
    throw new Error(`"${name}" is an alias and cannot be given a value.`);
  }
  await TAGS.put(name, value);
}

async function delete_(name) {
  const entry = await TAGS.get(name);
  if (entry === undefined) {
    throw new Error(`"${name}" does not exist`);
  }
  await TAGS.delete(name);
}
export { delete_ as delete };

export async function alias(alias, name) {
  const entry = await TAGS.get(name);
  if (entry === undefined) {
    throw new Error(`"${name}" does not exist`);
  }
  if (typeof entry === 'object') {
    throw new Error(`"${name}" is an alias`);
  }
  await TAGS.put(alias, { alias: name });
}

export async function get(name) {
  const entry = await TAGS.get(name.toLowerCase());

  if (typeof entry === 'string') {
    return entry;
  }

  if (typeof entry === 'object') {
    return get(entry.alias);
  }

  return null;
}

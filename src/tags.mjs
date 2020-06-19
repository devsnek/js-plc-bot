export const TAGS = new pylon.KVNamespace('tags');

export async function getTag(name) {
  const entry = await TAGS.get(name.toLowerCase());

  if (typeof entry === 'string') {
    return entry;
  }

  if (typeof entry === 'object' && entry !== null) {
    return getTag(entry.alias);
  }

  return null;
}

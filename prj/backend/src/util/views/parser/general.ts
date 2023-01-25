// Given a string with the format of 'entity id="id"', extract the id from within the double quotes
// E.g.: Given an input string of 'volunteer id="42"', the returned value will be 42, casted to a string
export function extractIdFromViewsKey(key: string): string {
  return key.split("\"")[1];
}

export const isJsonString = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const tryJsonParse = (str: any) => {
  if (isJsonString(str)) {
    return JSON.parse(str);
  } else {
    return str;
  }
};
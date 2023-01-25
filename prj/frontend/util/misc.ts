export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const stringToBool = (str: string) => {
  const strLower = str.toLowerCase();
  return str === "true" || str === "t" || str === "y" || str === "yes";
};

export const setUrlQueryParam = (key: string, value: string | null) => {
  if (history.pushState) {
    let searchParams = new URLSearchParams(window.location.search);
    if (!value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    let newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();
    window.history.replaceState({ path: newurl }, "", newurl);
  }
};

export const getUrlQueryParam = (key: string) => {
  let searchParams = new URLSearchParams(window.location.search);
  return searchParams.has(key) ? searchParams.get(key) : null;
};

const onlyUnique = (value: any, index: number, self: any[]) => {
  return self.indexOf(value) === index;
};

export const removeDuplicatesInArray = (arr: any[]) => {
  return arr.filter(onlyUnique);
};

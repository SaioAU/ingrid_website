/*remove keys from object*/
export default (
  obj: GenericObject = {},
  keys: string[] = [],
): GenericObject =>
  Object.entries(obj).reduce(
    (result, [key, val]) =>
      keys.includes(key) ? result : { ...result, [key]: val },
    {},
  );

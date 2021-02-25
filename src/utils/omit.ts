export default (
  obj: GenericObject = {},
  fields: string[] = [],
): GenericObject =>
  Object.entries(obj).reduce(
    (result, [key, val]) =>
      fields.includes(key) ? result : { ...result, [key]: val },
    {},
  );

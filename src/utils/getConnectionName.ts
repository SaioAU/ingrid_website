// FIXME: The tests are writing to the prod database..

export default (): string => {
  if (process.env.NODE_ENV === 'test') return 'test';
  return 'default';
};

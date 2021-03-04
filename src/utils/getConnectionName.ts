export default (): string => {
  if (process.env.NODE_ENV === 'test') return 'test';
  return 'default';
};

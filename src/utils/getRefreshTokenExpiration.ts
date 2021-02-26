export default (): string => {
  const expiration = process.env.REFRESH_TOKEN_EXPIRATION_DAYS;

  if (!expiration) throw new Error('Missing Refresh token expiration');

  return `${expiration} days`;
};

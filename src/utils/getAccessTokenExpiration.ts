export default (): string => {
  const expiration = process.env.ACCESS_TOKEN_EXPIRATION_MIN;

  if (!expiration) throw new Error('Missing Access token expiration');

  return expiration;
};

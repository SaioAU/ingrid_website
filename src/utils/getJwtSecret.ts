export default (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new Error('Missing JWT secret');

  return jwtSecret;
};

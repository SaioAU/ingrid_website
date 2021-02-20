import crypto from 'crypto';

export default async (password: string): Promise<string> => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(16).toString('hex');

  crypto.scrypt(password, salt, 64, (err, key) => {
    if (err) reject(err);
    resolve(`${salt}:${key.toString('hex')}`);
  });
});

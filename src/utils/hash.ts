import crypto from 'crypto';

export default async (password: string, salt?: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const currentSalt = salt || crypto.randomBytes(16).toString('hex');

    crypto.scrypt(password, currentSalt, 64, (err, key) => {
      if (err) reject(err);
      resolve(`${currentSalt}:${key.toString('hex')}`);
    });
  });

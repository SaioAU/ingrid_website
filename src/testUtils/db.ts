import { User } from '../entities';

export const clearDB = async (): Promise<void> => {
  await User.getRepository().delete({});
};

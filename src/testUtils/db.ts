/* eslint max-classes-per-file: 0 */
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { getConnectionName } from '../utils';

class RollbackErrorException extends Error {}

type VoidFunction = () => Promise<void> | void;

class TransactionCreator {
  @Transactional({ connectionName: getConnectionName })
  static async run(func: VoidFunction) {
    await func();
    throw new RollbackErrorException();
  }
}

// Based on https://github.com/entrostat/typeorm-test-transactions but supports
// different connectionName in tests
export const runInTransaction = (
  func: VoidFunction,
) => async (): Promise<void> => {
  try {
    await TransactionCreator.run(func);
  } catch (e) {
    if (e instanceof RollbackErrorException) {
      // Do nothing here, the transaction has now been rolled back.
    } else {
      throw e;
    }
  }
};

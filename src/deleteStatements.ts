import { IndexedFormula, Statement, UpdateManager } from 'rdflib';

export type DeleteStatementsFromStore = (
  store: IndexedFormula,
  updater: UpdateManager,
  statements: Statement[],
) => Promise<Statement[]>;

export const deleteStatementsFromStore: DeleteStatementsFromStore = async (store, updater, statements) => {
  const updatePromise = new Promise<Statement[]>((reject, resolve) => {
    updater.update(statements, [], (uri, success) => {
      if (success) {
        return resolve(statements);
      }
      return reject();
    });
  });
  return await updatePromise;
}

import { graph, Fetcher, UpdateManager, Statement } from 'rdflib';

let store = graph();
const fetcher = new Fetcher(store, undefined);
const updater = new UpdateManager(store);

/**
 * Single instance of an rdflib store, caches all fetched data
 *
 * @ignore Can be used as an escape hatch for people who want to use rdflib directly, but if that
 *         is necessary, please consider submitting a feature request describing your use case
 *         on Tripledoc first.
 */
export function getStore() {
  return store;
}

export function flushStore() {
  store = graph();
}
/**
 * Single instance of an rdflib fetcher
 *
 * @ignore Can be used as an escape hatch for people who want to use rdflib directly, but if that
 *         is necessary, please consider submitting a feature request describing your use case
 *         on Tripledoc first.
 */
export function getFetcher() {
  return fetcher;
}

/**
 * Single instance of an rdflib updater
 *
 * @ignore Can be used as an escape hatch for people who want to use rdflib directly, but if that
 *         is necessary, please consider submitting a feature request describing your use case
 *         on Tripledoc first.
 */
export function getUpdater() {
  return updater;
}

/**
 * Utility function that properly promisifies the RDFLib UpdateManager's update function
 *
 * @param statementsToDelete Statements currently present on the Pod that should be deleted.
 * @param statementsToAdd Statements not currently present on the Pod that should be added.
 * @returns Promise that resolves when the update was executed successfully, and rejects if not.
 * @ignore Should not be used by library consumers directly.
 */
/* istanbul ignore next Just a thin wrapper around rdflib, yet cumbersome to test due to side effects */
export function update(statementsToDelete: Statement[], statementsToAdd: Statement[]) {
  const promise = new Promise((resolve, reject) => {
    const updater = getUpdater();
    updater.update(statementsToDelete, statementsToAdd, (_uri, success, errorBody) => {
      if(success) {
        return resolve();
      }
      return reject(new Error(errorBody));
    })
  });

  return promise;
}

/**
 * Utility function that properly promisifies the RDFLib UpdateManager's `put` function
 *
 * @param url URL of the Document that should be created.
 * @param statementsToAdd Statements that should be added to the Document.
 * @returns Promise that resolves with the response when the Document was created successfully, and rejects if not.
 * @ignore Should not be used by library consumers directly.
 */
/* istanbul ignore next Just a thin wrapper around rdflib, yet cumbersome to test due to side effects */
export function create(url: string, statementsToAdd: Statement[]): Promise<Response> {
  const promise = new Promise<Response>((resolve, reject) => {
    const store = getStore();
    const updater = getUpdater();
    const doc = store.sym(url);
    updater.put(doc, statementsToAdd, 'text/turtle', (_uri, ok, errorMessage, response) => {
      if (!ok) {
        return reject(new Error(errorMessage));
      }
      return resolve(response as Response);
    });
  });

  return promise;
}

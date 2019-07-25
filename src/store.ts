import $rdf from 'rdflib';

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store, undefined);
const updater = new $rdf.UpdateManager(store);

export function getStore() {
  return store;
}

export function getFetcher() {
  return fetcher;
}

export function getUpdater() {
  return updater;
}
export function update(statementsToDelete: $rdf.Statement[], statementsToAdd: $rdf.Statement[]) {
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

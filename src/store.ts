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

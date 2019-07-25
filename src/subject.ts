import { NamedNode, Statement, Node } from 'rdflib';
import { asNamedNode } from './index';
import { getStore } from './store';
import { findObjectInStore, findObjectsInStore } from './getEntities';

export interface TripleSubject {
  getStatements: () => Statement[];
  get: (predicate: NamedNode) => Node | null;
  getAll: (predicate: NamedNode) => Node[];
  has: (predicate: NamedNode) => boolean;
  // TODO: add, set, remove
};

export function getSubject(documentNode: NamedNode, subjectRef: NamedNode | string): TripleSubject {
  const store = getStore();
  const subjectNode = asNamedNode(subjectRef);

  return {
    getStatements: () => store.statementsMatching(subjectNode, null, null, documentNode),
    get: (predicateNode: NamedNode) => findObjectInStore(store, subjectNode, predicateNode, documentNode),
    getAll: (predicateNode: NamedNode) => findObjectsInStore(store, subjectNode, predicateNode, documentNode),
    has: (predicateNode: NamedNode) => findObjectInStore(store, subjectNode, predicateNode, documentNode) !== null,
  };
}

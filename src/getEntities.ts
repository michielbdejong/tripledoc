import { IndexedFormula, Node, NamedNode } from 'rdflib';

export type FindEntityInStore = (
  store: IndexedFormula,
  knownEntity1: NamedNode,
  knownEntity2: NamedNode,
  document: NamedNode
) => Node | null;
export type FindEntitiesInStore = (
  store: IndexedFormula,
  knownEntity1: NamedNode,
  knownEntity2: NamedNode,
  document: NamedNode
) => Node[];

export const findSubjectInStore: FindEntityInStore = (store, predicateNode, objectNode, documentNode) => {
  return findEntityInStore(store, 'subject', null, predicateNode, objectNode, documentNode);
}
export const findSubjectsInStore: FindEntitiesInStore = (store, predicateNode, objectNode, documentNode) => {
  return findEntitiesInStore(store, 'subject', null, predicateNode, objectNode, documentNode);
}

export const findPredicateInStore: FindEntityInStore = (store, subjectNode, objectNode, documentNode) => {
  return findEntityInStore(store, 'predicate', subjectNode, null, objectNode, documentNode);
}
export const findPredicatesInStore: FindEntitiesInStore = (store, subjectNode, objectNode, documentNode) => {
  return findEntitiesInStore(store, 'predicate', subjectNode, null, objectNode, documentNode);
}

export const findObjectInStore: FindEntityInStore = (store, subjectNode, predicateNode, documentNode) => {
  return findEntityInStore(store, 'object', subjectNode, predicateNode, null, documentNode);
}
export const findObjectsInStore: FindEntitiesInStore = (store, subjectNode, predicateNode, documentNode) => {
  return findEntitiesInStore(store, 'object', subjectNode, predicateNode, null, documentNode);
}

export function findEntityInStore(
  store: IndexedFormula,
  type: 'subject' | 'predicate' | 'object',
  subjectNode: null | NamedNode,
  predicateNode: null | NamedNode,
  objectNode: null | NamedNode,
  documentNode: null | NamedNode,
): Node | null {
  const [ statement ] = store.statementsMatching(subjectNode, predicateNode, objectNode, documentNode, true);
  return (statement) ? statement[type] : null;
}

export function findEntitiesInStore(
  store: IndexedFormula,
  type: 'subject' | 'predicate' | 'object',
  subjectNode: null | Node,
  predicateNode: null | Node,
  objectNode: null | Node,
  documentNode: null | Node,
): Node[] {
  const statements = store.statementsMatching(subjectNode, predicateNode, objectNode, documentNode, false);
  return statements.map(statement => statement[type]);
}

import { IndexedFormula, Node, NamedNode } from 'rdflib';
import { NodeRef, asNamedNode } from '.';

export type FindEntityInStore = (
  store: IndexedFormula,
  knownEntity1: NodeRef,
  knownEntity2: NodeRef,
  document: NodeRef
) => Node | null;
export type FindEntitiesInStore = (
  store: IndexedFormula,
  knownEntity1: NodeRef,
  knownEntity2: NodeRef,
  document: NodeRef
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
  subjectNode: null | NodeRef,
  predicateNode: null | NodeRef,
  objectNode: null | NodeRef,
  documentNode: null | NodeRef,
): Node | null {
  const targetSubject = subjectNode ? asNamedNode(subjectNode) : null;
  const targetPredicate = predicateNode ? asNamedNode(predicateNode) : null;
  const targetObject = objectNode ? asNamedNode(objectNode) : null;
  const targetDocument = documentNode ? asNamedNode(documentNode) : null;
  const [ statement ] = store.statementsMatching(targetSubject, targetPredicate, targetObject, targetDocument, true);
  return (statement) ? statement[type] : null;
}

export function findEntitiesInStore(
  store: IndexedFormula,
  type: 'subject' | 'predicate' | 'object',
  subjectNode: null | NodeRef,
  predicateNode: null | NodeRef,
  objectNode: null | NodeRef,
  documentNode: null | NodeRef,
): Node[] {
  const targetSubject = subjectNode ? asNamedNode(subjectNode) : null;
  const targetPredicate = predicateNode ? asNamedNode(predicateNode) : null;
  const targetObject = objectNode ? asNamedNode(objectNode) : null;
  const targetDocument = documentNode ? asNamedNode(documentNode) : null;
  const statements = store.statementsMatching(targetSubject, targetPredicate, targetObject, targetDocument, false);
  return statements.map(statement => statement[type]);
}

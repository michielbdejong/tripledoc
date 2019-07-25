import { IndexedFormula, NamedNode, sym } from 'rdflib';
import { NodeRef } from './index';

export type FindEntityInStore = (
  store: IndexedFormula,
  knownEntity1: NodeRef,
  knownEntity2: NodeRef,
  document: NodeRef
) => NodeRef | null;
export type FindEntitiesInStore = (
  store: IndexedFormula,
  knownEntity1: NodeRef,
  knownEntity2: NodeRef,
  document: NodeRef
) => NodeRef[];

export const findSubjectInStore: FindEntityInStore = (store, predicateRef, objectRef, documentNode) => {
  return findEntityInStore(store, 'subject', null, predicateRef, objectRef, documentNode);
}
export const findSubjectsInStore: FindEntitiesInStore = (store, predicateRef, objectRef, documentNode) => {
  return findEntitiesInStore(store, 'subject', null, predicateRef, objectRef, documentNode);
}

export const findPredicateInStore: FindEntityInStore = (store, subjectRef, objectRef, documentNode) => {
  return findEntityInStore(store, 'predicate', subjectRef, null, objectRef, documentNode);
}
export const findPredicatesInStore: FindEntitiesInStore = (store, subjectRef, objectRef, documentNode) => {
  return findEntitiesInStore(store, 'predicate', subjectRef, null, objectRef, documentNode);
}

export const findObjectInStore: FindEntityInStore = (store, subjectRef, predicateRef, documentNode) => {
  return findEntityInStore(store, 'object', subjectRef, predicateRef, null, documentNode);
}
export const findObjectsInStore: FindEntitiesInStore = (store, subjectRef, predicateRef, documentNode) => {
  return findEntitiesInStore(store, 'object', subjectRef, predicateRef, null, documentNode);
}

export function findEntityInStore(
  store: IndexedFormula,
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | NodeRef,
  predicateRef: null | NodeRef,
  objectRef: null | NodeRef,
  documentNode: null | NodeRef,
): NodeRef | null {
  const targetSubject = subjectRef ? sym(subjectRef) : null;
  const targetPredicate = predicateRef ? sym(predicateRef) : null;
  const targetObject = objectRef ? sym(objectRef) : null;
  const targetDocument = documentNode ? sym(documentNode) : null;
  const [ statement ] = store.statementsMatching(targetSubject, targetPredicate, targetObject, targetDocument, true);
  return (statement) ? (statement[type] as NamedNode).uri : null;
}

export function findEntitiesInStore(
  store: IndexedFormula,
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | NodeRef,
  predicateRef: null | NodeRef,
  objectRef: null | NodeRef,
  documentNode: null | NodeRef,
): NodeRef[] {
  const targetSubject = subjectRef ? sym(subjectRef) : null;
  const targetPredicate = predicateRef ? sym(predicateRef) : null;
  const targetObject = objectRef ? sym(objectRef) : null;
  const targetDocument = documentNode ? sym(documentNode) : null;
  const statements = store.statementsMatching(targetSubject, targetPredicate, targetObject, targetDocument, false);
  return statements.map(statement => (statement[type] as NamedNode).uri);
}

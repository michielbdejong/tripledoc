import { IndexedFormula, Node, sym, Literal } from 'rdflib';
import { NodeRef, isNamedNode, isLiteral } from './index';

export type FindEntityInStore = (
  store: IndexedFormula,
  knownEntity1: NodeRef,
  knownEntity2: NodeRef,
  document: NodeRef
) => NodeRef | Literal | null;
export type FindEntitiesInStore = (
  store: IndexedFormula,
  knownEntity1: NodeRef,
  knownEntity2: NodeRef,
  document: NodeRef
) => Array<NodeRef | Literal>;

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
): NodeRef | Literal | null {
  const targetSubject = subjectRef ? sym(subjectRef) : null;
  const targetPredicate = predicateRef ? sym(predicateRef) : null;
  const targetObject = objectRef ? sym(objectRef) : null;
  const targetDocument = documentNode ? sym(documentNode) : null;
  const [ statement ] = store.statementsMatching(targetSubject, targetPredicate, targetObject, targetDocument, true);
  if (!statement || !statement[type]) {
    return null;
  }
  return normaliseEntity(statement[type]);
}

export function findEntitiesInStore(
  store: IndexedFormula,
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | NodeRef,
  predicateRef: null | NodeRef,
  objectRef: null | NodeRef,
  documentNode: null | NodeRef,
): Array<NodeRef | Literal> {
  const targetSubject = subjectRef ? sym(subjectRef) : null;
  const targetPredicate = predicateRef ? sym(predicateRef) : null;
  const targetObject = objectRef ? sym(objectRef) : null;
  const targetDocument = documentNode ? sym(documentNode) : null;
  const statements = store.statementsMatching(targetSubject, targetPredicate, targetObject, targetDocument, false);
  return statements.map(statement => normaliseEntity(statement[type])).filter(isEntity);
}

function normaliseEntity(entity: Node): NodeRef | Literal | null {
  if (isNamedNode(entity)) {
    return entity.uri;
  }
  if (isLiteral(entity)) {
    return entity;
  }
  return null;
}
function isEntity(node: NodeRef | Literal | null): node is NodeRef | Literal {
  return (node !== null);
}

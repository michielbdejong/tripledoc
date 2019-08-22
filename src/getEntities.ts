import { IndexedFormula, Node, sym, Literal } from 'rdflib';
import { NodeRef, isNamedNode, isLiteral } from './index';

/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export type FindEntityInStore = (
  store: IndexedFormula,
  knownEntity1: NodeRef,
  knownEntity2: NodeRef,
  document: NodeRef
) => NodeRef | Literal | null;
/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export type FindEntitiesInStore = (
  store: IndexedFormula,
  knownEntity1: NodeRef,
  knownEntity2: NodeRef,
  document: NodeRef
) => Array<NodeRef | Literal>;

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findSubjectInStore: FindEntityInStore = (store, predicateRef, objectRef, documentNode) => {
  return findEntityInStore(store, 'subject', null, predicateRef, objectRef, documentNode);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findSubjectsInStore: FindEntitiesInStore = (store, predicateRef, objectRef, documentNode) => {
  return findEntitiesInStore(store, 'subject', null, predicateRef, objectRef, documentNode);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findPredicateInStore: FindEntityInStore = (store, subjectRef, objectRef, documentNode) => {
  return findEntityInStore(store, 'predicate', subjectRef, null, objectRef, documentNode);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findPredicatesInStore: FindEntitiesInStore = (store, subjectRef, objectRef, documentNode) => {
  return findEntitiesInStore(store, 'predicate', subjectRef, null, objectRef, documentNode);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findObjectInStore: FindEntityInStore = (store, subjectRef, predicateRef, documentNode) => {
  return findEntityInStore(store, 'object', subjectRef, predicateRef, null, documentNode);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findObjectsInStore: FindEntitiesInStore = (store, subjectRef, predicateRef, documentNode) => {
  return findEntitiesInStore(store, 'object', subjectRef, predicateRef, null, documentNode);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findEntityInStore(
  store: IndexedFormula,
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | NodeRef,
  predicateRef: null | NodeRef,
  objectRef: null | NodeRef,
  documentNode: NodeRef,
): NodeRef | Literal | null {
  const targetSubject = subjectRef ? sym(subjectRef) : null;
  const targetPredicate = predicateRef ? sym(predicateRef) : null;
  const targetObject = objectRef ? sym(objectRef) : null;
  const targetDocument = sym(documentNode);
  const [ statement ] = store.statementsMatching(targetSubject, targetPredicate, targetObject, targetDocument, true);
  if (!statement || !statement[type]) {
    return null;
  }
  return normaliseEntity(statement[type]);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findEntitiesInStore(
  store: IndexedFormula,
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | NodeRef,
  predicateRef: null | NodeRef,
  objectRef: null | NodeRef,
  documentNode: NodeRef,
): Array<NodeRef | Literal> {
  const targetSubject = subjectRef ? sym(subjectRef) : null;
  const targetPredicate = predicateRef ? sym(predicateRef) : null;
  const targetObject = objectRef ? sym(objectRef) : null;
  const targetDocument = sym(documentNode);
  const statements = store.statementsMatching(targetSubject, targetPredicate, targetObject, targetDocument, false);
  return statements.map(statement => normaliseEntity(statement[type])).filter(isEntity);
}

function normaliseEntity(entity: Node): NodeRef | Literal | null {
  if (isNamedNode(entity)) {
    return entity.uri;
  }
  /* istanbul ignore else: All code paths to here result in either a Node or a Literal, so we can't test it */
  if (isLiteral(entity)) {
    return entity;
  }
  /* istanbul ignore next: All code paths to here result in either a Node or a Literal, so we can't test it */
  return null;
}
function isEntity(node: NodeRef | Literal | null): node is NodeRef | Literal {
  return (node !== null);
}

import { BlankNode, NamedNode, Literal, Term } from 'rdf-js';
import { DataFactory, Dataset } from './n3dataset';
import { Reference, isLiteral } from './index';

/*
 * Note: This file is mostly a remnant from when Tripledoc used rdflib.
 *       At some point in time, we should transition from traversing an array of Quads,
 *       to using n3's store and its methods (`getSubjects`, `getPredicates`, etc.),
 *       which should be more performant.
 */

/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export type FindEntityInStore = (
  store: Dataset,
  knownEntity1: Reference,
  knownEntity2: Reference,
) => Reference | Literal | BlankNode | null;
/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export type FindEntitiesInStore = (
  store: Dataset,
  knownEntity1: Reference | BlankNode,
  knownEntity2: Reference | BlankNode,
) => Array<Reference | Literal | BlankNode>;

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findSubjectInStore: FindEntityInStore = (store, predicateRef, objectRef) => {
  return findEntityInStore(store, 'subject', null, predicateRef, objectRef);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findSubjectsInStore: FindEntitiesInStore = (store, predicateRef, objectRef) => {
  return findEntitiesInStore(store, 'subject', null, predicateRef, objectRef);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findPredicateInStore: FindEntityInStore = (store, subjectRef, objectRef) => {
  return findEntityInStore(store, 'predicate', subjectRef, null, objectRef);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findPredicatesInStore: FindEntitiesInStore = (store, subjectRef, objectRef) => {
  return findEntitiesInStore(store, 'predicate', subjectRef, null, objectRef);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findObjectInStore: FindEntityInStore = (store, subjectRef, predicateRef) => {
  return findEntityInStore(store, 'object', subjectRef, predicateRef, null);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findObjectsInStore: FindEntitiesInStore = (store, subjectRef, predicateRef) => {
  return findEntitiesInStore(store, 'object', subjectRef, predicateRef, null);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findEntityInStore(
  store: Dataset,
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | Reference | BlankNode,
  predicateRef: null | Reference | BlankNode,
  objectRef: null | Reference | BlankNode,
): Reference | Literal | BlankNode | null {
  const targetSubject = subjectRef ? toNode(subjectRef) : null;
  const targetPredicate = predicateRef ? toNode(predicateRef) : null;
  const targetObject = objectRef ? toNode(objectRef) : null;
  const matchingTriples = store.match(targetSubject, targetPredicate, targetObject, null).toArray();
  const foundTriple = matchingTriples.find((triple) => (typeof triple[type] !== 'undefined'));

  return (typeof foundTriple !== 'undefined') ? normaliseEntity(foundTriple[type]) : null;
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findEntitiesInStore(
  store: Dataset,
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | Reference | BlankNode,
  predicateRef: null | Reference | BlankNode,
  objectRef: null | Reference | BlankNode,
): Array<Reference | Literal | BlankNode> {
  const targetSubject = subjectRef ? toNode(subjectRef) : null;
  const targetPredicate = predicateRef ? toNode(predicateRef) : null;
  const targetObject = objectRef ? toNode(objectRef) : null;
  const matchingTriples = store.match(targetSubject, targetPredicate, targetObject, null).toArray();
  const foundTriples = matchingTriples.filter((triple) => (typeof triple[type] !== 'undefined'));

  return foundTriples.map(triple => normaliseEntity(triple[type])).filter(isEntity);
}

function toNode(referenceOrBlankNode: Reference | BlankNode): Term {
  return (typeof referenceOrBlankNode === 'string') ? DataFactory.namedNode(referenceOrBlankNode) : referenceOrBlankNode;
}

function normaliseEntity(entity: Term): Reference | Literal | BlankNode | null {
  if (isBlankNode(entity)) {
    return entity;
  }
  if (isNamedNode(entity)) {
    return entity.value;
  }
  /* istanbul ignore else: All code paths to here result in either a Node or a Literal, so we can't test it */
  if (isLiteral(entity)) {
    return entity;
  }
  /* istanbul ignore next: All code paths to here result in either a Node or a Literal, so we can't test it */
  return null;
}
function isEntity(node: Reference | Literal | BlankNode | null): node is Reference | Literal {
  return (node !== null);
}

/**
 * @ignore Utility function for working with N3, which the library consumer should not need to
 *         be exposed to.
 */
function isNamedNode(node: Term): node is NamedNode {
  return node.termType === 'NamedNode';
}

/**
 * @ignore Utility function for working with rdflib, which the library consumer should not need to
 *         be exposed to.
 */
function isBlankNode(node: Term): node is BlankNode {
  return node.termType === 'BlankNode';
}

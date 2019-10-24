import { Quad, BlankNode, NamedNode, Literal, DataFactory, Term } from 'n3';
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
export type FindEntityInTriples = (
  triples: Quad[],
  knownEntity1: Reference,
  knownEntity2: Reference,
  document: Reference
) => Reference | Literal | BlankNode | null;
/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export type FindEntitiesInTriples = (
  triples: Quad[],
  knownEntity1: Reference | BlankNode,
  knownEntity2: Reference | BlankNode,
  document: Reference
) => Array<Reference | Literal | BlankNode>;

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findSubjectInTriples: FindEntityInTriples = (triples, predicateRef, objectRef, documentRef) => {
  return findEntityInTriples(triples, 'subject', null, predicateRef, objectRef, documentRef);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findSubjectsInTriples: FindEntitiesInTriples = (triples, predicateRef, objectRef, documentRef) => {
  return findEntitiesInTriples(triples, 'subject', null, predicateRef, objectRef, documentRef);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findPredicateInTriples: FindEntityInTriples = (triples, subjectRef, objectRef, documentRef) => {
  return findEntityInTriples(triples, 'predicate', subjectRef, null, objectRef, documentRef);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findPredicatesInTriples: FindEntitiesInTriples = (triples, subjectRef, objectRef, documentRef) => {
  return findEntitiesInTriples(triples, 'predicate', subjectRef, null, objectRef, documentRef);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findObjectInTriples: FindEntityInTriples = (triples, subjectRef, predicateRef, documentRef) => {
  return findEntityInTriples(triples, 'object', subjectRef, predicateRef, null, documentRef);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findObjectsInTriples: FindEntitiesInTriples = (triples, subjectRef, predicateRef, documentRef) => {
  return findEntitiesInTriples(triples, 'object', subjectRef, predicateRef, null, documentRef);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findEntityInTriples(
  triples: Quad[],
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | Reference,
  predicateRef: null | Reference,
  objectRef: null | Reference,
  documentRef: Reference,
): Reference | Literal | BlankNode | null {
  const foundTriple = triples.find((triple) => {
    return (
      typeof triple[type] !== 'undefined' &&
      tripleMatches(triple, subjectRef, predicateRef, objectRef)
    );
  });

  return (typeof foundTriple !== 'undefined') ? normaliseEntity(foundTriple[type]) : null;
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findEntitiesInTriples(
  triples: Quad[],
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | Reference | BlankNode,
  predicateRef: null | Reference | BlankNode,
  objectRef: null | Reference | BlankNode,
  documentRef: Reference,
): Array<Reference | Literal | BlankNode> {
  const foundTriples = triples.filter((triple) => {
    return (
      typeof triple[type] !== 'undefined' &&
      tripleMatches(triple, subjectRef, predicateRef, objectRef)
    );
  });
  return foundTriples.map(triple => normaliseEntity(triple[type])).filter(isEntity);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findMatchingTriples(
  triples: Quad[],
  subjectRef: null | Reference | BlankNode,
  predicateRef: null | Reference | BlankNode,
  objectRef: null | Reference | BlankNode,
  documentRef: Reference,
): Array<Quad> {
  const foundTriples = triples.filter((triple) => {
    return tripleMatches(triple, subjectRef, predicateRef, objectRef);
  });
  return foundTriples;
}

function tripleMatches(
  triple: Quad,
  subjectRef: null | Reference | BlankNode,
  predicateRef: null | Reference | BlankNode,
  objectRef: null | Reference | BlankNode,
): boolean {
  const targetSubject = subjectRef ? toNode(subjectRef) : null;
  const targetPredicate = predicateRef ? toNode(predicateRef) : null;
  const targetObject = objectRef ? toNode(objectRef) : null;

  return (
    (targetSubject === null || triple.subject.equals(targetSubject)) &&
    (targetPredicate === null || triple.predicate.equals(targetPredicate)) &&
    (targetObject === null || triple.object.equals(targetObject))
  );
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

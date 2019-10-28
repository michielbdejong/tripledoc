import { IndexedFormula, Node, sym, Literal, NamedNode, Statement } from 'rdflib';
import { Reference, isLiteral } from './index';

/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export type FindEntityInStatements = (
  statements: Statement[],
  knownEntity1: Reference,
  knownEntity2: Reference,
  document: Reference
) => Reference | Literal | null;
/**
 * @ignore This is a utility type for other parts of the code, and not part of the public API.
 */
export type FindEntitiesInStatements = (
  statements: Statement[],
  knownEntity1: Reference,
  knownEntity2: Reference,
  document: Reference
) => Array<Reference | Literal>;

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findSubjectInStatements: FindEntityInStatements = (statements, predicateRef, objectRef, documentRef) => {
  return findEntityInStatements(statements, 'subject', null, predicateRef, objectRef, documentRef);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findSubjectsInStatements: FindEntitiesInStatements = (statements, predicateRef, objectRef, documentRef) => {
  return findEntitiesInStatements(statements, 'subject', null, predicateRef, objectRef, documentRef);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findPredicateInStatements: FindEntityInStatements = (statements, subjectRef, objectRef, documentRef) => {
  return findEntityInStatements(statements, 'predicate', subjectRef, null, objectRef, documentRef);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findPredicatesInStatements: FindEntitiesInStatements = (statements, subjectRef, objectRef, documentRef) => {
  return findEntitiesInStatements(statements, 'predicate', subjectRef, null, objectRef, documentRef);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findObjectInStatements: FindEntityInStatements = (statements, subjectRef, predicateRef, documentRef) => {
  return findEntityInStatements(statements, 'object', subjectRef, predicateRef, null, documentRef);
}
/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export const findObjectsInStatements: FindEntitiesInStatements = (statements, subjectRef, predicateRef, documentRef) => {
  return findEntitiesInStatements(statements, 'object', subjectRef, predicateRef, null, documentRef);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findEntityInStatements(
  statements: Statement[],
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | Reference,
  predicateRef: null | Reference,
  objectRef: null | Reference,
  documentRef: Reference,
): Reference | Literal | null {
  const foundStatement = statements.find((statement) => {
    return (
      typeof statement[type] !== 'undefined' &&
      statementMatches(statement, subjectRef, predicateRef, objectRef, documentRef)
    );
  });

  return (typeof foundStatement !== 'undefined') ? normaliseEntity(foundStatement[type]) : null;
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findEntitiesInStatements(
  statements: Statement[],
  type: 'subject' | 'predicate' | 'object',
  subjectRef: null | Reference,
  predicateRef: null | Reference,
  objectRef: null | Reference,
  documentRef: Reference,
): Array<Reference | Literal> {
  const foundStatements = statements.filter((statement) => {
    return (
      typeof statement[type] !== 'undefined' &&
      statementMatches(statement, subjectRef, predicateRef, objectRef, documentRef)
    );
  });
  return foundStatements.map(statement => normaliseEntity(statement[type])).filter(isEntity);
}

/**
 * @ignore This is a utility method for other parts of the code, and not part of the public API.
 */
export function findMatchingStatements(
  statements: Statement[],
  subjectRef: null | Reference,
  predicateRef: null | Reference,
  objectRef: null | Reference,
  documentRef: Reference,
): Array<Statement> {
  const foundStatements = statements.filter((statement) => {
    return statementMatches(statement, subjectRef, predicateRef, objectRef, documentRef);
  });
  return foundStatements;
}

function statementMatches(
  statement: Statement,
  subjectRef: null | Reference,
  predicateRef: null | Reference,
  objectRef: null | Reference,
  documentRef: Reference,
): boolean {
  const targetSubject = subjectRef ? sym(subjectRef) : null;
  const targetPredicate = predicateRef ? sym(predicateRef) : null;
  const targetObject = objectRef ? sym(objectRef) : null;
  const targetDocument = sym(documentRef);

  return (
    (targetSubject === null || statement.subject.sameTerm(targetSubject)) &&
    (targetPredicate === null || statement.predicate.sameTerm(targetPredicate)) &&
    (targetObject === null || statement.object.sameTerm(targetObject)) &&
    (targetDocument === null || (
      typeof statement.why !== 'undefined' &&
      isNamedNode(statement.why as Node) &&
      (statement.why as Node).sameTerm(targetDocument)
    ))
  );
}

function normaliseEntity(entity: Node): Reference | Literal | null {
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
function isEntity(node: Reference | Literal | null): node is Reference | Literal {
  return (node !== null);
}

/**
 * @ignore Utility function for working with rdflib, which the library consumer should not need to
 *         be exposed to.
 */
function isNamedNode(node: Node): node is NamedNode {
  return typeof (node as NamedNode).uri === 'string';
}

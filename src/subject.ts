import { Statement, Literal, st, sym, BlankNode } from 'rdflib';
import {
  Reference,
  isLiteral,
  LiteralTypes,
  isReference,
  isStringLiteral,
  isIntegerLiteral,
  isDecimalLiteral,
  DateTimeLiteral,
  isDateTimeLiteral,
  IntegerLiteral,
  DecimalLiteral,
  StringLiteral,
  isBlankNode,
} from './index';
import { getStore } from './store';
import { findObjectsInStatements, findMatchingStatements } from './getEntities';
import { TripleDocument } from './document';
import { rdf } from 'rdf-namespaces';

export interface TripleSubject {
  /**
   * @returns The [[TripleDocument]] that contains this Subject.
   */
  getDocument: () => TripleDocument;
  /**
   * @deprecated
   * @ignore This is mostly a convenience function to make it easy to work with rdflib and tripledoc
   *         simultaneously. If you rely on this, it's probably best to either file an issue
   *         describing what you want to do that Tripledoc can't do directly, or to just use rdflib
   *         directly.
   * @returns The Statements pertaining to this Subject that are stored on the user's Pod. Note that
   *          this does not return Statements that have not been saved yet - see
   *          [[getPendingStatements]] for those.
   */
  getStatements: () => Statement[];
  /**
   * Find a literal string value for `predicate` on this Subject.
   *
   * This retrieves _one_ string literal, or `null` if none is found. If you want to find _all_
   * string literals for a predicate, see [[getAllStrings]].
   *
   * @param getString.predicate Which property of this Subject you want the value of.
   * @returns The first literal string value satisfying `predicate`, if any, and `null` otherwise.
   */
  getString: (predicate: Reference) => string | null;
  /**
   * Find a literal integer value for `predicate` on this Subject.
   *
   * This retrieves _one_ integer literal, or `null` if none is found. If you want to find _all_
   * integer literals for a predicate, see [[getAllIntegers]].
   *
   * @param getInteger.predicate Which property of this Subject you want the value of.
   * @returns The first literal integer value satisfying `predicate`, if any, and `null` otherwise.
   */
  getInteger: (predicate: Reference) => number | null;
  /**
   * Find a literal decimal value for `predicate` on this Subject.
   *
   * This retrieves _one_ decimal literal, or `null` if none is found. If you want to find _all_
   * decimal literals for a predicate, see [[getAllDecimals]].
   *
   * @param getDecimal.predicate Which property of this Subject you want the value of.
   * @returns The first literal decimal value satisfying `predicate`, if any, and `null` otherwise.
   */
  getDecimal: (predicate: Reference) => number | null;
  /**
   * Find a literal date+time value for `predicate` on this Subject.
   *
   * This retrieves _one_ date+time literal, or `null` if none is found. If you want to find _all_
   * date+time literals for a predicate, see [[getAllDateTimes]].
   *
   * @param getDateTime.predicate Which property of this Subject you want the value of.
   * @returns The first literal Date value satisfying `predicate`, if any, and `null` otherwise.
   */
  getDateTime: (predicate: Reference) => Date | null;
  /**
   * @param getLiteral.predicate Which property of this Subject you want the value of.
   * @returns The first literal value satisfying `predicate`, if any, and `null` otherwise.
   * @deprecated This method has been superseded by the type-specific methods [[getString]],
   *             [[getNumber]] and [[getDateTime]].
   */
  getLiteral: (predicate: Reference) => LiteralTypes | null;
  /**
   * @param getAllStrings.predicate Which property of this Subject you want the values of.
   * @returns All literal string values satisfying `predicate`.
   */
  getAllStrings: (predicate: Reference) => string[];
  /**
   * @param getAllIntegers.predicate Which property of this Subject you want the values of.
   * @returns All literal integer values satisfying `predicate`.
   */
  getAllIntegers: (predicate: Reference) => number[];
  /**
   * @param getAllDecimals.predicate Which property of this Subject you want the values of.
   * @returns All literal decimal values satisfying `predicate`.
   */
  getAllDecimals: (predicate: Reference) => number[];
  /**
   * @param getAllDateTimes.predicate Which property of this Subject you want the values of.
   * @returns All literal DateTime values satisfying `predicate`.
   */
  getAllDateTimes: (predicate: Reference) => Date[];
  /**
   * @param getAllLiterals.predicate Which property of this Subject you want the values of.
   * @returns All literal values satisfying `predicate`.
   * @deprecated This method has been superseded by the type-specific methods [[getAllStrings]],
   *             [[getAllNumbers]] and [[getAllDates]].
   */
  getAllLiterals: (predicate: Reference) => LiteralTypes[];
  /**
   * Find a local Subject (i.e. without its own URL) referenced by this Subject with `predicate`.
   *
   * This retrieves _one_ [[TripleSubject]], or `null` if none is found. If you want to find _all_
   * local Subjects for a predicate, see [[getAllLocalSubjects]].
   *
   * @param getRef.predicate Which property of this Subject you want the value of.
   * @returns The first referenced local Subject satisfying `predicate`, if any, and `null` otherwise.
   * @ignore Experimental API; could change in minor or patch releases.
   */
  getLocalSubject: (predicate: Reference) => TripleSubject | null;
  /**
   * Find local Subject (i.e. without their own URLs) referenced by this Subject with `predicate`.
   *
   * @param getRef.predicate Which property of this Subject you want the values of.
   * @returns All referenced local Subjects satisfying `predicate`.
   * @ignore Experimental API; could change in minor or patch releases.
   */
  getAllLocalSubjects: (predicate: Reference) => Array<TripleSubject>;
  /**
   * Find a reference attached to this Subject with `predicate`.
   *
   * This retrieves _one_ reference, or `null` if none is found. If you want to find _all_
   * references for a predicate, see [[getAllRefs]].
   *
   * @param getRef.predicate Which property of this Subject you want the value of.
   * @returns The first referenced IRI satisfying `predicate`, if any, and `null` otherwise.
   */
  getRef: (predicate: Reference) => Reference | null;
  /**
   * @ignore Deprecated method.
   * @deprecated Replaced by [[getRef]].
   */
  getNodeRef: (predicate: Reference) => Reference | null;
  /**
   * @returns The type of this Subject, if known.
   */
  getType: () => Reference | null;
  /**
   * @param getAllRefs.predicate Which property of this Subject you want the values of.
   * @returns All references satisfying `predicate`.
   */
  getAllRefs: (predicate: Reference) => Array<Reference>;
  /**
   * @ignore Deprecated method.
   * @deprecated Replaced by [[getAllRefs]].
   */
  getAllNodeRefs: (predicate: Reference) => Array<Reference>;
  /**
   * Set a property of this Subject to a Literal value (i.e. not a URL).
   *
   * Note that this value is not saved to the user's Pod until you save the containing Document.
   *
   * @param addLiteral.predicate The property you want to add another value of.
   * @param addLiteral.object The Literal value you want to add, the type of which is one of [[LiteralTypes]].
   */
  addLiteral: (predicate: Reference, object: LiteralTypes) => void;
  /**
   * Set a property of this Subject to a [[Reference]].
   *
   * Note that this value is not saved to the user's Pod until you save the containing Document.
   *
   * @param addRef.predicate The property you want to add another value of.
   * @param addRef.object The IRI you want to add a reference to.
   */
  addRef: (predicate: Reference, object: Reference) => void;
  /**
   * @ignore Deprecated method.
   * @deprecated Replaced by [[addRef]].
   */
  addNodeRef: (predicate: Reference, object: Reference) => void;
  /**
   * Remove a Literal value for a property of this Subject.
   *
   * Note that this value is not removed from the user's Pod until you save the containing Document.
   *
   * @param removeLiteral.predicate The property you want to remove a value of.
   * @param removeLiteral.object The Literal value you want to remove, the type of which is one of [[LiteralTypes]].
   */
  removeLiteral: (predicate: Reference, object: LiteralTypes) => void;
  /**
   * Remove a [[Reference]] value for a property of this Subject.
   *
   * Note that this pointer is not removed from the user's Pod until you save the containing Document.
   *
   * @param removeRef.predicate The property you want to remove a reference for.
   * @param removeRef.object The reference you want to remove.
   */
  removeRef: (predicate: Reference, object: Reference) => void;
  /**
   * @ignore Deprecated.
   * @deprecated Replaced by [[removeRef]].
   */
  removeNodeRef: (predicate: Reference, object: Reference) => void;
  /**
   * Remove all values for a property of this Subject.
   *
   * Note that these values are not removed from the user's Pod until you save the containing
   * Document.
   *
   * @param removeAll.predicate The property you want to remove the values of.
   */
  removeAll: (predicate: Reference) => void;
  /**
   * Set a property of this Subject to a Literal value, clearing all existing values.
   *
   * Note that this change is not saved to the user's Pod until you save the containing Document.
   *
   * @param setLiteral.predicate The property you want to set the value of.
   * @param setLiteral.object The Literal value you want to set, the type of which is one of [[LiteralTypes]].
   */
  setLiteral: (predicate: Reference, object: LiteralTypes) => void;
  /**
   * Set a property of this Subject to a [[Reference]], clearing all existing values.
   *
   * Note that this change is not saved to the user's Pod until you save the containing Document.
   *
   * @param setRef.predicate The property you want to set the value of.
   * @param setRef.object The reference you want to add.
   */
  setRef: (predicate: Reference, object: Reference) => void;
  /**
   * @ignore Deprecated.
   * @deprecated Replaced by [[setRef]].
   */
  setNodeRef: (predicate: Reference, object: Reference) => void;
  /**
   * Unset all values for all Predicates of this Subject.
   *
   * @ignore Currently an internal API for use by [[TripleDocument]].
   */
  clear: () => void;
  /**
   * @ignore Pending Statements are only provided so the Document can access them in order to save
   *         them - this is not part of the public API and can thus break in a minor release.
   * @returns A tuple with the first element being a list of Statements that should be deleted from
   *          the store, and the second element a list of Statements that should be added to it.
   */
  getPendingStatements: () => [Statement[], Statement[]];
  /**
   * Get the IRI of the [[Reference]] representing this specific Subject.
   *
   * @returns The IRI of this specific Subject.
   */
  asRef: () => Reference;
  /**
   * @ignore Deprecated.
   * @deprecated Replaced by [[asRef]].
   */
  asNodeRef: () => Reference;
};

/**
 * @ignore Only to be called by the Document containing this subject; not a public API.
 * @param document The Document this Subject is defined in.
 * @param subjectRef The URL that identifies this subject.
 */
export function initialiseSubject(document: TripleDocument, subjectRef: Reference | BlankNode): TripleSubject {
  const subjectNode = isBlankNode(subjectRef) ? subjectRef : sym(subjectRef);
  const statements = findMatchingStatements(document.getStatements(), subjectRef, null, null, document.asRef());
  let pendingAdditions: Statement[] = [];
  let pendingDeletions: Statement[] = [];

  const get = (predicateRef: Reference) => findObjectsInStatements(statements, subjectRef, predicateRef, document.asRef());
  const getString = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const firstStringLiteral = objects.find(isStringLiteral);
    if (typeof firstStringLiteral === 'undefined') {
      return null;
    }
    return firstStringLiteral.value;
  };
  const getInteger = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const firstIntegerLiteral = objects.find(isIntegerLiteral);
    if (typeof firstIntegerLiteral === 'undefined') {
      return null;
    }

    return fromIntegerLiteral(firstIntegerLiteral);
  };
  const getDecimal = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const firstDecimalLiteral = objects.find(isDecimalLiteral);
    if (typeof firstDecimalLiteral === 'undefined') {
      return null;
    }

    return fromDecimalLiteral(firstDecimalLiteral);
  };
  const getDateTime = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const firstDateTimeLiteral = objects.find(isDateTimeLiteral);
    if (typeof firstDateTimeLiteral === 'undefined') {
      return null;
    }

    return fromDateTimeLiteral(firstDateTimeLiteral);
  };
  const getLiteral = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const firstLiteral = objects.find(isLiteral);
    if (typeof firstLiteral === 'undefined') {
      return null;
    }
    return fromLiteral(firstLiteral);
  };
  const getAllStrings = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const literals = objects.filter(isStringLiteral);
    return literals.map(fromStringLiteral);
  };
  const getAllIntegers = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const literals = objects.filter(isIntegerLiteral);
    return literals.map(fromIntegerLiteral);
  };
  const getAllDecimals = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const literals = objects.filter(isDecimalLiteral);
    return literals.map(fromDecimalLiteral);
  };
  const getAllDateTimes = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const literals = objects.filter(isDateTimeLiteral);
    return literals.map(fromDateTimeLiteral);
  };
  const getAllLiterals = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const literals = objects.filter(isLiteral);
    return literals.map(fromLiteral);
  };
  const getLocalSubject = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const firstRef = objects.find(isBlankNode);
    if (typeof firstRef === 'undefined') {
      return null;
    }
    return initialiseSubject(document, firstRef);
  };
  const getAllLocalSubjects = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const nodeRefs = objects.filter(isBlankNode);
    return nodeRefs.map((localSubject: BlankNode) => initialiseSubject(document, localSubject));
  };
  const getRef = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const firstRef = objects.find(isReference);
    if (typeof firstRef === 'undefined') {
      return null;
    }
    return firstRef;
  };
  const getAllRefs = (predicateRef: Reference) => {
    const objects = get(predicateRef);
    const nodeRefs = objects.filter(isReference);
    return nodeRefs;
  };

  const getType = () => {
    return getRef(rdf.type);
  }

  const addLiteral = (predicateRef: Reference, literal: LiteralTypes) => {
    pendingAdditions.push(st(subjectNode, sym(predicateRef), asLiteral(literal), sym(document.asRef())));
  };
  const addRef = (predicateRef: Reference, ref: Reference) => {
    pendingAdditions.push(st(subjectNode, sym(predicateRef), sym(ref), sym(document.asRef())));
  };
  const removeRef = (predicateRef: Reference, nodeRef: Reference) => {
    pendingDeletions.push(st(subjectNode, sym(predicateRef), sym(nodeRef), sym(document.asRef())));
  };
  const removeAll = (predicateRef: Reference) => {
    pendingDeletions.push(...findMatchingStatements(statements, subjectRef, predicateRef, null, document.asRef()));
  }
  const clear = () => {
    pendingDeletions.push(...statements);
  }
  const setRef = (predicateRef: Reference, nodeRef: Reference) => {
    removeAll(predicateRef);
    addRef(predicateRef, nodeRef);
  };

  const asRef = () => isBlankNode(subjectRef) ? subjectRef.id : subjectRef;

  const subject: TripleSubject = {
    getDocument: () => document,
    getStatements: () => statements,
    getString: getString,
    getInteger: getInteger,
    getDecimal: getDecimal,
    getDateTime: getDateTime,
    getLiteral: getLiteral,
    getAllStrings: getAllStrings,
    getAllIntegers: getAllIntegers,
    getAllDecimals: getAllDecimals,
    getAllDateTimes: getAllDateTimes,
    getAllLiterals: getAllLiterals,
    getLocalSubject: getLocalSubject,
    getAllLocalSubjects: getAllLocalSubjects,
    getRef: getRef,
    getAllRefs: getAllRefs,
    getType: getType,
    addLiteral: addLiteral,
    addRef: addRef,
    removeAll: removeAll,
    removeLiteral: (predicateRef, literal) => {
      pendingDeletions.push(st(subjectNode, sym(predicateRef), asLiteral(literal), sym(document.asRef())));
    },
    removeRef: removeRef,
    setLiteral: (predicateRef, literal) => {
      removeAll(predicateRef);
      addLiteral(predicateRef, literal);
    },
    setRef: setRef,
    clear: clear,
    getPendingStatements: () => [pendingDeletions, pendingAdditions],
    asRef: asRef,
    // Deprecated aliases, included for backwards compatibility:
    getNodeRef: getRef,
    getAllNodeRefs: getAllRefs,
    addNodeRef: addRef,
    removeNodeRef: removeRef,
    setNodeRef: setRef,
    asNodeRef: asRef,
  };

  return subject;
}

function fromDateTimeLiteral(literal: DateTimeLiteral): Date {
  // See https://github.com/linkeddata/rdflib.js/blob/d84af88f367b8b5f617c753d8241c5a2035458e8/src/literal.js#L87
  const utcFullYear = parseInt(literal.value.substring(0, 4), 10);
  const utcMonth = parseInt(literal.value.substring(5, 7), 10) - 1;
  const utcDate = parseInt(literal.value.substring(8, 10), 10);
  const utcHours = parseInt(literal.value.substring(11, 13), 10);
  const utcMinutes = parseInt(literal.value.substring(14, 16), 10);
  const utcSeconds = parseInt(literal.value.substring(17, literal.value.indexOf('Z')), 10);
  const date = new Date(0);
  date.setUTCFullYear(utcFullYear);
  date.setUTCMonth(utcMonth);
  date.setUTCDate(utcDate);
  date.setUTCHours(utcHours);
  date.setUTCMinutes(utcMinutes);
  date.setUTCSeconds(utcSeconds);
  return date;
}
function fromIntegerLiteral(literal: IntegerLiteral): number {
  return parseInt(literal.value, 10);
}
function fromDecimalLiteral(literal: DecimalLiteral): number {
  return parseFloat(literal.value);
}
function fromStringLiteral(literal: StringLiteral): string {
  return literal.value;
}
function fromLiteral(literal: Literal): LiteralTypes {
  if (isDateTimeLiteral(literal)) {
    return fromDateTimeLiteral(literal);
  }
  if (isIntegerLiteral(literal)) {
    return fromIntegerLiteral(literal);
  }
  if (isDecimalLiteral(literal)) {
    return fromDecimalLiteral(literal);
  }
  return literal.value;
}
function asLiteral(literal: LiteralTypes): Literal {
  if (literal instanceof Date) {
    return Literal.fromDate(literal);
  }
  if (typeof literal === 'number') {
    return Literal.fromNumber(literal);
  }
  return new Literal(literal, undefined as any, undefined as any);
}

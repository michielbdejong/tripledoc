import { Statement, Literal, st, sym } from 'rdflib';
import { NodeRef, isLiteral, LiteralTypes, isNodeRef } from './index';
import { getStore } from './store';
import { findObjectsInStore } from './getEntities';
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
   * @param getLiteral.predicate Which property of this Subject you want the value of.
   * @returns The first literal value satisfying `predicate`, if any, and `null` otherwise.
   */
  getLiteral: (predicate: NodeRef) => LiteralTypes | null;
  /**
   * @param getAllLiterals.predicate Which property of this Subject you want the values of.
   * @returns All literal values satisfying `predicate`.
   */
  getAllLiterals: (predicate: NodeRef) => LiteralTypes[];
  /**
   * @param getNodeRef.predicate Which property of this Subject you want the value of.
   * @returns The IRI of the first Node satisfying `predicate`, if any, and `null` otherwise.
   */
  getNodeRef: (predicate: NodeRef) => NodeRef | null;
  /**
   * @returns The type of this Subject, if known.
   */
  getType: () => NodeRef | null;
  /**
   * @param getAllNodeRefs.predicate Which property of this Subject you want the values of.
   * @returns IRIs of all Nodes satisfying `predicate`.
   */
  getAllNodeRefs: (predicate: NodeRef) => Array<NodeRef>;
  /**
   * Set a property of this Subject to a Literal value (i.e. not a URL).
   *
   * Note that this value is not saved to the user's Pod until you save the containing Document.
   *
   * @param addLiteral.predicate The property you want to add another value of.
   * @param addLiteral.object The Literal value you want to add, the type of which is one of [[LiteralTypes]].
   */
  addLiteral: (predicate: NodeRef, object: LiteralTypes) => void;
  /**
   * Set a property of this Subject to a Node.
   *
   * Note that this value is not saved to the user's Pod until you save the containing Document.
   *
   * @param addNodeRef.predicate The property you want to add another value of.
   * @param addNodeRef.object The IRI of the Node you want to add.
   */
  addNodeRef: (predicate: NodeRef, object: NodeRef) => void;
  /**
   * Remove a Literal value for a property of this Subject.
   *
   * Note that this value is not removed from the user's Pod until you save the containing Document.
   *
   * @param removeLiteral.predicate The property you want to remove a value of.
   * @param removeLiteral.object The Literal value you want to remove, the type of which is one of [[LiteralTypes]].
   */
  removeLiteral: (predicate: NodeRef, object: LiteralTypes) => void;
  /**
   * No longer point a property of this Subject to a given Node.
   *
   * Note that this pointer is not removed from the user's Pod until you save the containing Document.
   *
   * @param removeNodeRef.predicate The property you no longer want to point to the given Node.
   * @param removeNodeRef.object The IRI of the Node you want to remove.
   */
  removeNodeRef: (predicate: NodeRef, object: NodeRef) => void;
  /**
   * Remove all values for a property of this Subject.
   *
   * Note that these values are not removed from the user's Pod until you save the containing
   * Document.
   *
   * @param removeAll.predicate The property you want to remove the values of.
   */
  removeAll: (predicate: NodeRef) => void;
  /**
   * Set a property of this Subject to a Literal value, clearing all existing values.
   *
   * Note that this change is not saved to the user's Pod until you save the containing Document.
   *
   * @param setLiteral.predicate The property you want to set the value of.
   * @param setLiteral.object The Literal value you want to set, the type of which is one of [[LiteralTypes]].
   */
  setLiteral: (predicate: NodeRef, object: LiteralTypes) => void;
  /**
   * Set a property of this Subject to a Node, clearing all existing values.
   *
   * Note that this change is not saved to the user's Pod until you save the containing Document.
   *
   * @param setNodeRef.predicate The property you want to set the value of.
   * @param setNodeRef.object The IRI of the Node you want to add.
   */
  setNodeRef: (predicate: NodeRef, object: NodeRef) => void;
  /**
   * @ignore Pending Statements are only provided so the Document can access them in order to save
   *         them - this is not part of the public API and can thus break in a minor release.
   * @returns A tuple with the first element being a list of Statements that should be deleted from
   *          the store, and the second element a list of Statements that should be added to it.
   */
  getPendingStatements: () => [Statement[], Statement[]];
  /**
   * @ignore `onSave` should only be called by the Document that is responsible for saving this
   *         Subject, so it's not part of the public API and can break in a minor release.
   */
  onSave: () => void;
  /**
   * Get the IRI of the Node representing this specific Subject.
   *
   * @returns The IRI of this specific Subject.
   */
  asNodeRef: () => NodeRef;
};

/**
 * @ignore Only to be called by the Document containing this subject; not a public API.
 * @param document The Document this Subject is defined in.
 * @param subjectRef The URL that identifies this subject.
 */
export function initialiseSubject(document: TripleDocument, subjectRef: NodeRef): TripleSubject {
  const store = getStore();
  let pendingAdditions: Statement[] = [];
  let pendingDeletions: Statement[] = [];

  const get = (predicateNode: NodeRef) => findObjectsInStore(store, subjectRef, predicateNode, document.asNodeRef());
  const getLiteral = (predicateNode: NodeRef) => {
    const objects = get(predicateNode);
    const firstLiteral = objects.find(isLiteral);
    if (typeof firstLiteral === 'undefined') {
      return null;
    }
    return fromLiteral(firstLiteral);
  };
  const getAllLiterals = (predicateNode: NodeRef) => {
    const objects = get(predicateNode);
    const literals = objects.filter(isLiteral);
    return literals.map(fromLiteral);
  };
  const getNodeRef = (predicateNode: NodeRef) => {
    const objects = get(predicateNode);
    const firstNodeRef = objects.find(isNodeRef);
    if (typeof firstNodeRef === 'undefined') {
      return null;
    }
    return firstNodeRef;
  };
  const getAllNodeRefs = (predicateNode: NodeRef) => {
    const objects = get(predicateNode);
    const nodeRefs = objects.filter(isNodeRef);
    return nodeRefs;
  };

  const getType = () => {
    return getNodeRef(rdf.type);
  }

  const addLiteral = (predicateRef: NodeRef, literal: LiteralTypes) => {
    pendingAdditions.push(st(sym(subjectRef), sym(predicateRef), asLiteral(literal), sym(document.asNodeRef())));
  };
  const addNodeRef = (predicateRef: NodeRef, nodeRef: NodeRef) => {
    pendingAdditions.push(st(sym(subjectRef), sym(predicateRef), sym(nodeRef), sym(document.asNodeRef())));
  };
  const removeAll = (predicateRef: NodeRef) => {
    pendingDeletions.push(...store.statementsMatching(sym(subjectRef), sym(predicateRef), null, sym(document.asNodeRef())));
  }

  const subject: TripleSubject = {
    getDocument: () => document,
    getStatements: () => store.statementsMatching(sym(subjectRef), null, null, sym(document.asNodeRef())),
    getLiteral: getLiteral,
    getAllLiterals: getAllLiterals,
    getNodeRef: getNodeRef,
    getAllNodeRefs: getAllNodeRefs,
    getType: getType,
    addLiteral: addLiteral,
    addNodeRef: addNodeRef,
    removeAll: removeAll,
    removeLiteral: (predicateRef, literal) => {
      pendingDeletions.push(st(sym(subjectRef), sym(predicateRef), asLiteral(literal), sym(document.asNodeRef())));
    },
    removeNodeRef: (predicateRef, nodeRef) => {
      pendingDeletions.push(st(sym(subjectRef), sym(predicateRef), sym(nodeRef), sym(document.asNodeRef())));
    },
    setLiteral: (predicateRef, literal) => {
      removeAll(predicateRef);
      addLiteral(predicateRef, literal);
    },
    setNodeRef: (predicateRef, nodeRef) => {
      removeAll(predicateRef);
      addNodeRef(predicateRef, nodeRef);
    },
    getPendingStatements: () => [pendingDeletions, pendingAdditions],
    onSave: () => {
      pendingDeletions = [];
      pendingAdditions = [];
    },
    asNodeRef: () => subjectRef,
  };

  return subject;
}

function fromLiteral(literal: Literal): LiteralTypes {
  if (literal.datatype.uri === 'http://www.w3.org/2001/XMLSchema#dateTime') {
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
  if (literal.datatype.uri === 'http://www.w3.org/2001/XMLSchema#integer') {
    return parseInt(literal.value, 10);
  }
  if (literal.datatype.uri === 'http://www.w3.org/2001/XMLSchema#decimal') {
    return parseFloat(literal.value);
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

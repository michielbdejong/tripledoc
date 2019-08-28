import { Statement, Literal, st, sym } from 'rdflib';
import { NodeRef, isLiteral, LiteralTypes, isNodeRef } from './index';
import { getStore } from './store';
import { findObjectsInStore } from './getEntities';
import { TripleDocument } from './document';
import { rdf } from 'rdf-namespaces';

export interface TripleSubject {
  /**
   * @returns The Document that contains this Subject.
   */
  getDocument: () => TripleDocument;
  /**
   * @deprecated
   * @ignore This is mostly a convenience function to make it easy to work with rdflib and tripledoc
   *         simultaneously. If you rely on this, it's probably best to either file an issue
   *         describing what you want to do that tripledoc can't do directly, or to just use rdflib
   *         directly.
   * @returns The Statements pertaining to this Subject that are stored on the user's Pod. Note that
   *          this does not return Statements that have not been saved yet - see
   *          [[getPendingStatements]] for those.
   */
  getStatements: () => Statement[];
  /**
   * @param predicate Which property of this Subject you want the value of.
   * @returns The first literal value satisfying [[predicate]], if any, and `null` otherwise.
   */
  getLiteral: (predicate: NodeRef) => LiteralTypes | null;
  /**
   * @param predicate Which property of this Subject you want the values of.
   * @returns All literal values satisfying [[predicate]].
   */
  getAllLiterals: (predicate: NodeRef) => Array<LiteralTypes>;
  /**
   * @param predicate Which property of this Subject you want the value of.
   * @returns The IRI of the first Node satisfying [[predicate]], if any, and `null` otherwise.
   */
  getNodeRef: (predicate: NodeRef) => NodeRef | null;
  /**
   * @returns The type of this Subject, if known.
   */
  getType: () => NodeRef | null;
  /**
   * @param predicate Which property of this Subject you want the values of.
   * @returns IRIs of all Nodes satisfying [[predicate]].
   */
  getAllNodeRefs: (predicate: NodeRef) => Array<NodeRef>;
  /**
   * Set a property of this Subject to a Literal value (i.e. not a URL).
   *
   * Note that this value is not saved to the user's Pod until you save the containing Document.
   *
   * @param predicate The property you want to add another value of.
   * @param object The Literal value you want to add, the type of which is one of [[LiteralTypes]].
   */
  addLiteral: (predicate: NodeRef, object: LiteralTypes) => void;
  /**
   * Set a property of this Subject to a Node.
   *
   * Note that this value is not saved to the user's Pod until you save the containing Document.
   *
   * @param predicate The property you want to add another value of.
   * @param object The IRI of the Node you want to add.
   */
  addNodeRef: (predicate: NodeRef, object: NodeRef) => void;
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
  // TODO: set, remove
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
    return firstLiteral.value;
  };
  const getAllLiterals = (predicateNode: NodeRef) => {
    const objects = get(predicateNode);
    const literals = objects.filter(isLiteral);
    return literals.map(literal => literal.value);
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

  const subject: TripleSubject = {
    getDocument: () => document,
    getStatements: () => store.statementsMatching(sym(subjectRef), null, null, sym(document.asNodeRef())),
    getLiteral: getLiteral,
    getAllLiterals: getAllLiterals,
    getNodeRef: getNodeRef,
    getAllNodeRefs: getAllNodeRefs,
    getType: getType,
    addLiteral: (predicateRef, literal) => {
      pendingAdditions.push(st(sym(subjectRef), sym(predicateRef), asLiteral(literal), sym(document.asNodeRef())));
    },
    addNodeRef: (predicateRef, nodeRef) => {
      pendingAdditions.push(st(sym(subjectRef), sym(predicateRef), sym(nodeRef), sym(document.asNodeRef())));
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

function asLiteral(literal: LiteralTypes): Literal {
  // Unfortunately the typings are really incomplete, so we have to do some casting here:
  return new Literal(literal as string, undefined as any, undefined as any);
}

import { Statement, Literal, st, sym } from 'rdflib';
import { NodeRef, isLiteral, LiteralTypes } from './index';
import { getStore, update } from './store';
import { findObjectInStore, findObjectsInStore } from './getEntities';
import { fetchDocument, TripleDocument } from './document';

export interface TripleSubject {
  getDocument: () => TripleDocument;
  getStatements: () => Statement[];
  get: (predicate: NodeRef) => NodeRef | Literal | null;
  getLiteral: (predicate: NodeRef) => LiteralTypes | null;
  getNodeRef: (predicate: NodeRef) => NodeRef | null;
  getAll: (predicate: NodeRef) => Array<NodeRef | Literal>;
  has: (predicate: NodeRef) => boolean;
  add: (predicate: NodeRef, object: NodeRef | Literal) => void;
  /**
   * @ignore
   */
  getPendingStatements: () => [Statement[], Statement[]];
  /**
   * @ignore
   */
  onSave: () => void;
  getIri: () => NodeRef;
  // TODO: set, remove
};

export async function fetchSubject(subjectRef: NodeRef): Promise<TripleSubject> {
  const document = await fetchDocument(subjectRef);
  return document.getSubject(subjectRef);
}

export function initialiseSubject(document: TripleDocument, subjectRef: NodeRef): TripleSubject {
  const store = getStore();

  let pendingAdditions: Statement[] = [];
  let pendingDeletions: Statement[] = [];

  const get = (predicateNode: NodeRef) => findObjectInStore(store, subjectRef, predicateNode, document.getIri());
  const getLiteral = (predicateNode: NodeRef) => {
    const object = get(predicateNode);
    if (!isLiteral(object)) {
      return null;
    }
    return object.value;
  };
  const getNodeRef = (predicateNode: NodeRef) => {
    const object = get(predicateNode);
    if (isLiteral(object)) {
      return null;
    }
    return object;
  };

  const subject: TripleSubject = {
    getDocument: () => document,
    getStatements: () => store.statementsMatching(sym(subjectRef), null, null, sym(document.getIri())),
    get: get,
    getLiteral: getLiteral,
    getNodeRef: getNodeRef,
    getAll: (predicateNode) => findObjectsInStore(store, subjectRef, predicateNode, document.getIri()),
    has: (predicateRef) => findObjectInStore(store, subjectRef, predicateRef, document.getIri()) !== null,
    add: (predicateRef, object) => {
      const objectNode = isLiteral(object) ? object : sym(object);
      pendingAdditions.push(st(sym(subjectRef), sym(predicateRef), objectNode, sym(document.getIri())));
    },
    getPendingStatements: () => [pendingDeletions, pendingAdditions],
    onSave: () => {
      pendingDeletions = [];
      pendingAdditions = [];
    },
    getIri: () => subjectRef,
  };

  return subject;
}

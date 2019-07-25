import { Statement, Literal, st, sym } from 'rdflib';
import { NodeRef, isLiteral } from './index';
import { getStore, update } from './store';
import { findObjectInStore, findObjectsInStore } from './getEntities';
import { fetchDocument, TripleDocument } from './document';

export interface TripleSubject {
  getDocument: () => TripleDocument;
  getStatements: () => Statement[];
  get: (predicate: NodeRef) => NodeRef | Literal | null;
  getAll: (predicate: NodeRef) => Array<NodeRef | Literal>;
  has: (predicate: NodeRef) => boolean;
  add: (predicate: NodeRef, object: NodeRef | Literal) => void;
  save: () => Promise<boolean>;
  // TODO: set, remove
};

export async function fetchSubject(subjectRef: NodeRef): Promise<TripleSubject> {
  const document = await fetchDocument(subjectRef);
  return document.getSubject(subjectRef);
}

export function initialiseSubject(document: TripleDocument, subjectRef: NodeRef): TripleSubject {
  const store = getStore();

  const unsavedAdditions: Statement[] = [];
  const unsavedDeletions: Statement[] = [];

  const subject: TripleSubject = {
    getDocument: () => document,
    getStatements: () => store.statementsMatching(sym(subjectRef), null, null, sym(document.getIri())),
    get: (predicateNode) => findObjectInStore(store, subjectRef, predicateNode, document.getIri()),
    getAll: (predicateNode) => findObjectsInStore(store, subjectRef, predicateNode, document.getIri()),
    has: (predicateRef) => findObjectInStore(store, subjectRef, predicateRef, document.getIri()) !== null,
    add: (predicateRef, object) => {
      const objectNode = isLiteral(object) ? object : sym(object);
      unsavedAdditions.push(st(sym(subjectRef), sym(predicateRef), objectNode, sym(document.getIri())));
    },
    save: async () => {
      try {
        await update(unsavedDeletions, unsavedAdditions);
        return true;
      } catch(e) {
        return false;
      }
    },
  };

  return subject;
}

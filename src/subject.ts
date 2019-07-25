import { NamedNode, Statement, Node, Literal, st } from 'rdflib';
import { asNamedNode, NodeRef, isLiteral } from './index';
import { getStore, getUpdater, update } from './store';
import { findObjectInStore, findObjectsInStore } from './getEntities';
import { fetchDocument } from './document';

export interface TripleSubject {
  getStatements: () => Statement[];
  get: (predicate: NodeRef) => Node | null;
  getAll: (predicate: NodeRef) => Node[];
  has: (predicate: NodeRef) => boolean;
  add: (predicate: NodeRef, object: NodeRef | Literal) => void;
  save: () => Promise<boolean>;
  // TODO: set, remove
};

export async function fetchSubject(uri: string): Promise<TripleSubject> {
  const document = await fetchDocument(uri);
  return document.getSubject(uri);
}

export function getSubject(documentNode: NamedNode, subjectRef: NodeRef): TripleSubject {
  const store = getStore();
  const subjectNode = asNamedNode(subjectRef);

  const unsavedAdditions: Statement[] = [];
  const unsavedDeletions: Statement[] = [];

  const subject: TripleSubject = {
    getStatements: () => store.statementsMatching(subjectNode, null, null, documentNode),
    get: (predicateNode) => findObjectInStore(store, subjectNode, predicateNode, documentNode),
    getAll: (predicateNode) => findObjectsInStore(store, subjectNode, predicateNode, documentNode),
    has: (predicateNode) => findObjectInStore(store, subjectNode, predicateNode, documentNode) !== null,
    add: (predicateNode, object) => {
      const objectNode = isLiteral(object) ? object : asNamedNode(object);
      unsavedAdditions.push(st(subjectNode, asNamedNode(predicateNode), objectNode, documentNode));
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

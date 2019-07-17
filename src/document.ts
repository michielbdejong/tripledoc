import { Node, NamedNode, Statement } from 'rdflib';
import LinkHeader from 'http-link-header';
import { getFetcher, getStore, getUpdater } from './store';
import { findSubjectInStore, findPredicateInStore, findObjectInStore, FindEntityInStore, FindEntitiesInStore, findSubjectsInStore, findPredicatesInStore, findObjectsInStore } from './getEntities';
import { deleteStatementsFromStore, DeleteStatementsFromStore } from './deleteStatements';
import { TripleSubject, getSubject } from './subject';

/**
 * Initialise a new Turtle document
 *
 * @param url URL where this document should live
 * @param statements Initial statements to be included in this document
 */
export async function createDocument(url: string, statements: Statement[] = []) {
  const store = getStore();
  const updater = getUpdater();
  const doc = store.sym(url);
  return await updater.put(doc, statements, 'text/turtle', () => undefined);
}

export interface TripleDocument {
  findSubject: (predicateNode: NamedNode, object: NamedNode) => Node | null;
  findSubjects: (predicate: NamedNode, object: NamedNode) => Node[];
  findPredicate: (subject: NamedNode, object: NamedNode) => Node | null;
  findPredicates: (subject: NamedNode, object: NamedNode) => Node[];
  findObject: (subject: NamedNode, predicate: NamedNode) => Node | null;
  findObjects: (subject: NamedNode, predicate: NamedNode) => Node[];
  getSubject: (subjectNode: NamedNode | string) => TripleSubject;
  deleteStatements: (statements: Statement[]) => Promise<Statement[]>;
  getAcl: () => NamedNode | null;
};

/**
 * Retrieve a document containing RDF triples
 *
 * @param uri Where the document lives
 * @returns Representation of triples in the document at `uri`
 */
export async function fetchDocument(uri: string): Promise<TripleDocument> {
  const store = getStore();
  const fetcher = getFetcher();
  const updater = getUpdater();
  const response = await fetcher.load(uri);

  const getAcl: () => NamedNode | null = () => {
    const linkHeader = response.headers.get('Link');
    if (!linkHeader) {
      return null;
    }
    const parsedLinks = LinkHeader.parse(linkHeader);
    const aclLinks = parsedLinks.get('rel', 'acl');
    if (aclLinks.length !== 1) {
      return null;
    }
    return store.sym(aclLinks[0].uri);
  };
  const docUrl = new URL(uri);
  // Remove fragment identifiers (e.g. `#me`) from the URI:
  const documentNode = store.sym(docUrl.origin + docUrl.pathname + docUrl.search);


  const tripleDocument: TripleDocument = {
    getSubject: (subjectNode: NamedNode | string) => getSubject(documentNode, subjectNode),
    findSubject: withDocumentSingular(findSubjectInStore, documentNode),
    findSubjects: withDocumentPlural(findSubjectsInStore, documentNode),
    findPredicate: withDocumentSingular(findPredicateInStore, documentNode),
    findPredicates: withDocumentPlural(findPredicatesInStore, documentNode),
    findObject: withDocumentSingular(findObjectInStore, documentNode),
    findObjects: withDocumentPlural(findObjectsInStore, documentNode),
    deleteStatements: (statements: Statement[]) => deleteStatementsFromStore(store, updater, statements),
    getAcl: getAcl,
  };
  return tripleDocument;
}

const withDocumentSingular = (getEntityFromStore: FindEntityInStore, document: NamedNode) => {
  const store = getStore();
  return (knownEntity1: NamedNode, knownEntity2: NamedNode) =>
    getEntityFromStore(store, knownEntity1, knownEntity2, document);
};
const withDocumentPlural = (getEntitiesFromStore: FindEntitiesInStore, document: NamedNode) => {
  const store = getStore();
  return (knownEntity1: NamedNode, knownEntity2: NamedNode) =>
    getEntitiesFromStore(store, knownEntity1, knownEntity2, document);
};

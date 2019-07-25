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
export async function createDocument(url: string, statements: Statement[] = []): Promise<TripleDocument> {
  const store = getStore();
  const updater = getUpdater();
  const doc = store.sym(url);
  const response = await updater.put(doc, statements, 'text/turtle', () => undefined);
  console.log('CreateDocument', { response });
  return getLocalDocument(url);
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
  const fetcher = getFetcher();
  const response = await fetcher.load(uri);

  let aclUri;
  const linkHeader = response.headers.get('Link');
  if(linkHeader) {
    const parsedLinks = LinkHeader.parse(linkHeader);
    const aclLinks = parsedLinks.get('rel', 'acl');
    if (aclLinks.length === 1) {
      aclUri = aclLinks[0].uri;
    }
  }

  return getLocalDocument(uri, aclUri);
}

function getLocalDocument(uri: string, aclUri?: string): TripleDocument {
  const store = getStore();
  const updater = getUpdater();
  const docUrl = new URL(uri);
  // Remove fragment identifiers (e.g. `#me`) from the URI:
  const documentNode = store.sym(docUrl.origin + docUrl.pathname + docUrl.search);

  const getAcl: () => NamedNode | null = () => {
    return aclUri ? store.sym(aclUri) : null;
  };

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

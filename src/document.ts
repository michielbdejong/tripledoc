import { Statement } from 'rdflib';
import LinkHeader from 'http-link-header';
import { getFetcher, getStore, getUpdater } from './store';
import { findSubjectInStore, FindEntityInStore, FindEntitiesInStore, findSubjectsInStore, findPredicatesInStore, findObjectsInStore } from './getEntities';
import { TripleSubject, initialiseSubject } from './subject';
import { NodeRef } from '.';

/**
 * Initialise a new Turtle document
 *
 * @param ref URL where this document should live
 * @param statements Initial statements to be included in this document
 */
export async function createDocument(ref: NodeRef, statements: Statement[] = []): Promise<TripleDocument> {
  const store = getStore();
  const updater = getUpdater();
  const doc = store.sym(ref);
  // TODO: Try not making a PUT request until `.save()` is called on the document
  const response = await updater.put(doc, statements, 'text/turtle', () => undefined);
  return getLocalDocument(ref);
}

export interface TripleDocument {
  findSubject: (predicateRef: NodeRef, objectRef: NodeRef) => TripleSubject | null;
  getSubject: (subjectRef: NodeRef) => TripleSubject;
  getAcl: () => NodeRef | null;
  getIri: () => NodeRef;
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

function getLocalDocument(uri: NodeRef, aclUri?: NodeRef): TripleDocument {
  const docUrl = new URL(uri);
  // Remove fragment identifiers (e.g. `#me`) from the URI:
  const documentRef: NodeRef = docUrl.origin + docUrl.pathname + docUrl.search;

  const getAcl: () => NodeRef | null = () => {
    return aclUri || null;
  };

  const accessedSubjects: { [iri: string]: TripleSubject } = {};
  const getSubject = (subjectRef: NodeRef) => {
    if (accessedSubjects[subjectRef]) {
      accessedSubjects[subjectRef] = initialiseSubject(tripleDocument, subjectRef);
    }
    return accessedSubjects[subjectRef];
  };

  const tripleDocument: TripleDocument = {
    getSubject: getSubject,
    findSubject: (predicateRef, objectRef) => {
      const findSubjectRef = withDocumentSingular(findSubjectInStore, documentRef);
      const subjectRef = findSubjectRef(predicateRef, objectRef);
      if (!subjectRef) {
        return null;
      }
      return getSubject(subjectRef);
    },
    getAcl: getAcl,
    getIri: () => uri,
  };
  return tripleDocument;
}

const withDocumentSingular = (getEntityFromStore: FindEntityInStore, document: NodeRef) => {
  const store = getStore();
  return (knownEntity1: NodeRef, knownEntity2: NodeRef) =>
    getEntityFromStore(store, knownEntity1, knownEntity2, document);
};
const withDocumentPlural = (getEntitiesFromStore: FindEntitiesInStore, document: NodeRef) => {
  const store = getStore();
  return (knownEntity1: NodeRef, knownEntity2: NodeRef) =>
    getEntitiesFromStore(store, knownEntity1, knownEntity2, document);
};

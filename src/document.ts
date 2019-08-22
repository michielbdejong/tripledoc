import { Statement } from 'rdflib';
import LinkHeader from 'http-link-header';
import { rdf } from 'rdf-namespaces';
import { getFetcher, getStore, getUpdater, update } from './store';
import { findSubjectInStore, FindEntityInStore, FindEntitiesInStore, findSubjectsInStore } from './getEntities';
import { TripleSubject, initialiseSubject } from './subject';
import { NodeRef, isLiteral, isNodeRef } from '.';

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

export interface NewSubjectOptions {
  identifier?: string;
  identifierPrefix?: string;
};
export interface TripleDocument {
  /**
   * Add a subject — note that it is not written to the Pod until explicitly told to
   */
  addSubject: (options?: NewSubjectOptions) => TripleSubject;
  findSubject: (predicateRef: NodeRef, objectRef: NodeRef) => TripleSubject | null;
  findSubjects: (predicateRef: NodeRef, objectRef: NodeRef) => TripleSubject[];
  getSubject: (subjectRef: NodeRef) => TripleSubject;
  getSubjectsOfType: (typeRef: NodeRef) => TripleSubject[];
  getAcl: () => NodeRef | null;
  getIri: () => NodeRef;
  save: (subjects?: TripleSubject[]) => Promise<Array<TripleSubject>>;
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
    if (!accessedSubjects[subjectRef]) {
      accessedSubjects[subjectRef] = initialiseSubject(tripleDocument, subjectRef);
    }
    return accessedSubjects[subjectRef];
  };
  const getSubjectsOfType = (typeRef: NodeRef) => {
    const findSubjectRefs = withDocumentPlural(findSubjectsInStore, documentRef);
    const subjectRefs = findSubjectRefs(rdf.type, typeRef);
    const subjects = subjectRefs
      .filter(isNodeRef)
      .map((subjectRef) => getSubject(subjectRef));

    return subjects;
  };

  const addSubject = (
    {
      identifier = generateIdentifier(),
      identifierPrefix = '',
    }: NewSubjectOptions = {},
  ) => {
    const subjectRef: NodeRef = documentRef + '#' + identifierPrefix + identifier;
    return getSubject(subjectRef);
  };

  const save = async (subjects = Object.values(accessedSubjects)) => {
    const relevantSubjects = subjects.filter(subject => subject.getDocument().getIri() === documentRef);
    type UpdateStatements = [Statement[], Statement[]];
    const [allDeletions, allAdditions] = relevantSubjects.reduce<UpdateStatements>(
      ([deletionsSoFar, additionsSoFar], subject) => {
        const [deletions, additions] = subject.getPendingStatements();
        return [deletionsSoFar.concat(deletions), additionsSoFar.concat(additions)];
      },
      [[], []],
    );

    await update(allDeletions, allAdditions);
    relevantSubjects.forEach(subject => subject.onSave());
    return relevantSubjects;
  };

  const tripleDocument: TripleDocument = {
    addSubject: addSubject,
    getSubject: getSubject,
    getSubjectsOfType: getSubjectsOfType,
    findSubject: (predicateRef, objectRef) => {
      const findSubjectRef = withDocumentSingular(findSubjectInStore, documentRef);
      const subjectRef = findSubjectRef(predicateRef, objectRef);
      if (!subjectRef || isLiteral(subjectRef)) {
        return null;
      }
      return getSubject(subjectRef);
    },
    findSubjects: (predicateRef, objectRef) => {
      const findSubjectRefs = withDocumentPlural(findSubjectsInStore, documentRef);
      const subjectRefs = findSubjectRefs(predicateRef, objectRef);
      return subjectRefs.filter(isNodeRef).map(getSubject);
    },
    getAcl: getAcl,
    getIri: () => documentRef,
    save: save,
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

/**
 * Generate a string that can be used as the unique identifier for a Subject
 *
 * This function works by starting with a date string (so that Subjects can be
 * sorted chronologically), followed by a random number generated by taking a
 * random number between 0 and 1, and cutting off the `0.`.
 *
 * @ignore
 * @returns An string that's likely to be unique
 */
const generateIdentifier = () => {
  return Date.now().toString() + Math.random().toString().substring('0.'.length);
}

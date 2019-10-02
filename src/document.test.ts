import { graph, st, sym, NamedNode, Statement } from 'rdflib';
import { createDocument, fetchDocument } from './document';
import { rdf, schema } from 'rdf-namespaces';

const mockDocument = 'https://document.com/';
const mockSubject = 'https://subject1.com/';
const mockSubject2 = 'https://subject2.com/';
const mockSubjectOfTypeMovie1 = 'https://subject3.com/';
const mockSubjectOfTypeMovie2 = 'https://subject4.com/';
const mockPredicate = 'https://mock-predicate.com/';
const mockUnusedPredicate = 'https://mock-unused-predicate.com/';
const mockObject= 'https://mock-object.com/';
const mockUnusedObject= 'https://mock-unused-object.com/';
const mockStatements = [
  st(sym(mockSubjectOfTypeMovie1), sym(rdf.type), sym(schema.Movie), sym(mockDocument)),
  st(sym(mockSubjectOfTypeMovie2), sym(rdf.type), sym(schema.Movie), sym(mockDocument)),
  st(sym(mockSubject), sym(mockPredicate), sym(mockObject), sym(mockDocument)),
  st(sym(mockSubject2), sym(mockPredicate), sym(mockObject), sym(mockDocument)),
];
const store = graph();
store.addAll(mockStatements);
let mockUpdater: jest.Mock;
let mockCreater: jest.Mock;
let mockFetchLoad: jest.Mock;
jest.mock('./store', () => {
  mockUpdater = jest.fn(() => Promise.resolve());
  mockCreater = jest.fn(() => Promise.resolve({
    headers: { get: () => null },
  }));
  mockFetchLoad = jest.fn(() => Promise.resolve({
    headers: new Headers()
  }));
  return {
    getStore: () => store,
    getFetcher: () => ({
      load: mockFetchLoad,
    }),
    update: mockUpdater,
    create: mockCreater,
  }
});

function getMockTripleDocument() {
  const mockTripleDocument = createDocument(mockDocument);
  return mockTripleDocument;
}

describe('getSubject', () => {
  it('should not re-initialise Subjects every time they are accessed', () => {
    const mockTripleDocument = getMockTripleDocument();
    const firstAccessed = mockTripleDocument.getSubject(mockSubjectOfTypeMovie1);
    const secondAccessed = mockTripleDocument.getSubject(mockSubjectOfTypeMovie1);
    expect(firstAccessed).toEqual(secondAccessed);
  });
});

describe('getSubjectsOfType', () => {
  it('should return all Subjects that are of a specific type', () => {
    const mockTripleDocument = getMockTripleDocument();
    const movies = mockTripleDocument.getSubjectsOfType(schema.Movie);
    expect(movies.map(subject => subject.asNodeRef()))
      .toEqual([mockSubjectOfTypeMovie1, mockSubjectOfTypeMovie2]);
  });
});

describe('findSubject', () => {
  it('should return a single Subject that matches the given Predicate and Object', () => {
    const mockTripleDocument = getMockTripleDocument();
    const foundSubject = mockTripleDocument.findSubject(mockPredicate, mockObject);
    expect(foundSubject!.asNodeRef()).toBe(mockSubject);
  });

  it('should return null if no Subject matches the given Object', () => {
    const mockTripleDocument = getMockTripleDocument();
    const foundSubject = mockTripleDocument.findSubject(mockPredicate, mockUnusedObject);
    expect(foundSubject).toBeNull();
  });

  it('should return null if no Subject matches the given Predicate', () => {
    const mockTripleDocument = getMockTripleDocument();
    const foundSubject = mockTripleDocument.findSubject(mockUnusedPredicate, mockObject);
    expect(foundSubject).toBeNull();
  });
});

describe('findSubjects', () => {
  it('should return all Subjects that match the given Predicate and Object', () => {
    const mockTripleDocument = getMockTripleDocument();
    const foundSubjects = mockTripleDocument.findSubjects(mockPredicate, mockObject);
    const foundRefs = foundSubjects.map(subject => subject.asNodeRef());
    expect(foundRefs).toEqual([mockSubject, mockSubject2]);
  });

  it('should return an empty array if no Subject matches the given Object', () => {
    const mockTripleDocument = getMockTripleDocument();
    const foundSubjects = mockTripleDocument.findSubjects(mockPredicate, mockUnusedObject);
    expect(foundSubjects).toEqual([]);
  });

  it('should return null if no Subject matches the given Predicate', () => {
    const mockTripleDocument = getMockTripleDocument();
    const foundSubjects = mockTripleDocument.findSubjects(mockUnusedPredicate, mockObject);
    expect(foundSubjects).toEqual([]);
  });
});

describe('addSubject', () => {
  it('should generate a random identifier for a new Subject', () => {
    const mockTripleDocument = getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject();
    const identifier = newSubject.asNodeRef().substring(mockTripleDocument.asNodeRef().length);
    expect(identifier.charAt(0)).toBe('#');
    expect(identifier.length).toBeGreaterThan(1);
  });

  it('should use a given identifier', () => {
    const mockTripleDocument = getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject({ identifier: 'some-id' });
    expect(newSubject.asNodeRef()).toBe(mockTripleDocument.asNodeRef() + '#some-id');
  });

  it('should use a given prefix for the identifier', () => {
    const mockTripleDocument = getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject({ identifierPrefix: 'some-prefix_' });
    const identifier = newSubject.asNodeRef().substring(mockTripleDocument.asNodeRef().length);
    expect(identifier.substring(0, '#some-prefix_'.length)).toBe('#some-prefix_');
    expect(identifier.length).toBeGreaterThan('#some-prefix_'.length);
  });

  it('should use a given prefix before a given identifier', () => {
    const mockTripleDocument = getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject({
      identifier: 'some-id',
      identifierPrefix: 'some-prefix_',
    });
    expect(newSubject.asNodeRef()).toBe(mockTripleDocument.asNodeRef() + '#some-prefix_some-id');
  });
});

describe('save', () => {
  it('should save all pending statements from a given subject, and clear them when saved', async () => {
    const mockTripleDocument = getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject();
    newSubject.addLiteral(schema.name, 'Some value');

    const [_pendingDeletionsBeforeSave, pendingAdditionsBeforeSave] = newSubject.getPendingStatements();
    expect(pendingAdditionsBeforeSave.length).toBe(1);
    expect(pendingAdditionsBeforeSave[0].object.value).toBe('Some value');
    await mockTripleDocument.save();

    const [_pendingDeletionsAfterSave, pendingAdditionsAfterSave] = newSubject.getPendingStatements();
    expect(pendingAdditionsAfterSave.length).toBe(0);
  });

  it('should allow only saving specific subjects', async () => {
    const mockTripleDocument = getMockTripleDocument();
    const subjectToSave = mockTripleDocument.addSubject();
    subjectToSave.addLiteral(schema.name, 'Some value to save');
    const subjectNotToSave = mockTripleDocument.addSubject();
    subjectNotToSave.addLiteral(schema.name, 'Some value not to save');

    await mockTripleDocument.save([ subjectToSave ]);

    const [_pendingDeletionsForSaved, pendingAdditionForSaved] = subjectToSave.getPendingStatements();
    const [_pendingDeletionsForUnsaved, pendingAdditionForUnsaved] = subjectNotToSave.getPendingStatements();
    expect(pendingAdditionForSaved.length).toBe(0);
    expect(pendingAdditionForUnsaved.length).toBe(1);
    const savedStatements = mockCreater.mock.calls[0][1] as Statement[];
    expect(savedStatements.length).toBe(1);
  });

  it('should call `create` when creating a new Document', async () => {
    const mockTripleDocument = createDocument(mockDocument);
    const newSubject = mockTripleDocument.addSubject();
    newSubject.addLiteral(schema.name, 'Some value');

    await mockTripleDocument.save();

    expect(mockCreater.mock.calls.length).toBe(1);
    expect(mockUpdater.mock.calls.length).toBe(0);
    // The Document to be created is the first argument to `create`:
    expect(mockCreater.mock.calls[0][0] as string).toBe(mockDocument);
    // The Statements to be inserted are the second argument:
    expect((mockCreater.mock.calls[0][1] as Statement[]).length).toBe(1);
    expect((mockCreater.mock.calls[0][1] as Statement[])[0].object.value).toBe('Some value');
  });

  it('should return the ACL if received after creating a new Document', async () => {
    const mockTripleDocument = createDocument(mockDocument);
    const newSubject = mockTripleDocument.addSubject();
    newSubject.addLiteral(schema.name, 'Arbitrary value');
    expect(mockTripleDocument.getAclRef()).toBeNull();

    mockCreater.mockReturnValueOnce(Promise.resolve({
      headers: {
        get: () => '<https://some-acl-url.example>; rel="acl"'
      },
    }));

    await mockTripleDocument.save();

    expect(mockTripleDocument.getAclRef()).toBe('https://some-acl-url.example/');
  });

  it('should call `update` when modifying an existing Document', async () => {
    const mockTripleDocument = await fetchDocument(mockDocument);
    const newSubject = mockTripleDocument.addSubject();
    newSubject.addLiteral(schema.name, 'Some value');

    await mockTripleDocument.save();

    expect(mockUpdater.mock.calls.length).toBe(1);
    expect(mockCreater.mock.calls.length).toBe(0);
    // The Statements to delete are the first argument:
    expect((mockUpdater.mock.calls[0][0] as Statement[]).length).toBe(0);
    // The Statements to add are the second argument:
    expect((mockUpdater.mock.calls[0][1] as Statement[]).length).toBe(1);
    expect((mockUpdater.mock.calls[0][1] as Statement[])[0].object.value).toBe('Some value');
  });
});

describe('getAclRef', () => {
  it('should return null if no ACL header was present', async () => {
    const mockTripleDocument = await fetchDocument(mockDocument);
    expect(mockTripleDocument.getAclRef()).toBeNull();
  });

  it('should return the ACL URL if one was given', async () => {
    mockFetchLoad.mockReturnValueOnce(Promise.resolve({
      headers: new Headers({
        Link: '<https://mock-acl.com>; rel="acl"; title="Mock ACL", ',
      }),
    }));
    const mockTripleDocument = await fetchDocument(mockDocument);
    expect(mockTripleDocument.getAclRef()).toBe('https://mock-acl.com/');
  });

  it('should properly resolve the ACL if its URL is relative', async () => {
    mockFetchLoad.mockReturnValueOnce(Promise.resolve({
      headers: new Headers({
        Link: '<relative-path.ttl.acl>; rel="acl"; title="Mock ACL", ',
      }),
    }));
    const mockTripleDocument = await fetchDocument('https://some-doc.example/relative-path.ttl');
    expect(mockTripleDocument.getAclRef()).toBe('https://some-doc.example/relative-path.ttl.acl');
  });

  it('should return null if more than one ACL was given', async () => {
    mockFetchLoad.mockReturnValueOnce(Promise.resolve({
      headers: new Headers({
        Link: '<https://mock-acl.com>; rel="acl"; title="Mock ACL", ' +
          '<https://mock-acl-2.com>; rel="acl"; title="Mock ACL 2", ',
      }),
    }));
    const mockTripleDocument = await fetchDocument(mockDocument);
    expect(mockTripleDocument.getAclRef()).toBeNull();
  });
});

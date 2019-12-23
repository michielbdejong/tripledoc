import { rdf, schema } from 'rdf-namespaces';
import { DataFactory, Quad } from 'n3';
import { Response } from 'node-fetch';
import { createDocument, fetchDocument } from './document';
import { triplesToTurtle } from './turtle';

const { namedNode, triple, blankNode } = DataFactory;

const mockDocument = 'https://document.com/';
const mockSubject = 'https://document.com/#subject1';
const mockSubject2 = 'https://document.com/#subject2';
const mockSubjectOfTypeMovie1 = 'https://document.com/#subject3';
const mockSubjectOfTypeMovie2 = 'https://document.com/#subject4';
const mockPredicate = 'https://mock-predicate.com/';
const mockUnusedPredicate = 'https://mock-unused-predicate.com/';
const mockObject= 'https://mock-object.com/';
const mockBlankNode = 'arbitrary-blank-node';
const mockUnusedObject= 'https://mock-unused-object.com/';
const mockTriples = [
  triple(namedNode(mockSubjectOfTypeMovie1), namedNode(rdf.type), namedNode(schema.Movie)),
  triple(namedNode(mockSubjectOfTypeMovie2), namedNode(rdf.type), namedNode(schema.Movie)),
  triple(namedNode(mockSubject), namedNode(mockPredicate), namedNode(mockObject)),
  triple(namedNode(mockSubject2), namedNode(mockPredicate), namedNode(mockObject)),
  triple(blankNode(mockBlankNode), namedNode(mockPredicate), namedNode(mockObject)),
];
const turtlePromise = triplesToTurtle(mockTriples);
let mockUpdater: jest.Mock;
let mockCreater: jest.Mock;
let mockGetter: jest.Mock;
jest.mock('./store', () => {
  mockUpdater = jest.fn(() => Promise.resolve());
  mockCreater = jest.fn(() => Promise.resolve(new Response));
  mockGetter = jest.fn(() => turtlePromise.then(turtle => new Response(turtle)));
  return {
    get: mockGetter,
    update: mockUpdater,
    create: mockCreater,
  }
});

async function getMockTripleDocument() {
  const mockTripleDocument = await fetchDocument(mockDocument);
  return mockTripleDocument;
}

describe('fetchDocument', () => {
  it('should error when the server returns a 403', () => {
    mockGetter.mockReturnValueOnce(Promise.resolve(new Response('Not allowed', {
      status: 403,
    })));
    expect(fetchDocument(mockDocument)).rejects.toEqual(new Error('Fetching the Document failed: 403 Forbidden.'));
  });

  it('should error when the server returns a 404', () => {
    mockGetter.mockReturnValueOnce(Promise.resolve(new Response('Does not exist', {
      status: 404,
    })));
    expect(fetchDocument(mockDocument)).rejects.toEqual(new Error('Fetching the Document failed: 404 Not Found.'));
  });
});

describe('getSubject', () => {
  it('should not re-initialise Subjects every time they are accessed', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const firstAccessed = mockTripleDocument.getSubject(mockSubjectOfTypeMovie1);
    const secondAccessed = mockTripleDocument.getSubject(mockSubjectOfTypeMovie1);
    expect(firstAccessed).toEqual(secondAccessed);
  });

  it('should allow accessing Subjects just by their identifier', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const subjectIdentifier = new URL(mockSubject).hash;
    const subject = mockTripleDocument.getSubject(subjectIdentifier);
    expect(subject.getRef(mockPredicate)).toBe(mockObject);
    expect(subject.asRef()).toBe(mockSubject);
  });
});

describe('getSubjectsOfType', () => {
  it('should return all Subjects that are of a specific type', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const movies = mockTripleDocument.getSubjectsOfType(schema.Movie);
    expect(movies.map(subject => subject.asNodeRef()))
      .toEqual([mockSubjectOfTypeMovie1, mockSubjectOfTypeMovie2]);
  });
});

describe('findSubject', () => {
  it('should return a single Subject that matches the given Predicate and Object', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const foundSubject = mockTripleDocument.findSubject(mockPredicate, mockObject);
    expect(foundSubject!.asNodeRef()).toBe(mockSubject);
  });

  it('should return null if no Subject matches the given Object', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const foundSubject = mockTripleDocument.findSubject(mockPredicate, mockUnusedObject);
    expect(foundSubject).toBeNull();
  });

  it('should return null if no Subject matches the given Predicate', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const foundSubject = mockTripleDocument.findSubject(mockUnusedPredicate, mockObject);
    expect(foundSubject).toBeNull();
  });
});

describe('findSubjects', () => {
  it('should return all Subjects that match the given Predicate and Object', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const foundSubjects = mockTripleDocument.findSubjects(mockPredicate, mockObject);
    const foundRefs = foundSubjects.map(subject => subject.asNodeRef());
    expect(foundRefs).toEqual([mockSubject, mockSubject2]);
  });

  it('should return an empty array if no Subject matches the given Object', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const foundSubjects = mockTripleDocument.findSubjects(mockPredicate, mockUnusedObject);
    expect(foundSubjects).toEqual([]);
  });

  it('should return null if no Subject matches the given Predicate', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const foundSubjects = mockTripleDocument.findSubjects(mockUnusedPredicate, mockObject);
    expect(foundSubjects).toEqual([]);
  });
});

describe('addSubject', () => {
  it('should generate a random identifier for a new Subject', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject();
    const identifier = newSubject.asNodeRef().substring(mockTripleDocument.asNodeRef().length);
    expect(identifier.charAt(0)).toBe('#');
    expect(identifier.length).toBeGreaterThan(1);
  });

  it('should use a given identifier', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject({ identifier: 'some-id' });
    expect(newSubject.asNodeRef()).toBe(mockTripleDocument.asNodeRef() + '#some-id');
  });

  it('should use a given prefix for the identifier', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject({ identifierPrefix: 'some-prefix_' });
    const identifier = newSubject.asNodeRef().substring(mockTripleDocument.asNodeRef().length);
    expect(identifier.substring(0, '#some-prefix_'.length)).toBe('#some-prefix_');
    expect(identifier.length).toBeGreaterThan('#some-prefix_'.length);
  });

  it('should use a given prefix before a given identifier', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const newSubject = mockTripleDocument.addSubject({
      identifier: 'some-id',
      identifierPrefix: 'some-prefix_',
    });
    expect(newSubject.asNodeRef()).toBe(mockTripleDocument.asNodeRef() + '#some-prefix_some-id');
  });
});

describe('save', () => {
  it('should allow only saving specific subjects', async () => {
    const mockTripleDocument = await getMockTripleDocument();
    const subjectToSave = mockTripleDocument.addSubject();
    subjectToSave.addLiteral(schema.name, 'Some value to save');
    const subjectNotToSave = mockTripleDocument.addSubject();
    subjectNotToSave.addLiteral(schema.name, 'Some value not to save');

    await mockTripleDocument.save([ subjectToSave ]);

    const deletedTriples = mockUpdater.mock.calls[0][1] as Quad[];
    const savedTriples = mockUpdater.mock.calls[0][2] as Quad[];
    expect(deletedTriples.length).toBe(0);
    expect(savedTriples.length).toBe(1);
    expect(savedTriples[0].subject.value).toBe(subjectToSave.asNodeRef());
    expect(savedTriples[0].predicate.value).toBe(schema.name);
    expect(savedTriples[0].object.value).toBe('Some value to save');
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
    // The Triples to be inserted are the second argument:
    expect((mockCreater.mock.calls[0][1] as Quad[]).length).toBe(1);
    expect((mockCreater.mock.calls[0][1] as Quad[])[0].object.value).toBe('Some value');
  });

  it('should return the ACL if received after creating a new Document', async () => {
    const mockTripleDocument = createDocument(mockDocument);
    const newSubject = mockTripleDocument.addSubject();
    newSubject.addLiteral(schema.name, 'Arbitrary value');
    expect(mockTripleDocument.getAclRef()).toBeNull();

    mockCreater.mockReturnValueOnce(turtlePromise.then(turtle => new Response(turtle, {
      headers: {
        Link: '<https://some-acl-url.example>; rel="acl"',
      },
    })));

    await mockTripleDocument.save();

    expect(mockTripleDocument.getAclRef()).toBe('https://some-acl-url.example/');
  });

  it('should return the WebSocket update URL if received after creating a new Document', async () => {
    const mockTripleDocument = createDocument(mockDocument);
    const newSubject = mockTripleDocument.addSubject();
    newSubject.addLiteral(schema.name, 'Arbitrary value');
    expect(mockTripleDocument.getWebSocketRef()).toBeNull();

    mockCreater.mockReturnValueOnce(turtlePromise.then(turtle => new Response(turtle, {
      headers: {
        'Updates-Via': 'wss://some-websocket-url.com',
      },
    })));

    await mockTripleDocument.save();

    expect(mockTripleDocument.getWebSocketRef()).toBe('wss://some-websocket-url.com');
  });

  it('should call `update` when modifying an existing Document', async () => {
    const mockTripleDocument = await fetchDocument(mockDocument);
    const newSubject = mockTripleDocument.addSubject();
    newSubject.addLiteral(schema.name, 'Some value');

    await mockTripleDocument.save();

    expect(mockUpdater.mock.calls.length).toBe(1);
    expect(mockCreater.mock.calls.length).toBe(0);
    // The Document URL is the first argument
    expect(mockUpdater.mock.calls[0][0]).toBe(mockDocument);
    // The Triples to delete are the first argument:
    expect((mockUpdater.mock.calls[0][1] as Quad[]).length).toBe(0);
    // The Triples to add are the second argument:
    expect((mockUpdater.mock.calls[0][2] as Quad[]).length).toBe(1);
    expect((mockUpdater.mock.calls[0][2] as Quad[])[0].object.value).toBe('Some value');
  });

  it('should not return a new Document that includes Triples that were deleted', async () => {
    const mockTripleDocument = await fetchDocument(mockDocument);
    const newSubject = mockTripleDocument.addSubject();
    newSubject.addLiteral(schema.name, 'Some value');
    newSubject.addLiteral(schema.name, 'Some value that will be removed again');
    newSubject.removeLiteral(schema.name, 'Some value that will be removed again');

    const updatedDocument = await mockTripleDocument.save();

    const savedSubject = updatedDocument.getSubject(newSubject.asRef());
    expect(savedSubject.getAllStrings(schema.name)).toEqual(['Some value']);
  });
});

describe('removeSubject', () => {
  it('should remove all Triples related to the given subject', async () => {
    const mockTripleDocument = await fetchDocument(mockDocument);
    mockTripleDocument.removeSubject(mockSubject);

    await mockTripleDocument.save();

    expect(mockUpdater.mock.calls.length).toBe(1);
    // The Document URL is the first argument
    expect(mockUpdater.mock.calls[0][0]).toBe(mockDocument);
    // The Triples to delete are the second argument:
    expect((mockUpdater.mock.calls[0][1] as Quad[]).length).toBe(1);
    // The Triples to add are the third argument:
    expect((mockUpdater.mock.calls[0][2] as Quad[]).length).toBe(0);

    expect((mockUpdater.mock.calls[0][1] as Quad[])[0].subject.value).toBe(mockSubject);
    expect((mockUpdater.mock.calls[0][1] as Quad[])[0].predicate.value).toBe(mockPredicate);
    expect((mockUpdater.mock.calls[0][1] as Quad[])[0].object.value).toBe(mockObject);
  });
});

describe('getAclRef', () => {
  it('should return null if no ACL header was present', async () => {
    const mockTripleDocument = await fetchDocument(mockDocument);
    expect(mockTripleDocument.getAclRef()).toBeNull();
  });

  it('should return the ACL URL if one was given', async () => {
    mockGetter.mockReturnValueOnce(turtlePromise.then(turtle => new Response(turtle, {
      headers: {
        Link: '<https://mock-acl.com>; rel="acl"; title="Mock ACL", ',
      },
    })));
    const mockTripleDocument = await fetchDocument(mockDocument);
    expect(mockTripleDocument.getAclRef()).toBe('https://mock-acl.com/');
  });

  it('should properly resolve the ACL if its URL is relative', async () => {
    mockGetter.mockReturnValueOnce(turtlePromise.then(turtle => new Response(turtle, {
      headers: {
        Link: '<relative-path.ttl.acl>; rel="acl"; title="Mock ACL", ',
      },
    })));
    const mockTripleDocument = await fetchDocument('https://some-doc.example/relative-path.ttl');
    expect(mockTripleDocument.getAclRef()).toBe('https://some-doc.example/relative-path.ttl.acl');
  });

  it('should return null if more than one ACL was given', async () => {
    mockGetter.mockReturnValueOnce(turtlePromise.then(turtle => new Response(turtle, {
      headers: {
        Link:
          '<https://mock-acl.com>; rel="acl"; title="Mock ACL", ' +
          '<https://mock-acl-2.com>; rel="acl"; title="Mock ACL 2", ',
      },
    })));
    const mockTripleDocument = await fetchDocument(mockDocument);
    expect(mockTripleDocument.getAclRef()).toBeNull();
  });
});

describe('getWebSocketRef', () => {
  it('should return null if no Updates-Via header was present', async () => {
    const mockTripleDocument = await fetchDocument(mockDocument);
    expect(mockTripleDocument.getWebSocketRef()).toBeNull();
  });

  it('should return the WebSocket URL if one was given', async () => {
    mockGetter.mockReturnValueOnce(turtlePromise.then(turtle => new Response(turtle, {
      headers: {
        'Updates-Via': 'wss://some-websocket-url.com',
      },
    })));
    const mockTripleDocument = await fetchDocument(mockDocument);
    expect(mockTripleDocument.getWebSocketRef()).toBe('wss://some-websocket-url.com');
  });
});

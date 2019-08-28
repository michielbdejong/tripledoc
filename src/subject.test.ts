import { graph, st, sym, lit } from 'rdflib';
import {
  initialiseSubject
} from './subject';
import { createDocument } from './document';
import { rdf } from 'rdf-namespaces';

const mockDocument = 'https://document.com/';
const mockSubjectWithLiteralThenNode = 'https://subject1.com/';
const mockSubjectWithNodeThenLiteral = 'https://subject2.com/';
const mockSubjectWithLiteral = 'https://subject3.com/';
const mockSubjectWithNode = 'https://subject4.com/';
const mockSubjectWithTwoLiterals = 'https://subject5.com/';
const mockSubjectWithTwoNodes = 'https://subject6.com/';
const mockTypedSubject = 'https://subject7.com/';
const mockEmptySubject = 'https://empty-subject.com/';
const mockPredicate = 'https://mock-predicate.com/';
const mockObjectNode = 'https://mock-object.com/';
const mockObjectNode2 = 'https://mock-object-2.com/';
const mockDataType = sym('https://data.type/');
const mockLiteralValue = 'Arbitrary literal value';
const mockObjectLiteral = lit(mockLiteralValue, 'en', mockDataType);
const mockLiteralValue2 = 'Another arbitrary literal value';
const mockObjectLiteral2 = lit(mockLiteralValue2, 'en', mockDataType);
const mockTypeObject = 'https://mock-type-object.com/';
const mockStatements = [
  st(sym(mockSubjectWithLiteralThenNode), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithLiteralThenNode), sym(mockPredicate), sym(mockObjectNode), sym(mockDocument)),
  st(sym(mockSubjectWithNodeThenLiteral), sym(mockPredicate), sym(mockObjectNode), sym(mockDocument)),
  st(sym(mockSubjectWithNodeThenLiteral), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithLiteral), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithNode), sym(mockPredicate), sym(mockObjectNode), sym(mockDocument)),
  st(sym(mockSubjectWithTwoLiterals), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithTwoLiterals), sym(mockPredicate), mockObjectLiteral2, sym(mockDocument)),
  st(sym(mockSubjectWithTwoLiterals), sym(mockPredicate), sym(mockObjectNode), sym(mockDocument)),
  st(sym(mockSubjectWithTwoNodes), sym(mockPredicate), sym(mockObjectNode), sym(mockDocument)),
  st(sym(mockSubjectWithTwoNodes), sym(mockPredicate), sym(mockObjectNode2), sym(mockDocument)),
  st(sym(mockSubjectWithTwoNodes), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockTypedSubject), sym(rdf.type), sym(mockTypeObject), sym(mockDocument)),
];
const store = graph();
store.addAll(mockStatements);
jest.mock('./store', () => ({
  getStore: () => store,
}));

function getMockTripleDocument() {
  const mockTripleDocument = createDocument(mockDocument);
  return mockTripleDocument;
}

describe('asNodeRef', () => {
  it('should give access to the IRI that represents this Subject', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    expect(subject.asNodeRef())
      .toBe(mockSubjectWithLiteral);
  });
});

describe('getDocument', () => {
  it('should give access to the Document that contains this Subject', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    expect(subject.getDocument())
      .toEqual(mockTripleDocument);
  });
});

describe('getStatements', () => {
  it('should give access to only the Statements that are relevant to this Subject', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    expect(subject.getStatements())
      .toEqual([st(sym(mockSubjectWithLiteral), sym(mockPredicate), mockObjectLiteral, sym(mockDocument))]);
  });
});

describe('getLiteral', () => {
  it('should return a found Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    expect(subject.getLiteral(mockPredicate))
      .toBe(mockLiteralValue);
  });

  it('should return null if a Node is found instead of a Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    expect(subject.getLiteral(mockPredicate))
      .toBeNull();
  });

  it('should return null if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getLiteral(mockPredicate))
      .toBeNull();
  });

  it('should return the first found value if that is a Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenNode);
    expect(subject.getLiteral(mockPredicate))
      .toBe(mockLiteralValue);
  });

  it('should return the second found value if that is the first Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNodeThenLiteral);
    expect(subject.getLiteral(mockPredicate))
      .toBe(mockLiteralValue);
  });

  it('should only return a single Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithTwoLiterals);
    expect(subject.getLiteral(mockPredicate))
      .toBe(mockLiteralValue);
  });
});

describe('getAllLiterals', () => {
  it('should only return Literals', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithTwoLiterals);
    expect(subject.getAllLiterals(mockPredicate))
      .toEqual([mockLiteralValue, mockLiteralValue2]);
  });

  it('should return an empty array if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getAllLiterals(mockPredicate))
      .toEqual([]);
  });
});

describe('getNodeRef', () => {
  it('should return a found Node reference', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    expect(subject.getNodeRef(mockPredicate))
      .toEqual(mockObjectNode);
  });

  it('should return null if a Node is found instead of a Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    expect(subject.getNodeRef(mockPredicate))
      .toBeNull();
  });

  it('should return null if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getNodeRef(mockPredicate))
      .toBeNull();
  });

  it('should return the first found value if that is a Node', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNodeThenLiteral);
    expect(subject.getNodeRef(mockPredicate))
      .toBe(mockObjectNode);
  });

  it('should return the second found value if that is the first Node', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenNode);
    expect(subject.getNodeRef(mockPredicate))
      .toBe(mockObjectNode);
  });

  it('should only return a single Node', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithTwoNodes);
    expect(subject.getNodeRef(mockPredicate))
      .toBe(mockObjectNode);
  });
});

describe('getType', () => {
  it('should return a Subject\'s type', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockTypedSubject);
    expect(subject.getType()).toEqual(mockTypeObject);
  });

  it('should return null if no type was defined', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getType()).toBeNull();
  });
});

describe('getAllNodeRefs', () => {
  it('should only return Nodes', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithTwoNodes);
    expect(subject.getAllNodeRefs(mockPredicate))
      .toEqual([mockObjectNode, mockObjectNode2]);
  });

  it('should return an empty array if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getAllNodeRefs(mockPredicate))
      .toEqual([]);
  });
});

describe('addLiteral', () => {
  it('should produce Statements that the Document can store in the user\'s Pod', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    subject.addLiteral(mockPredicate, 'Some literal value');
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([]);
    expect(pendingAdditions.length).toBe(1);
    expect(pendingAdditions[0].object.value).toBe('Some literal value');
  });
});

describe('addNodeRef', () => {
  it('should produce Statements that the Document can store in the user\'s Pod', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    subject.addNodeRef(mockPredicate, mockObjectNode2);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([]);
    expect(pendingAdditions)
      .toEqual([st(
        sym(mockSubjectWithNode),
        sym(mockPredicate),
        sym(mockObjectNode2),
        sym(mockTripleDocument.asNodeRef()),
      )]);
  });
});

describe('The callback handler for when the Document saves this Subject', () => {
  it('should clear pending Statements', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    subject.addLiteral(mockPredicate, 'Some literal value');
    subject.addNodeRef(mockPredicate, mockObjectNode2);
    const [_pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions.length).toBe(2);
    subject.onSave();

    const [_pendingDeletionsAfterSave, pendingAdditionsAfterSave] = subject.getPendingStatements();
    expect(pendingAdditionsAfterSave.length).toBe(0);
  });
});

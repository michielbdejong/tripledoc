import { graph, st, sym, lit, Literal } from 'rdflib';
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
const mockSubjectWithDateLiteral = 'https://subject7.com/';
const mockSubjectWithIntegerLiteral = 'https://subject8.com/';
const mockSubjectWithDecimalLiteral = 'https://subject9.com/';
const mockSubjectWithDifferentTypesOfLiterals = 'https://subject10.com/';
const mockTypedSubject = 'https://subject7.com/';
const mockEmptySubject = 'https://empty-subject.com/';
const mockPredicate = 'https://mock-predicate.com/';
const mockObjectNode = 'https://mock-object.com/';
const mockObjectNode2 = 'https://mock-object-2.com/';
const mockLiteralValue = 'Arbitrary literal value';
const mockObjectLiteral = lit(mockLiteralValue, null as any, null as any);
const mockLiteralValue2 = 'Another arbitrary literal value';
const mockObjectLiteral2 = lit(mockLiteralValue2, undefined as any, undefined as any);
const mockLiteralDateTime = new Date(0);
const mockObjectDateTimeLiteral = Literal.fromDate(mockLiteralDateTime);
const mockLiteralInteger = 1337;
const mockObjectIntegerLiteral = Literal.fromNumber(mockLiteralInteger);
const mockLiteralDecimal = 4.2;
const mockObjectDecimalLiteral = Literal.fromNumber(mockLiteralDecimal);
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
  st(sym(mockSubjectWithDateLiteral), sym(mockPredicate), mockObjectDateTimeLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDecimalLiteral), sym(mockPredicate), mockObjectDecimalLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithIntegerLiteral), sym(mockPredicate), mockObjectIntegerLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectLiteral2, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectDateTimeLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectDecimalLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectIntegerLiteral, sym(mockDocument)),
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

  it('should return a found Integer Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithIntegerLiteral);
    expect(typeof subject.getLiteral(mockPredicate)).toBe('number');
    expect((subject.getLiteral(mockPredicate))).toBe(mockLiteralInteger);
  });

  it('should return a found Decimal Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDecimalLiteral);
    expect(typeof subject.getLiteral(mockPredicate)).toBe('number');
    expect((subject.getLiteral(mockPredicate))).toBe(mockLiteralDecimal);
  });

  it('should return a found Date Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDateLiteral);
    expect(subject.getLiteral(mockPredicate)).toBeInstanceOf(Date);
    expect((subject.getLiteral(mockPredicate) as Date).getTime())
      .toEqual(mockLiteralDateTime.getTime());
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

describe('getString', () => {
  it('should return a found string Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentTypesOfLiterals);
    expect(subject.getString(mockPredicate))
      .toBe(mockLiteralValue);
  });


  it('should return null if a Node is found instead of a string Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    expect(subject.getString(mockPredicate))
      .toBeNull();
  });

  it('should return null if a non-string Literal is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDateLiteral);
    expect(subject.getString(mockPredicate))
      .toBeNull();
  });
});

describe('getInteger', () => {
  it('should return a found integer Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentTypesOfLiterals);
    expect(subject.getInteger(mockPredicate))
      .toBe(mockLiteralInteger);
  });


  it('should return null if a Node is found instead of a integer Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    expect(subject.getInteger(mockPredicate))
      .toBeNull();
  });

  it('should return null if a non-integer Literal is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDateLiteral);
    expect(subject.getString(mockPredicate))
      .toBeNull();
  });
});

describe('getDecimal', () => {
  it('should return a found decimal Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentTypesOfLiterals);
    expect(subject.getDecimal(mockPredicate))
      .toBe(mockLiteralDecimal);
  });


  it('should return null if a Node is found instead of a decimal Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    expect(subject.getDecimal(mockPredicate))
      .toBeNull();
  });

  it('should return null if a non-decimal Literal is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDateLiteral);
    expect(subject.getDecimal(mockPredicate))
      .toBeNull();
  });
});

describe('getDate', () => {
  it('should return a found Date Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentTypesOfLiterals);
    expect(subject.getDateTime(mockPredicate))
      .toEqual(mockLiteralDateTime);
  });


  it('should return null if a Node is found instead of a Date Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    expect(subject.getDateTime(mockPredicate))
      .toBeNull();
  });

  it('should return null if a non-Date Literal is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDecimalLiteral);
    expect(subject.getDateTime(mockPredicate))
      .toBeNull();
  });
});

describe('getAllStrings', () => {
  it('should only return string Literals', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentTypesOfLiterals);
    expect(subject.getAllStrings(mockPredicate))
      .toEqual([mockLiteralValue, mockLiteralValue2]);
  });

  it('should return an empty array if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getAllStrings(mockPredicate))
      .toEqual([]);
  });
});

describe('getAllIntegers', () => {
  it('should only return integer Literals', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentTypesOfLiterals);
    expect(subject.getAllIntegers(mockPredicate))
      .toEqual([mockLiteralInteger]);
  });

  it('should return an empty array if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getAllIntegers(mockPredicate))
      .toEqual([]);
  });
});

describe('getAllDecimals', () => {
  it('should only return decimal Literals', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentTypesOfLiterals);
    expect(subject.getAllDecimals(mockPredicate))
      .toEqual([mockLiteralDecimal]);
  });

  it('should return an empty array if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getAllDecimals(mockPredicate))
      .toEqual([]);
  });
});

describe('getAllDateTimes', () => {
  it('should only return DateTime Literals', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentTypesOfLiterals);
    expect(subject.getAllDateTimes(mockPredicate))
      .toEqual([mockLiteralDateTime]);
  });

  it('should return an empty array if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getAllDateTimes(mockPredicate))
      .toEqual([]);
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
    expect(pendingAdditions[0].object.termType).toBe('Literal');
    expect(pendingAdditions[0].object.value).toBe('Some literal value');
  });

  it('should properly represent an integer, if given', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    const someInteger = 1337;
    subject.addLiteral(mockPredicate, someInteger);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([]);
    expect(pendingAdditions.length).toBe(1);
    expect(pendingAdditions[0].object.termType).toBe('Literal');
    expect((pendingAdditions[0].object as Literal).datatype.uri)
      .toBe('http://www.w3.org/2001/XMLSchema#integer');
    expect(pendingAdditions[0].object.value).toBe('1337');
  });

  it('should properly represent a decimal, if given', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    const someDecimal = 4.2;
    subject.addLiteral(mockPredicate, someDecimal);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([]);
    expect(pendingAdditions.length).toBe(1);
    expect(pendingAdditions[0].object.termType).toBe('Literal');
    expect((pendingAdditions[0].object as Literal).datatype.uri)
      .toBe('http://www.w3.org/2001/XMLSchema#decimal');
    expect(pendingAdditions[0].object.value).toBe('4.2');
  });

  it('should properly represent a Date, if given', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    const someDate = new Date(71697398400000);
    subject.addLiteral(mockPredicate, someDate);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([]);
    expect(pendingAdditions.length).toBe(1);
    expect(pendingAdditions[0].object.termType).toBe('Literal');
    expect((pendingAdditions[0].object as Literal).datatype.uri)
      .toBe('http://www.w3.org/2001/XMLSchema#dateTime');
    expect(pendingAdditions[0].object.value).toBe('4242-01-01T00:00:00Z');
  });
});

describe('removeLiteral', () => {
  it('should produce Statements that the Document can apply to the user\'s Pod', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithTwoLiterals);
    subject.removeLiteral(mockPredicate, mockLiteralValue2);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions.length).toBe(1);
    expect(pendingDeletions[0].object.termType).toBe('Literal');
    expect(pendingDeletions[0].object.value).toBe(mockLiteralValue2);
  });

  it('should properly remove an integer, if given', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithIntegerLiteral);
    subject.removeLiteral(mockPredicate, mockLiteralInteger);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions.length).toBe(1);
    expect(pendingDeletions[0].object.termType).toBe('Literal');
    expect((pendingDeletions[0].object as Literal).datatype.uri)
      .toBe('http://www.w3.org/2001/XMLSchema#integer');
    expect(pendingDeletions[0].object.value).toBe(mockLiteralInteger.toString());
  });

  it('should properly remove a decimal, if given', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDecimalLiteral);
    subject.removeLiteral(mockPredicate, mockLiteralDecimal);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions.length).toBe(1);
    expect(pendingDeletions[0].object.termType).toBe('Literal');
    expect((pendingDeletions[0].object as Literal).datatype.uri)
      .toBe('http://www.w3.org/2001/XMLSchema#decimal');
    expect(pendingDeletions[0].object.value).toBe(mockLiteralDecimal.toString());
  });

  it('should properly remove a Date, if given', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDateLiteral);
    subject.removeLiteral(mockPredicate, mockLiteralDateTime);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions.length).toBe(1);
    expect(pendingDeletions[0].object.termType).toBe('Literal');
    expect((pendingDeletions[0].object as Literal).datatype.uri)
      .toBe('http://www.w3.org/2001/XMLSchema#dateTime');
    expect(pendingDeletions[0].object.value).toBe(Literal.fromDate(mockLiteralDateTime).value);
  });
});

describe('setLiteral', () => {
  it('should remove all existing values, whether Literal or NodeRef', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenNode);
    subject.setLiteral(mockPredicate, mockLiteralValue2);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([
      st(
        sym(mockSubjectWithLiteralThenNode),
        sym(mockPredicate),
        mockObjectLiteral,
        sym(mockTripleDocument.asNodeRef()),
      ),
      st(
        sym(mockSubjectWithLiteralThenNode),
        sym(mockPredicate),
        sym(mockObjectNode),
        sym(mockTripleDocument.asNodeRef()),
      ),
    ]);
    expect(pendingAdditions.length).toBe(1);
    expect(pendingAdditions[0].object.termType).toBe('Literal');
    expect(pendingAdditions[0].object.value).toBe(mockLiteralValue2);
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

describe('removeNodeRef', () => {
  it('should produce Statements that the Document can apply to the user\'s Pod', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithNode);
    subject.removeNodeRef(mockPredicate, mockObjectNode);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions)
      .toEqual([st(
        sym(mockSubjectWithNode),
        sym(mockPredicate),
        sym(mockObjectNode),
        sym(mockTripleDocument.asNodeRef()),
      )]);
  });
});

describe('setNodeRef', () => {
  it('should remove all existing values, whether Literal or NodeRef', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenNode);
    subject.setNodeRef(mockPredicate, mockObjectNode2);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([
      st(
        sym(mockSubjectWithLiteralThenNode),
        sym(mockPredicate),
        mockObjectLiteral,
        sym(mockTripleDocument.asNodeRef()),
      ),
      st(
        sym(mockSubjectWithLiteralThenNode),
        sym(mockPredicate),
        sym(mockObjectNode),
        sym(mockTripleDocument.asNodeRef()),
      ),
    ]);
    expect(pendingAdditions)
      .toEqual([st(
        sym(mockSubjectWithLiteralThenNode),
        sym(mockPredicate),
        sym(mockObjectNode2),
        sym(mockTripleDocument.asNodeRef()),
      )]);
  });
});

describe('removeAll', () => {
  it('should remove all existing values, whether Literal or NodeRef', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenNode);
    subject.removeAll(mockPredicate);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions).toEqual([
      st(
        sym(mockSubjectWithLiteralThenNode),
        sym(mockPredicate),
        mockObjectLiteral,
        sym(mockTripleDocument.asNodeRef()),
      ),
      st(
        sym(mockSubjectWithLiteralThenNode),
        sym(mockPredicate),
        sym(mockObjectNode),
        sym(mockTripleDocument.asNodeRef()),
      ),
    ]);
  });
});

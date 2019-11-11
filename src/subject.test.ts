import { graph, st, sym, lit, Literal, BlankNode } from 'rdflib';
import {
  initialiseSubject, TripleSubject
} from './subject';
import { createDocument } from './document';
import { rdf } from 'rdf-namespaces';

const mockDocument = 'https://document.com/';
const mockSubjectWithLiteralThenRef = 'https://subject1.com/';
const mockSubjectWithRefThenLiteral = 'https://subject2.com/';
const mockSubjectWithBlankNodeThenRef = 'https://document.com/#blank-node-then-ref';
const mockSubjectWithRefThenBlankNode = 'https://document.com/#ref-then-blank-node';
const mockSubjectWithLiteral = 'https://subject3.com/';
const mockSubjectWithRef = 'https://subject4.com/';
const mockSubjectWithTwoLiterals = 'https://subject5.com/';
const mockSubjectWithTwoRefs = 'https://subject6.com/';
const mockSubjectWithDateLiteral = 'https://subject7.com/';
const mockSubjectWithIntegerLiteral = 'https://subject8.com/';
const mockSubjectWithDecimalLiteral = 'https://subject9.com/';
const mockSubjectWithDifferentTypesOfLiterals = 'https://subject10.com/';
const mockSubjectWithDifferentPredicates = 'https://subject11.com/';
const mockTypedSubject = 'https://subject7.com/';
const mockEmptySubject = 'https://empty-subject.com/';
const mockPredicate = 'https://mock-predicate.com/';
const mockPredicate2 = 'https://mock-predicate-2.com/';
const mockObjectRef = 'https://mock-object.com/';
const mockObjectRef2 = 'https://mock-object-2.com/';
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
const mockBlankNode = 'arbitrary-blank-node-id';
const mockStatements = [
  st(sym(mockSubjectWithLiteralThenRef), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithLiteralThenRef), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithRefThenLiteral), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithRefThenLiteral), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithBlankNodeThenRef), sym(mockPredicate), new BlankNode(mockBlankNode), sym(mockDocument)),
  st(sym(mockSubjectWithBlankNodeThenRef), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithRefThenBlankNode), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithRefThenBlankNode), sym(mockPredicate), new BlankNode(mockBlankNode), sym(mockDocument)),
  st(new BlankNode(mockBlankNode), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithLiteral), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithRef), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithTwoLiterals), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithTwoLiterals), sym(mockPredicate), mockObjectLiteral2, sym(mockDocument)),
  st(sym(mockSubjectWithTwoLiterals), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithTwoRefs), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithTwoRefs), sym(mockPredicate), sym(mockObjectRef2), sym(mockDocument)),
  st(sym(mockSubjectWithTwoRefs), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockTypedSubject), sym(rdf.type), sym(mockTypeObject), sym(mockDocument)),
  st(sym(mockSubjectWithDateLiteral), sym(mockPredicate), mockObjectDateTimeLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDecimalLiteral), sym(mockPredicate), mockObjectDecimalLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithIntegerLiteral), sym(mockPredicate), mockObjectIntegerLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectLiteral2, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectDateTimeLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectDecimalLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentTypesOfLiterals), sym(mockPredicate), mockObjectIntegerLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentPredicates), sym(mockPredicate), mockObjectLiteral, sym(mockDocument)),
  st(sym(mockSubjectWithDifferentPredicates), sym(mockPredicate), sym(mockObjectRef), sym(mockDocument)),
  st(sym(mockSubjectWithDifferentPredicates), sym(mockPredicate2), sym(mockObjectRef2), sym(mockDocument)),
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

describe('asRef', () => {
  it('should give access to the IRI that represents this Subject', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    expect(subject.asRef())
      .toBe(mockSubjectWithLiteral);
  });

  it('should give access to the local ID for a Subject if it is a local Subject (i.e. a Blank Node)', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, new BlankNode(mockBlankNode));
    expect(subject.asRef())
      .toBe(mockBlankNode);
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

  it('should return null if a Reference is found instead of a Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
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
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenRef);
    expect(subject.getLiteral(mockPredicate))
      .toBe(mockLiteralValue);
  });

  it('should return the second found value if that is the first Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRefThenLiteral);
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


  it('should return null if a Reference is found instead of a string Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
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


  it('should return null if a Reference is found instead of a integer Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
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


  it('should return null if a Reference is found instead of a decimal Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
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


  it('should return null if a Reference is found instead of a Date Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
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

describe('getLocalSubject', () => {
  it('should return a new TripleSubject representing a local Subject', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithBlankNodeThenRef);
    const localSubject = subject.getLocalSubject(mockPredicate);
    expect(localSubject).not.toBeNull();
    expect((localSubject as TripleSubject).getRef(mockPredicate))
      .toEqual(mockObjectRef);
  });

  it('should return null if a Reference is found instead of a local Subject', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
    expect(subject.getLocalSubject(mockPredicate))
      .toBeNull();
  });

  it('should return a new TripleSubject representing a local Subject, even if a Reference also matches the predicate', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRefThenBlankNode);
    const localSubject = subject.getLocalSubject(mockPredicate);
    expect(localSubject).not.toBeNull();
    expect((localSubject as TripleSubject).getRef(mockPredicate))
      .toEqual(mockObjectRef);
  });

});

describe('getAllLocalSubjects', () => {
  it('should only return local Subjects (i.e. those with a Blank Node)', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRefThenBlankNode);

    const localSubjects = subject.getAllLocalSubjects(mockPredicate);

    expect(localSubjects.length)
      .toBe(1);
    expect(localSubjects[0].getRef(mockPredicate))
      .toEqual(mockObjectRef);
  });

  it('should return an empty array if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getAllLocalSubjects(mockPredicate))
      .toEqual([]);
  });
});

describe('getRef', () => {
  it('should return a found Reference', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
    expect(subject.getRef(mockPredicate))
      .toEqual(mockObjectRef);
  });

  it('should return null if a Reference is found instead of a Literal', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteral);
    expect(subject.getRef(mockPredicate))
      .toBeNull();
  });

  it('should return null if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getRef(mockPredicate))
      .toBeNull();
  });

  it('should return the first found value if that is a Reference', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRefThenLiteral);
    expect(subject.getRef(mockPredicate))
      .toBe(mockObjectRef);
  });

  it('should return the second found value if that is the first Reference', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenRef);
    expect(subject.getRef(mockPredicate))
      .toBe(mockObjectRef);
  });

  it('should only return a single Reference', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithTwoRefs);
    expect(subject.getRef(mockPredicate))
      .toBe(mockObjectRef);
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

describe('getAllRefs', () => {
  it('should only return References', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithTwoRefs);
    expect(subject.getAllRefs(mockPredicate))
      .toEqual([mockObjectRef, mockObjectRef2]);
  });

  it('should return an empty array if nothing is found', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockEmptySubject);
    expect(subject.getAllRefs(mockPredicate))
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
  it('should remove all existing values, whether Literal or Reference', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenRef);
    subject.setLiteral(mockPredicate, mockLiteralValue2);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([
      st(
        sym(mockSubjectWithLiteralThenRef),
        sym(mockPredicate),
        mockObjectLiteral,
        sym(mockTripleDocument.asRef()),
      ),
      st(
        sym(mockSubjectWithLiteralThenRef),
        sym(mockPredicate),
        sym(mockObjectRef),
        sym(mockTripleDocument.asRef()),
      ),
    ]);
    expect(pendingAdditions.length).toBe(1);
    expect(pendingAdditions[0].object.termType).toBe('Literal');
    expect(pendingAdditions[0].object.value).toBe(mockLiteralValue2);
  });
});

describe('addRef', () => {
  it('should produce Statements that the Document can store in the user\'s Pod', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
    subject.addRef(mockPredicate, mockObjectRef2);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([]);
    expect(pendingAdditions)
      .toEqual([st(
        sym(mockSubjectWithRef),
        sym(mockPredicate),
        sym(mockObjectRef2),
        sym(mockTripleDocument.asRef()),
      )]);
  });
});

describe('removeRef', () => {
  it('should produce Statements that the Document can apply to the user\'s Pod', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithRef);
    subject.removeRef(mockPredicate, mockObjectRef);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions)
      .toEqual([st(
        sym(mockSubjectWithRef),
        sym(mockPredicate),
        sym(mockObjectRef),
        sym(mockTripleDocument.asRef()),
      )]);
  });
});

describe('setRef', () => {
  it('should remove all existing values, whether Literal or Ref', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenRef);
    subject.setRef(mockPredicate, mockObjectRef2);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingDeletions).toEqual([
      st(
        sym(mockSubjectWithLiteralThenRef),
        sym(mockPredicate),
        mockObjectLiteral,
        sym(mockTripleDocument.asRef()),
      ),
      st(
        sym(mockSubjectWithLiteralThenRef),
        sym(mockPredicate),
        sym(mockObjectRef),
        sym(mockTripleDocument.asRef()),
      ),
    ]);
    expect(pendingAdditions)
      .toEqual([st(
        sym(mockSubjectWithLiteralThenRef),
        sym(mockPredicate),
        sym(mockObjectRef2),
        sym(mockTripleDocument.asRef()),
      )]);
  });
});

describe('removeAll', () => {
  it('should remove all existing values, whether Literal or Reference', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithLiteralThenRef);
    subject.removeAll(mockPredicate);
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions).toEqual([
      st(
        sym(mockSubjectWithLiteralThenRef),
        sym(mockPredicate),
        mockObjectLiteral,
        sym(mockTripleDocument.asRef()),
      ),
      st(
        sym(mockSubjectWithLiteralThenRef),
        sym(mockPredicate),
        sym(mockObjectRef),
        sym(mockTripleDocument.asRef()),
      ),
    ]);
  });
});

describe('clear', () => {
  it('should remove all existing values, whether Literal or Reference, regardless of the predicate', () => {
    const mockTripleDocument = getMockTripleDocument();
    const subject = initialiseSubject(mockTripleDocument, mockSubjectWithDifferentPredicates);
    subject.clear();
    const [pendingDeletions, pendingAdditions] = subject.getPendingStatements();
    expect(pendingAdditions).toEqual([]);
    expect(pendingDeletions).toEqual([
      st(
        sym(mockSubjectWithDifferentPredicates),
        sym(mockPredicate),
        mockObjectLiteral,
        sym(mockTripleDocument.asRef()),
      ),
      st(
        sym(mockSubjectWithDifferentPredicates),
        sym(mockPredicate),
        sym(mockObjectRef),
        sym(mockTripleDocument.asRef()),
      ),
      st(
        sym(mockSubjectWithDifferentPredicates),
        sym(mockPredicate2),
        sym(mockObjectRef2),
        sym(mockTripleDocument.asRef()),
      ),
    ]);
  });
});

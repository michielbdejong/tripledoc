import { graph, st, sym } from 'rdflib';
import {
  findSubjectInStatements,
  findSubjectsInStatements,
  findPredicateInStatements,
  findPredicatesInStatements,
  findObjectInStatements,
  findObjectsInStatements,
} from './getEntities';

const mockDocument = 'https://document.com';
const unusedSubject = 'https://unused-subject.com';
const mockSubject1 = 'https://subject1.com';
const mockSubject2 = 'https://subject2.com';
const unusedPredicate = 'https://unused-predicate.com';
const mockPredicate1 = 'https://predicate1.com';
const mockPredicate2 = 'https://predicate2.com';
const unusedObject = 'https://unused-object.com';
const mockObject1 = 'https://object1.com';
const mockObject2 = 'https://object2.com';
function getMockStatements() {
  const statements = [
    st(sym(mockSubject1), sym(mockPredicate1), sym(mockObject1), sym(mockDocument)),
    st(sym(mockSubject1), sym(mockPredicate1), sym(mockObject2), sym(mockDocument)),
    st(sym(mockSubject1), sym(mockPredicate2), sym(mockObject1), sym(mockDocument)),
    st(sym(mockSubject1), sym(mockPredicate2), sym(mockObject2), sym(mockDocument)),
    st(sym(mockSubject2), sym(mockPredicate1), sym(mockObject1), sym(mockDocument)),
    st(sym(mockSubject2), sym(mockPredicate1), sym(mockObject2), sym(mockDocument)),
    st(sym(mockSubject2), sym(mockPredicate2), sym(mockObject1), sym(mockDocument)),
    st(sym(mockSubject2), sym(mockPredicate2), sym(mockObject2), sym(mockDocument)),
  ];
  return statements;
}

describe('findSubjectInStatements', () => {
  it('should retrieve the first subject matching a specific predicate and object', () => {
    const mockStore = getMockStatements();
    expect(findSubjectInStatements(mockStore, mockPredicate1, mockObject2, mockDocument))
    .toEqual(mockSubject1);
  });

  it('should return null if no subject could be found', () => {
    const mockStore = getMockStatements();
    expect(findSubjectInStatements(mockStore, unusedPredicate, unusedObject, mockDocument))
    .toBeNull();
  });
});

describe('findSubjectsInStatements', () => {
  it('should retrieve all subjects matching a specific predicate and object', () => {
    const mockStore = getMockStatements();
    expect(findSubjectsInStatements(mockStore, mockPredicate1, mockObject2, mockDocument))
    .toEqual([mockSubject1, mockSubject2]);
  });

  it('should return an empty array if no subjects could be found', () => {
    const mockStore = getMockStatements();
    expect(findSubjectsInStatements(mockStore, unusedPredicate, unusedObject, mockDocument))
    .toEqual([]);
  });
});

describe('findPredicateInStatements', () => {
  it('should retrieve the first predicate matching a specific subject and object', () => {
    const mockStore = getMockStatements();
    expect(findPredicateInStatements(mockStore, mockSubject1, mockObject2, mockDocument))
    .toEqual(mockPredicate1);
  });

  it('should return null if no predicate could be found', () => {
    const mockStore = getMockStatements();
    expect(findPredicateInStatements(mockStore, unusedSubject, unusedObject, mockDocument))
    .toBeNull();
  });
});

describe('findPredicatesInStatements', () => {
  it('should retrieve all predicates matching a specific subject and object', () => {
    const mockStore = getMockStatements();
    expect(findPredicatesInStatements(mockStore, mockSubject1, mockObject2, mockDocument))
    .toEqual([mockPredicate1, mockPredicate2]);
  });

  it('should return an empty array if no predicates could be found', () => {
    const mockStore = getMockStatements();
    expect(findPredicatesInStatements(mockStore, unusedSubject, unusedObject, mockDocument))
    .toEqual([]);
  });
});

describe('findObjectInStatements', () => {
  it('should retrieve the first object matching a specific subject and predicate', () => {
    const mockStore = getMockStatements();
    expect(findObjectInStatements(mockStore, mockSubject1, mockPredicate1, mockDocument))
    .toEqual(mockObject1);
  });

  it('should return null if no object could be found', () => {
    const mockStore = getMockStatements();
    expect(findObjectInStatements(mockStore, unusedSubject, unusedPredicate, mockDocument))
    .toBeNull();
  });
});

describe('findObjectsInStatements', () => {
  it('should retrieve all objects matching a specific subject and predicate', () => {
    const mockStore = getMockStatements();
    expect(findObjectsInStatements(mockStore, mockSubject1, mockPredicate1, mockDocument))
    .toEqual([mockObject1, mockObject2]);
  });

  it('should return an empty array if no objects could be found', () => {
    const mockStore = getMockStatements();
    expect(findObjectsInStatements(mockStore, unusedSubject, unusedPredicate, mockDocument))
    .toEqual([]);
  });
});

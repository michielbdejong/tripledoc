import { graph, st, sym } from 'rdflib';
import {
  findSubjectsInStore,
  findSubjectInStore,
  findPredicateInStore,
  findPredicatesInStore,
  findObjectInStore,
  findObjectsInStore,
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
function getMockStore() {
  const store = graph();
  store.addAll([
    st(sym(mockSubject1), sym(mockPredicate1), sym(mockObject1), sym(mockDocument)),
    st(sym(mockSubject1), sym(mockPredicate1), sym(mockObject2), sym(mockDocument)),
    st(sym(mockSubject1), sym(mockPredicate2), sym(mockObject1), sym(mockDocument)),
    st(sym(mockSubject1), sym(mockPredicate2), sym(mockObject2), sym(mockDocument)),
    st(sym(mockSubject2), sym(mockPredicate1), sym(mockObject1), sym(mockDocument)),
    st(sym(mockSubject2), sym(mockPredicate1), sym(mockObject2), sym(mockDocument)),
    st(sym(mockSubject2), sym(mockPredicate2), sym(mockObject1), sym(mockDocument)),
    st(sym(mockSubject2), sym(mockPredicate2), sym(mockObject2), sym(mockDocument)),
  ]);
  return store;
}

describe('findSubjectInStore', () => {
  it('should retrieve the first subject matching a specific predicate and object', () => {
    const mockStore = getMockStore();
    expect(findSubjectInStore(mockStore, mockPredicate1, mockObject2, mockDocument))
    .toEqual(mockSubject1);
  });

  it('should return null if no subject could be found', () => {
    const mockStore = getMockStore();
    expect(findSubjectInStore(mockStore, unusedPredicate, unusedObject, mockDocument))
    .toBeNull();
  });
});

describe('findSubjectsInStore', () => {
  it('should retrieve all subjects matching a specific predicate and object', () => {
    const mockStore = getMockStore();
    expect(findSubjectsInStore(mockStore, mockPredicate1, mockObject2, mockDocument))
    .toEqual([mockSubject1, mockSubject2]);
  });

  it('should return an empty array if no subjects could be found', () => {
    const mockStore = getMockStore();
    expect(findSubjectsInStore(mockStore, unusedPredicate, unusedObject, mockDocument))
    .toEqual([]);
  });
});

describe('findPredicateInStore', () => {
  it('should retrieve the first predicate matching a specific subject and object', () => {
    const mockStore = getMockStore();
    expect(findPredicateInStore(mockStore, mockSubject1, mockObject2, mockDocument))
    .toEqual(mockPredicate1);
  });

  it('should return null if no predicate could be found', () => {
    const mockStore = getMockStore();
    expect(findPredicateInStore(mockStore, unusedSubject, unusedObject, mockDocument))
    .toBeNull();
  });
});

describe('findPredicatesInStore', () => {
  it('should retrieve all predicates matching a specific subject and object', () => {
    const mockStore = getMockStore();
    expect(findPredicatesInStore(mockStore, mockSubject1, mockObject2, mockDocument))
    .toEqual([mockPredicate1, mockPredicate2]);
  });

  it('should return an empty array if no predicates could be found', () => {
    const mockStore = getMockStore();
    expect(findPredicatesInStore(mockStore, unusedSubject, unusedObject, mockDocument))
    .toEqual([]);
  });
});

describe('findObjectInStore', () => {
  it('should retrieve the first object matching a specific subject and predicate', () => {
    const mockStore = getMockStore();
    expect(findObjectInStore(mockStore, mockSubject1, mockPredicate1, mockDocument))
    .toEqual(mockObject1);
  });

  it('should return null if no object could be found', () => {
    const mockStore = getMockStore();
    expect(findObjectInStore(mockStore, unusedSubject, unusedPredicate, mockDocument))
    .toBeNull();
  });
});

describe('findObjectsInStore', () => {
  it('should retrieve all objects matching a specific subject and predicate', () => {
    const mockStore = getMockStore();
    expect(findObjectsInStore(mockStore, mockSubject1, mockPredicate1, mockDocument))
    .toEqual([mockObject1, mockObject2]);
  });

  it('should return an empty array if no objects could be found', () => {
    const mockStore = getMockStore();
    expect(findObjectsInStore(mockStore, unusedSubject, unusedPredicate, mockDocument))
    .toEqual([]);
  });
});

import { DataFactory, Store } from 'n3';
import {
  findSubjectInStore,
  findSubjectsInStore,
  findPredicateInStore,
  findPredicatesInStore,
  findObjectInStore,
  findObjectsInStore,
} from './getEntities';

const { quad, namedNode, blankNode } = DataFactory;

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
const mockBlankNode = blankNode('mock_blank_node');
const mockSubjectWithBlankNode = 'https://subject-with-blank-node.com';
const mockObjectForBlankNode = 'https://object-for-blank-node.com';
function getMockStore() {
  const triples = [
    quad(namedNode(mockSubject1), namedNode(mockPredicate1), namedNode(mockObject1), namedNode(mockDocument)),
    quad(namedNode(mockSubject1), namedNode(mockPredicate1), namedNode(mockObject2), namedNode(mockDocument)),
    quad(namedNode(mockSubject1), namedNode(mockPredicate2), namedNode(mockObject1), namedNode(mockDocument)),
    quad(namedNode(mockSubject1), namedNode(mockPredicate2), namedNode(mockObject2), namedNode(mockDocument)),
    quad(namedNode(mockSubject2), namedNode(mockPredicate1), namedNode(mockObject1), namedNode(mockDocument)),
    quad(namedNode(mockSubject2), namedNode(mockPredicate1), namedNode(mockObject2), namedNode(mockDocument)),
    quad(namedNode(mockSubject2), namedNode(mockPredicate2), namedNode(mockObject1), namedNode(mockDocument)),
    quad(namedNode(mockSubject2), namedNode(mockPredicate2), namedNode(mockObject2), namedNode(mockDocument)),
    quad(namedNode(mockSubjectWithBlankNode), namedNode(mockPredicate1), mockBlankNode, namedNode(mockDocument)),
    quad(mockBlankNode, namedNode(mockPredicate1), namedNode(mockObjectForBlankNode), namedNode(mockDocument)),
  ];
  const store = new Store();
  store.addQuads(triples);
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

  it('should be able to return blank nodes', () => {
    const mockStore = getMockStore();
    expect(findSubjectsInStore(mockStore, mockPredicate1, mockObjectForBlankNode, mockDocument))
    .toEqual([mockBlankNode]);
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

  it('should be able to return blank nodes', () => {
    const mockStore = getMockStore();
    expect(findObjectInStore(mockStore, mockSubjectWithBlankNode, mockPredicate1, mockDocument))
      .toEqual(mockBlankNode);
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

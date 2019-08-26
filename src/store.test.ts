import { getFetcher, getStore, getUpdater } from './store';

describe('getFetcher', () => {
  it('should return the same instance of a Fetcher every time', () => {
    const fetcher1 = getFetcher();
    const fetcher2 = getFetcher();
    expect(fetcher1).toEqual(fetcher2);
  });
});

describe('getStore', () => {
  it('should return the same instance of a Fetcher every time', () => {
    const store1 = getStore();
    const store2 = getStore();
    expect(store1).toEqual(store2);
  });
});

describe('getUpdater', () => {
  it('should return the same instance of a Fetcher every time', () => {
    const updater1 = getUpdater();
    const updater2 = getUpdater();
    expect(updater1).toEqual(updater2);
  });
});

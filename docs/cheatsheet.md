---
id: cheatsheet
title: Cheatsheet
---

## Reading a single value for a property

### Tripledoc

```javascript
import { fetchDocument } from "tripledoc";

async function getName(webId) {
  const profileDoc = await fetchDocument(webId);
  const profile = profileDoc.getSubject(webId);
  return profile.getString('http://xmlns.com/foaf/0.1/name');
}
```

https://codesandbox.io/s/goofy-darwin-shvq5?fontsize=14

### rdflib

```javascript
import { graph, Fetcher, sym } from "rdflib";

async function getName(webId) {
  const store = graph();
  const fetcher = new Fetcher(store, {});
  await fetcher.load(webId);
  const me = sym(webId);
  const name = store.any(me, sym('http://xmlns.com/foaf/0.1/name'), null, me.doc());
  return (name && name.termType === 'Literal') ? name.value : null;
}
```

https://codesandbox.io/s/vigilant-napier-i3tf4?fontsize=14

### ldflex

```javascript
import data from "@solid/query-ldflex";

async function getName(webId) {
  return data[webId].name.value;
}
```

[CodeSandbox link not possible](https://github.com/codesandbox/codesandbox-client/issues/2368)

## Reading multiple values for a property

### Tripledoc

```javascript
import { fetchDocument } from "tripledoc";

async function getNicknames(webId) {
  const profileDoc = await fetchDocument(webId);
  const profile = profileDoc.getSubject(webId);
  return profile.getAllStrings('http://xmlns.com/foaf/0.1/nick');
}
```

https://codesandbox.io/s/peaceful-payne-su5t6?fontsize=14

### rdflib

```javascript
import { graph, Fetcher, sym } from "rdflib";

async function getNicknames(webId) {
  const store = graph();
  const fetcher = new Fetcher(store, {});
  await fetcher.load(webId);
  const me = sym(webId);
  const nicknames = store.each(me, sym('http://xmlns.com/foaf/0.1/nick'), null, me.doc());
  return nicknames
    .filter(node => node.termType === "Literal")
    .map(nickname => nickname.value);
}
```

https://codesandbox.io/s/festive-currying-z6s3n?fontsize=14

### ldflex

```javascript
import data from "@solid/query-ldflex";

async function getNicknames(webId) {
  return data[webId].nick.values;
}
```

[CodeSandbox link not possible](https://github.com/codesandbox/codesandbox-client/issues/2368)

## Adding multiple literals for the same property

Note: the examples below assume the user [is logged in](writing-a-solid-app/1-authentication) and is
allowed to write to their profile.

### Tripledoc

```javascript
import { fetchDocument } from "tripledoc";

async function addNicknames(webId, nicknames) {
  const profileDoc = await fetchDocument(webId);
  const profile = profileDoc.getSubject(webId);

  nicknames.forEach((nickname) => profile.addLiteral('http://xmlns.com/foaf/0.1/nick', nickname));
  await webIdDoc.save();
}
```

### rdflib

```javascript
import { graph, Fetcher, sym, UpdateManager, Literal } from "rdflib";

async function addNicknames(webId, nicknames) {
  const store = graph();
  const fetcher = new Fetcher(store, {});
  await fetcher.load(currentSession.webId);
  const me = sym(currentSession.webId);
  const updater = new UpdateManager(store);
  const updatePromise = new Promise((resolve) => {
    const deletions = [];
    const additions = nicknames.map(nickname => st(me, sym('http://xmlns.com/foaf/0.1/nick'), new Literal(nickname), me.doc()));
    updater.update(deletions, additions, resolve);
  });
  await updatePromise;
}
```

### ldflex

```javascript
import data from "@solid/query-ldflex";

async function addNicknames(webId, nicknames) {
  return data[webId].nick.add(...nicknames);
}
```

## Adding values for multiple properties

Note: the examples below assume the user [is logged in](writing-a-solid-app/1-authentication) and is
allowed to write to their profile.

### Tripledoc

```javascript
import { fetchDocument } from "tripledoc";

async function addNameAndNickname(webId, name, nickname) {
  const profileDoc = await fetchDocument(webId);
  const profile = profileDoc.getSubject(webId);

  profile.addLiteral('http://xmlns.com/foaf/0.1/name', name);
  profile.addLiteral('http://xmlns.com/foaf/0.1/nick', nickname);
  await webIdDoc.save();
}
```

### rdflib

```javascript
import { graph, Fetcher, sym, UpdateManager, Literal } from "rdflib";

async function addNameAndNickname(webId, name, nickname) {
  const store = graph();
  const fetcher = new Fetcher(store, {});
  await fetcher.load(currentSession.webId);
  const me = sym(currentSession.webId);
  const updater = new UpdateManager(store);
  const updatePromise = new Promise((resolve) => {
    const deletions = [];
    const additions = [
      st(me, sym('http://xmlns.com/foaf/0.1/name'), new Literal(name), me.doc()),
      st(me, sym('http://xmlns.com/foaf/0.1/nick'), new Literal(nickname), me.doc()),
    ];
    updater.update(deletions, additions, resolve);
  });
  await updatePromise;
}
```

### ldflex

```javascript
import data from "@solid/query-ldflex";

async function addNameAndNickname(webId, name, nickname) {
  // Note: the current implementation will execute two HTTP requests instead of one
  await data[webId].name.add(name);
  await data[webId].nick.add(nickname);
}
```

## Replacing existing values with new ones

Note: the examples below assume the user [is logged in](writing-a-solid-app/1-authentication) and is
allowed to write to their profile.

### Tripledoc

```javascript
import { fetchDocument } from "tripledoc";

async function setNicknames(webId, nicknames) {
  const profileDoc = await fetchDocument(webId);
  const profile = profileDoc.getSubject(webId);

  profile.removeAll('http://xmlns.com/foaf/0.1/nick');
  nicknames.forEach((nickname) => profile.addLiteral('http://xmlns.com/foaf/0.1/nick', nickname));
  await webIdDoc.save();
}
```

### rdflib

```javascript
import { graph, Fetcher, sym, UpdateManager, Literal } from "rdflib";

async function setNicknames(webId, nicknames) {
  const store = graph();
  const fetcher = new Fetcher(store, {});
  await fetcher.load(currentSession.webId);
  const me = sym(currentSession.webId);
  const updater = new UpdateManager(store);
  const updatePromise = new Promise((resolve) => {
    const deletions = store.statementsMatching(me, sym('http://xmlns.com/foaf/0.1/nick'), null, me.doc());
    const additions = nicknames.map(nickname => st(me, sym('http://xmlns.com/foaf/0.1/nick'), new Literal(nickname), me.doc()));
    updater.update(deletions, additions, resolve);
  });
  await updatePromise;
}
```

### ldflex

```javascript
import data from "@solid/query-ldflex";

async function setNicknames(webId, nicknames) {
  return data[webId].nick.set(...nicknames);
}
```

## Removing all values for a property

Note: the examples below assume the user [is logged in](writing-a-solid-app/1-authentication) and is
allowed to write to their profile.

### Tripledoc

```javascript
import { fetchDocument } from "tripledoc";

async function removeNicknames(webId) {
  const profileDoc = await fetchDocument(webId);
  const profile = profileDoc.getSubject(webId);

  profile.removeAll('http://xmlns.com/foaf/0.1/nick');
  await webIdDoc.save();
}
```

### rdflib

```javascript
import { graph, Fetcher, sym, UpdateManager } from "rdflib";

async function removeNicknames(webId) {
  const store = graph();
  const fetcher = new Fetcher(store, {});
  await fetcher.load(currentSession.webId);
  const me = sym(currentSession.webId);
  const updater = new UpdateManager(store);
  const updatePromise = new Promise((resolve) => {
    const deletions = store.statementsMatching(me, sym('http://xmlns.com/foaf/0.1/nick'), null, me.doc());
    const additions = [];
    updater.update(deletions, additions, resolve);
  });
  await updatePromise;
}
```


### ldflex

```javascript
import data from "@solid/query-ldflex";

async function removeNicknames(webId) {
  return data[webId].nick.delete();
}
```


## Removing a single specific value for a property

Note: the examples below assume the user [is logged in](writing-a-solid-app/1-authentication) and is
allowed to write to their profile.

### Tripledoc

```javascript
import { fetchDocument } from "tripledoc";

async function removeNickname(webId, nickname) {
  const profileDoc = await fetchDocument(webId);
  const profile = profileDoc.getSubject(webId);

  profile.removeLiteral('http://xmlns.com/foaf/0.1/nick', nickname);
  await webIdDoc.save();
}
```

### rdflib

```javascript
import { graph, Fetcher, sym, UpdateManager, Literal } from "rdflib";

async function removeNickname(webId, nickname) {
  const store = graph();
  const fetcher = new Fetcher(store, {});
  await fetcher.load(currentSession.webId);
  const me = sym(currentSession.webId);
  const updater = new UpdateManager(store);
  const updatePromise = new Promise((resolve) => {
    const deletions = store.statementsMatching(me, sym('http://xmlns.com/foaf/0.1/nick'), Literal(nickname), me.doc());
    const additions = [];
    updater.update(deletions, additions, resolve);
  });
  await updatePromise;
}
```

### ldflex

```javascript
import data from "@solid/query-ldflex";

async function removeNickname(webId, nickname) {
  return data[webId].nick.delete(nickname);
}
```

## Create a new Document

Note: the examples below assume the user [is logged in](writing-a-solid-app/1-authentication) and is allowed to
write to their profile.

### Tripledoc

```javascript
import { createDocument } from "tripledoc";

async function createEmptyDocument(location) {
  const document = createDocument(location);
  await document.save();
}
```

### rdflib

```javascript
import { graph, sym, UpdateManager } from "rdflib";

async function createEmptyDocument(location) {
  const store = graph();
  const updater = new UpdateManager(store);
  const creationPromise = new Promise((resolve, reject) => {
    updater.put(sym(location), [], 'text/turtle', (_url, success, message) => {
      if (success) {
        resolve();
      } else {
        reject(new Error(message));
      }
    });
  });
  await creationPromise;
}
```

### ldflex

```javascript
import data from "@solid/query-ldflex";

async function createDocument(location) {
  // Add any triple to start a document
  return data[location].name.add('New document');
};
```

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
  // Note that this will also return invalid Literal data (integers, dates, etc.)
  return (name && name.termType === 'Literal') ? name.value : null;
}
```

https://codesandbox.io/s/vigilant-napier-i3tf4?fontsize=14

### LDflex for Solid

```javascript
import data from "@solid/query-ldflex";

function getName(webId) {
  // Note that this will also return invalid data (e.g. non-Literals, integers, etc.)
  return data[webId].name.value;
}
```

which is a [condensed](https://www.npmjs.com/package/@solid/query-ldflex#specifying-properties) version of:

```javascript
import data from "@solid/query-ldflex";

async function getName(webId) {
  const person = data[webId];
  const name = await person['http://xmlns.com/foaf/0.1/name'];
  return (name && name.termType === 'Literal' && name.datatype.id === 'http://www.w3.org/2001/XMLSchema#string')
    ? name.value
    : null;
}
```

[CodeSandbox link not possible](https://github.com/codesandbox/codesandbox-client/issues/2368)

## Reading values for multiple properties

### Tripledoc

```javascript
import { fetchDocument } from "tripledoc";

async function getNameAndNick(webId) {
  const profileDoc = await fetchDocument(webId);
  const profile = profileDoc.getSubject(webId);
  return {
    name: profile.getString('http://xmlns.com/foaf/0.1/name'),
    nick: profile.getString('http://xmlns.com/foaf/0.1/nick'),
 };
}
```

https://codesandbox.io/s/gracious-feather-msref?fontsize=14

### rdflib

```javascript
import { graph, Fetcher, sym } from "rdflib";

async function getName(webId) {
  const store = graph();
  const fetcher = new Fetcher(store, {});
  await fetcher.load(webId);
  const me = sym(webId);
  const name = store.any(me, sym('http://xmlns.com/foaf/0.1/name'), null, me.doc());
  const nick = store.any(me, sym('http://xmlns.com/foaf/0.1/nick'), null, me.doc());
  return {
    // Note that this will also return invalid Literal data (integers, dates, etc.)
    name: (name && name.termType === 'Literal') ? name.value : null,
    nick: (nick && nick.termType === 'Literal') ? nick.value : null,
  };
}
```

https://codesandbox.io/s/polished-brook-j03uo?fontsize=14

### LDflex for Solid

```javascript
import data from "@solid/query-ldflex";

async function getNameAndNick(webId) {
  return {
    // The following two lines will perform just one HTTP request; the response is cached by LDflex.
    // Also note that this will also return invalid data (e.g. non-Literals, integers, etc.)
    name: await data[webId].name.value,
    nick: await data[webId].nick.value,
  };
}
```

which is a [condensed](https://www.npmjs.com/package/@solid/query-ldflex#specifying-properties) version of:

```javascript
import data from "@solid/query-ldflex";

async function getNameAndNick(webId) {
  const person = data[webId];
  // The following two lines will perform just one HTTP request; the response is cached by LDflex.
  const name = await person['http://xmlns.com/foaf/0.1/name'];
  const nick = await person['http://xmlns.com/foaf/0.1/nick'];

  return {
    name: (name && name.termType === 'Literal' && name.datatype.id === 'http://www.w3.org/2001/XMLSchema#string')
      ? name.value
      : null,
    nick: (nick && nick.termType === 'Literal' && nick.datatype.id === 'http://www.w3.org/2001/XMLSchema#string')
      ? nick.value
      : null,
  };
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
    // Note that this will also return invalid Literal data (integers, dates, etc.)
    .filter(node => node.termType === "Literal")
    .map(nickname => nickname.value);
}
```

https://codesandbox.io/s/festive-currying-z6s3n?fontsize=14

### LDflex for Solid

```javascript
import data from "@solid/query-ldflex";

function getNicknames(webId) {
  // Note that this will also return invalid data (e.g. non-Literals, integers, etc.)
  return data[webId].nick.values;
}
```

which is a [condensed](https://www.npmjs.com/package/@solid/query-ldflex#specifying-properties) version of:

```javascript
import data from "@solid/query-ldflex";

async function getNicknames(webId) {
  const person = data[webId];
  const nicknames = [];
  for await (const nickname of person['http://xmlns.com/foaf/0.1/nick']) {
    nicknames.push(nickname);
  }
  return nicknames
    .filter(node => node.termType === 'Literal' && node.datatype.id === 'http://www.w3.org/2001/XMLSchema#string')
    .map(nickname => nickname.value);
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

### LDflex for Solid

```javascript
import data from "@solid/query-ldflex";

function addNicknames(webId, nicknames) {
  return data[webId].nick.add(...nicknames);
}
```

which is a [condensed](https://www.npmjs.com/package/@solid/query-ldflex#specifying-properties) version of:

```javascript
import data from "@solid/query-ldflex";
import { literal } from "@rdfjs/data-model";

async function addNicknames(webId, nicknames) {
  const person = data[webId];
  await person['http://xmlns.com/foaf/0.1/nick'].add(...nicknames.map(nickname => literal(nickname)));
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

### LDflex for Solid

```javascript
import data from "@solid/query-ldflex";

async function addNameAndNickname(webId, name, nickname) {
  // Note: this will execute two HTTP requests instead of one:
  await data[webId].name.add(name);
  await data[webId].nick.add(nickname);
}
```

which is a [condensed](https://www.npmjs.com/package/@solid/query-ldflex#specifying-properties) version of:

```javascript
import data from "@solid/query-ldflex";
import { literal } from "@rdfjs/data-model";

async function addNameAndNickname(webId, name, nickname) {
  const person = data[webId];
  // Note: this will execute two HTTP requests instead of one:
  await person['http://xmlns.com/foaf/0.1/name'].add(literal(name));
  await person['http://xmlns.com/foaf/0.1/nick'].add(literal(nickname));
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

### LDflex for Solid

```javascript
import data from "@solid/query-ldflex";

function setNicknames(webId, nicknames) {
  return data[webId].nick.set(...nicknames);
}
```

which is a [condensed](https://www.npmjs.com/package/@solid/query-ldflex#specifying-properties) version of:

```javascript
import data from "@solid/query-ldflex";
import { literal } from "@rdfjs/data-model";

async function setNicknames(webId, nicknames) {
  const person = data[webId];
  await person['http://xmlns.com/foaf/0.1/nick'].set(...nicknames.map(nickname => literal(nickname)));
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


### LDflex for Solid

```javascript
import data from "@solid/query-ldflex";

function removeNicknames(webId) {
  return data[webId].nick.delete();
}
```

which is a [condensed](https://www.npmjs.com/package/@solid/query-ldflex#specifying-properties) version of:

```javascript
import data from "@solid/query-ldflex";

async function removeNicknames(webId) {
  const person = data[webId];
  await person['http://xmlns.com/foaf/0.1/nick'].delete();
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

### LDflex for Solid

```javascript
import data from "@solid/query-ldflex";

function removeNickname(webId, nickname) {
  return data[webId].nick.delete(nickname);
}
```

which is a [condensed](https://www.npmjs.com/package/@solid/query-ldflex#specifying-properties) version of:

```javascript
import data from "@solid/query-ldflex";
import { literal } from "@rdfjs/data-model";

async function removeNickname(webId, nickname) {
  const person = data[webId];
  await person['http://xmlns.com/foaf/0.1/nick'].delete(literal(nickname));
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

### LDflex for Solid

LDflex [does not have explicit support for creating a new Document
yet](https://github.com/solid/query-ldflex/issues/7), so we can create the required HTTP request
ourselves:

```javascript
// Note: this is not ldflex-specific, as ldflex has no specific functionality for this use case.
// We manually send the required HTTP request.
async function createEmptyDocument(location) {
  const options = {
    body: '',
    // Make sure to include credentials with the request, set by solid-auth-client:
    credentials: 'include',
    headers: {
      'Content-Type': 'text/turtle'
    },
    method: 'PUT',
  };
  await fetch(location, options);
};
```

Alternatively, we can simply tell LDFlex to add a value to a Document that does not exist yet, which
will cause it to be created:

```javascript
import data from "@solid/query-ldflex";

async function createDocument(location) {
  // Adding a value to a non-existing Document will create it for us:
  return data[location].name.add('Dummy name');
};

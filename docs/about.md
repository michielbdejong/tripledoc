---
id: about
title: Why Tripledoc?
---

Tripledoc originated in the quest to write documentation on how to get started writing Solid apps,
targeted at a regular front-end engineer without previous experience with Linked Data or RDF.

It turned out that the conceptual models were hard to explain using existing libraries. Tripledoc
started as a thin wrapper around rdflib, the library we use to develop Inrupt's Solid Data Browser,
providing an interface that meshes well with the way we think about accessing Solid data.

Tripledoc aims to solve the following problems:

- The dearth of documentation on getting started writing Solid apps.
- The lack of or incompleteness of type definitions that guide you while using an RDF library.
- Having to convert a conceptual model of Documents, and entities with properties set to a value, to
  a model of nodes in a graph.
- The clunckiness of having to keep wrapping/unwrapping RDF Nodes.

It is expressly _not_ designed to solve:

- The difficulty of combining data from many different sources and traversing a Linked Data graph.
- Teaching users about Linked Data and RDF to a greater extent than is necessary to start writing
  Solid Web Apps.
- Teaching people how to write Web Apps in the first place. It is assumed that people know how to write proper Web Apps, and Tripledoc should enable those apps to store their data on a Pod.

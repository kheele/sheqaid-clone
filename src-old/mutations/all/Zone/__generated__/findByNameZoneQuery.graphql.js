/**
 * @generated SignedSource<<7dd04c7570409b0c703e9640cb9a9288>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "name"
              }
            ],
            "kind": "ObjectValue",
            "name": "name"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_zonesConnection",
    "kind": "LinkedField",
    "name": "default_zones_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_zonesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_zones",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "default_countries",
                "kind": "LinkedField",
                "name": "country",
                "plural": false,
                "selections": [
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "findByNameZoneQuery",
    "selections": (v2/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByNameZoneQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c0d9953d7798694c421521b7c8147ac0",
    "id": null,
    "metadata": {},
    "name": "findByNameZoneQuery",
    "operationKind": "query",
    "text": "query findByNameZoneQuery(\n  $name: String\n) {\n  default_zones_connection(where: {name: {_eq: $name}}) {\n    edges {\n      node {\n        id\n        country {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "e7cf7e34947409744f112115bae52435";

module.exports = node;

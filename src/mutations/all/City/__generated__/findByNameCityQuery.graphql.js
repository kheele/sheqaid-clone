/**
 * @generated SignedSource<<a98a9588c7af285ddfd0a70b1c18b8f4>>
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
  (v1/*: any*/)
],
v3 = [
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
    "concreteType": "default_citiesConnection",
    "kind": "LinkedField",
    "name": "default_cities_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_citiesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_cities",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "default_zones",
                "kind": "LinkedField",
                "name": "zone",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_countries",
                "kind": "LinkedField",
                "name": "country",
                "plural": false,
                "selections": (v2/*: any*/),
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
    "name": "findByNameCityQuery",
    "selections": (v3/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByNameCityQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "9f49b2d1e3c5a4e023513a380bf8c161",
    "id": null,
    "metadata": {},
    "name": "findByNameCityQuery",
    "operationKind": "query",
    "text": "query findByNameCityQuery(\n  $name: String\n) {\n  default_cities_connection(where: {name: {_eq: $name}}) {\n    edges {\n      node {\n        id\n        zone {\n          id\n        }\n        country {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "f7f9e8b3d9d95b7e78bd23ec267c2599";

module.exports = node;

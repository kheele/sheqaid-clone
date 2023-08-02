/**
 * @generated SignedSource<<818752cb4190374cbcae9a69fb4049d5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "default_countriesConnection",
    "kind": "LinkedField",
    "name": "default_countries_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_countriesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_countries",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "iso2",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "phone_code",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllCountryQuery",
    "selections": (v0/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listAllCountryQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "9a987469a31746f15f6e0c0d78f40246",
    "id": null,
    "metadata": {},
    "name": "listAllCountryQuery",
    "operationKind": "query",
    "text": "query listAllCountryQuery {\n  default_countries_connection {\n    edges {\n      node {\n        id\n        name\n        iso2\n        phone_code\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "f8b4acb4f6553f4cea0222a6347bf131";

module.exports = node;

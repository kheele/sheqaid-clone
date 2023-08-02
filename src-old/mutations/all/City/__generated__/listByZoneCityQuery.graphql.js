/**
 * @generated SignedSource<<15a3e865e62fa758ac1117008f6fb626>>
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
    "name": "zone_id"
  }
],
v1 = [
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
                "variableName": "zone_id"
              }
            ],
            "kind": "ObjectValue",
            "name": "zone_id"
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
    "name": "listByZoneCityQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "listByZoneCityQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4dfa21f510109092f3354a7ce8fddc5d",
    "id": null,
    "metadata": {},
    "name": "listByZoneCityQuery",
    "operationKind": "query",
    "text": "query listByZoneCityQuery(\n  $zone_id: bigint\n) {\n  default_cities_connection(where: {zone_id: {_eq: $zone_id}}) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "e3b4f977b6165feea563c35bf7d94971";

module.exports = node;

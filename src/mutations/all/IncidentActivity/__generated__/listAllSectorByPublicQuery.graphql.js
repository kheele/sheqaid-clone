/**
 * @generated SignedSource<<638c724c0cc10b71e7629dcdecfcace1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "order_by",
        "value": {
          "name": "asc"
        }
      },
      {
        "kind": "Literal",
        "name": "where",
        "value": {
          "sector_owner": {
            "_eq": "Public"
          }
        }
      }
    ],
    "concreteType": "default_sectorsConnection",
    "kind": "LinkedField",
    "name": "default_sectors_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sectorsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_sectors",
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
    "storageKey": "default_sectors_connection(order_by:{\"name\":\"asc\"},where:{\"sector_owner\":{\"_eq\":\"Public\"}})"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listAllSectorByPublicQuery",
    "selections": (v0/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listAllSectorByPublicQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "03962bc0b973bd1b11b5f64f9e69b337",
    "id": null,
    "metadata": {},
    "name": "listAllSectorByPublicQuery",
    "operationKind": "query",
    "text": "query listAllSectorByPublicQuery {\n  default_sectors_connection(where: {sector_owner: {_eq: \"Public\"}}, order_by: {name: asc}) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "8e19960b77905b576960a3e3ce03181f";

module.exports = node;

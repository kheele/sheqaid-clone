/**
 * @generated SignedSource<<a8a7c108235694569a4644748f516029>>
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
    "name": "object"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "proxy_sector__client",
    "kind": "LinkedField",
    "name": "insert_proxy_sector__client_one",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "insertProxySectorClientMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxySectorClientMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "af8d517228f7314b55dc5b61ad2fc5fa",
    "id": null,
    "metadata": {},
    "name": "insertProxySectorClientMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxySectorClientMutation(\n  $object: proxy_sector__client_insert_input!\n) {\n  insert_proxy_sector__client_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "40ef31067721061d9511b7a4e11d280a";

module.exports = node;

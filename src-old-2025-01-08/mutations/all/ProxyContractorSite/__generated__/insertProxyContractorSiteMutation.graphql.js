/**
 * @generated SignedSource<<528d3008206edf50373d4ac1fa6f25e2>>
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
    "concreteType": "proxy_contractors__sites",
    "kind": "LinkedField",
    "name": "insert_proxy_contractors__sites_one",
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
    "name": "insertProxyContractorSiteMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyContractorSiteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "43dc1e6558c2bab638168bb3eb94c7cf",
    "id": null,
    "metadata": {},
    "name": "insertProxyContractorSiteMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyContractorSiteMutation(\n  $object: proxy_contractors__sites_insert_input!\n) {\n  insert_proxy_contractors__sites_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "67afffa1a8631e21e5235ee0c50b5500";

module.exports = node;

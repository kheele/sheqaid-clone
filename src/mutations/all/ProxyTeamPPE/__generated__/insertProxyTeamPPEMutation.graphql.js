/**
 * @generated SignedSource<<21f7df4b82f852e3e696110a4fa72252>>
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
    "concreteType": "proxy_team__ppe",
    "kind": "LinkedField",
    "name": "insert_proxy_team__ppe_one",
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
    "name": "insertProxyTeamPPEMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyTeamPPEMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1e4a831f4fa385ceb63dbc4840c8a875",
    "id": null,
    "metadata": {},
    "name": "insertProxyTeamPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyTeamPPEMutation(\n  $object: proxy_team__ppe_insert_input!\n) {\n  insert_proxy_team__ppe_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "c813e241d86a5fc83d282a26a29715a5";

module.exports = node;

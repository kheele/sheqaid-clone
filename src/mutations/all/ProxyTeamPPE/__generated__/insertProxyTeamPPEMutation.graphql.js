/**
 * @generated SignedSource<<3075edeb6a1ce91b4eab8ba37874a25f>>
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
    "concreteType": "proxy_team__ppe_type",
    "kind": "LinkedField",
    "name": "insert_proxy_team__ppe_type_one",
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
    "cacheID": "8748ff3a201492764d7958dbc36b085e",
    "id": null,
    "metadata": {},
    "name": "insertProxyTeamPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyTeamPPEMutation(\n  $object: proxy_team__ppe_type_insert_input!\n) {\n  insert_proxy_team__ppe_type_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "23cd137bb261929b3b5fecc9601fa5bb";

module.exports = node;

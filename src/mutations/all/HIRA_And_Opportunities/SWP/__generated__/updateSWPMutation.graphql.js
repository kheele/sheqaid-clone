/**
 * @generated SignedSource<<53fadb759037b93a11956c3245c3cbe7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "hira_swp",
    "kind": "LinkedField",
    "name": "update_hira_swp_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateSWPMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateSWPMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "a560d39e7172757a9b4a4f672b66db97",
    "id": null,
    "metadata": {},
    "name": "updateSWPMutation",
    "operationKind": "mutation",
    "text": "mutation updateSWPMutation(\n  $id: hira_swp_pk_columns_input!\n  $_set: hira_swp_set_input!\n) {\n  update_hira_swp_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "ce0e692e703bf2b7b62b810d31a6d96a";

module.exports = node;

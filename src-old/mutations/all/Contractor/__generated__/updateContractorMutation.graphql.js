/**
 * @generated SignedSource<<cf9c08ef6543ed7c61000a006eedc3ed>>
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
    "concreteType": "default_contractors",
    "kind": "LinkedField",
    "name": "update_default_contractors_by_pk",
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
    "name": "updateContractorMutation",
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
    "name": "updateContractorMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "17b765d4348883fe69f4c3737ac9617b",
    "id": null,
    "metadata": {},
    "name": "updateContractorMutation",
    "operationKind": "mutation",
    "text": "mutation updateContractorMutation(\n  $id: default_contractors_pk_columns_input!\n  $_set: default_contractors_set_input!\n) {\n  update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "189351e0f2d31bf4529287a81b6b5106";

module.exports = node;

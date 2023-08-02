/**
 * @generated SignedSource<<c14e4babcf0bbac406dc8edfc4c35cb8>>
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
    "concreteType": "default_job_positions",
    "kind": "LinkedField",
    "name": "update_default_job_positions_by_pk",
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
    "name": "updateJobPositionMutation",
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
    "name": "updateJobPositionMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "62d276d9adaad3cc4d78e1f97cae5ffa",
    "id": null,
    "metadata": {},
    "name": "updateJobPositionMutation",
    "operationKind": "mutation",
    "text": "mutation updateJobPositionMutation(\n  $id: default_job_positions_pk_columns_input!\n  $_set: default_job_positions_set_input!\n) {\n  update_default_job_positions_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "548013e5c08fbbd71008d29620d004ca";

module.exports = node;

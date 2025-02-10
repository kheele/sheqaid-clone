/**
 * @generated SignedSource<<af43114891d53afe5be80df74db72a54>>
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
    "concreteType": "hira_taskbased_ra_list",
    "kind": "LinkedField",
    "name": "update_hira_taskbased_ra_list_by_pk",
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
    "name": "updateTaskbasedRAListItemMutation",
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
    "name": "updateTaskbasedRAListItemMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "335753cc4602ae91bdc5f507eab01f33",
    "id": null,
    "metadata": {},
    "name": "updateTaskbasedRAListItemMutation",
    "operationKind": "mutation",
    "text": "mutation updateTaskbasedRAListItemMutation(\n  $id: hira_taskbased_ra_list_pk_columns_input!\n  $_set: hira_taskbased_ra_list_set_input!\n) {\n  update_hira_taskbased_ra_list_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a72dbf2da90bd262252432d8ecac6515";

module.exports = node;

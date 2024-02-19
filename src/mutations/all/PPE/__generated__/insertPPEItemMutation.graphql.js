/**
 * @generated SignedSource<<363c62fdd255197086db3607af1b465f>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "ppe_items",
    "kind": "LinkedField",
    "name": "insert_ppe_items_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "removed",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "notes",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "profile_pic",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "serial_num",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "purchase_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "condition",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "ppe_types",
        "kind": "LinkedField",
        "name": "ppe_type",
        "plural": false,
        "selections": [
          (v1/*: any*/)
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
    "name": "insertPPEItemMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPPEItemMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "82e1452711537443c9719b1d0f42e302",
    "id": null,
    "metadata": {},
    "name": "insertPPEItemMutation",
    "operationKind": "mutation",
    "text": "mutation insertPPEItemMutation(\n  $object: ppe_items_insert_input!\n) {\n  insert_ppe_items_one(object: $object) {\n    id\n    removed\n    created_at\n    notes\n    profile_pic\n    serial_num\n    purchase_date\n    condition\n    ppe_type {\n      id\n    }\n  }\n}\n"
  }
};
})();

node.hash = "fcc997caeaa877f1c7e92ac78717f38b";

module.exports = node;

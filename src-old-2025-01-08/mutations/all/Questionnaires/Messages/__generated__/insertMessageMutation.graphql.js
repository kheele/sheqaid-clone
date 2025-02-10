/**
 * @generated SignedSource<<bc8c0cadb1713170bc9d06265010e8e9>>
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
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "full_name",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "username",
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "default_contractor_questionnaires_messages",
    "kind": "LinkedField",
    "name": "insert_default_contractor_questionnaires_messages_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "question_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "msg",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "read",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "sender_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "recipient_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "contractor_sender_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "contractor_recipient_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "sender",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_users",
        "kind": "LinkedField",
        "name": "recipient",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_users",
        "kind": "LinkedField",
        "name": "contractor_sender",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractor_users",
        "kind": "LinkedField",
        "name": "contractor_recipient",
        "plural": false,
        "selections": (v2/*: any*/),
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
    "name": "insertMessageMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertMessageMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "9376671544f11b6fd74f48340941fe1f",
    "id": null,
    "metadata": {},
    "name": "insertMessageMutation",
    "operationKind": "mutation",
    "text": "mutation insertMessageMutation(\n  $object: default_contractor_questionnaires_messages_insert_input!\n) {\n  insert_default_contractor_questionnaires_messages_one(object: $object) {\n    id\n    question_id\n    date\n    msg\n    read\n    sender_id\n    recipient_id\n    contractor_sender_id\n    contractor_recipient_id\n    sender {\n      id\n      full_name\n      username\n    }\n    recipient {\n      id\n      full_name\n      username\n    }\n    contractor_sender {\n      id\n      full_name\n      username\n    }\n    contractor_recipient {\n      id\n      full_name\n      username\n    }\n  }\n}\n"
  }
};
})();

node.hash = "7669c10d9c9947f10904a29d20b7ab08";

module.exports = node;

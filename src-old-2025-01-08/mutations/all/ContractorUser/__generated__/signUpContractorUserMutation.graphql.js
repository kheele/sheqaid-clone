/**
 * @generated SignedSource<<7cd3e3764d4fce78795012f2180494ce>>
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fname",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lname",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "sheq_permissions_actions",
  "kind": "LinkedField",
  "name": "actions",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "create",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "edit",
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "remove",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "share",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "view",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = [
  (v1/*: any*/),
  (v9/*: any*/)
],
v11 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "default_contractor_users",
    "kind": "LinkedField",
    "name": "insert_default_contractor_users_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "auth_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
        "storageKey": null
      },
      (v2/*: any*/),
      (v3/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "full_name",
        "storageKey": null
      },
      (v4/*: any*/),
      (v5/*: any*/),
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
        "name": "auth_type",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "has_biometric",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_permissions_modules",
        "kind": "LinkedField",
        "name": "permissions_module_list",
        "plural": true,
        "selections": [
          (v6/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "default_manager_module",
            "kind": "LinkedField",
            "name": "module",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "default_manager_plugin",
                "kind": "LinkedField",
                "name": "plugin",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "desc",
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_permissions_other",
        "kind": "LinkedField",
        "name": "permissions_other_list",
        "plural": true,
        "selections": [
          (v6/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_permissions_other_keys",
            "kind": "LinkedField",
            "name": "key",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "value",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "notifications_settings",
        "kind": "LinkedField",
        "name": "notifications_settings",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_asset_management_notifs",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_chemicals_management_notifs",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_contractor_management_notifs",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_employees_expired_docs_medicals",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_employees_profile_notifs",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_incident_management_notifs",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_non_conformance_management_notifs",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_training_management_notifs",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receive_expired_docs_notifs",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees",
        "kind": "LinkedField",
        "name": "linked_employee",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_companies",
        "kind": "LinkedField",
        "name": "company",
        "plural": false,
        "selections": (v10/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractors",
        "kind": "LinkedField",
        "name": "contractor",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v9/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sites",
        "kind": "LinkedField",
        "name": "site",
        "plural": false,
        "selections": (v10/*: any*/),
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
    "name": "signUpContractorUserMutation",
    "selections": (v11/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "signUpContractorUserMutation",
    "selections": (v11/*: any*/)
  },
  "params": {
    "cacheID": "f8089753e047070ec35ebf0e1bb9a9c0",
    "id": null,
    "metadata": {},
    "name": "signUpContractorUserMutation",
    "operationKind": "mutation",
    "text": "mutation signUpContractorUserMutation(\n  $object: default_contractor_users_insert_input!\n) {\n  insert_default_contractor_users_one(object: $object) {\n    id\n    auth_id\n    created_at\n    fname\n    lname\n    full_name\n    username\n    phone\n    profile_pic\n    auth_type\n    has_biometric\n    permissions_module_list {\n      actions {\n        create\n        edit\n        id\n        remove\n        share\n        view\n      }\n      id\n      module {\n        key\n        id\n        plugin {\n          id\n          key\n          desc\n          title\n          status\n        }\n        title\n      }\n    }\n    permissions_other_list {\n      actions {\n        create\n        edit\n        id\n        remove\n        share\n        view\n      }\n      id\n      key {\n        value\n        id\n      }\n    }\n    notifications_settings {\n      id\n      receive_asset_management_notifs\n      receive_chemicals_management_notifs\n      receive_contractor_management_notifs\n      receive_employees_expired_docs_medicals\n      receive_employees_profile_notifs\n      receive_incident_management_notifs\n      receive_non_conformance_management_notifs\n      receive_training_management_notifs\n      receive_expired_docs_notifs\n    }\n    linked_employee {\n      id\n      fname\n      lname\n      email\n      phone\n    }\n    company {\n      id\n      name\n    }\n    contractor {\n      id\n      name\n      username\n    }\n    site {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "b444c52131e270c590c50277fe8e0766";

module.exports = node;

/**
 * @generated SignedSource<<880d526a45ed784a3150f3fd4ae2c9a3>>
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
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon2"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon3"
  }
],
v1 = {
  "_eq": false
},
v2 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "removed": (v1/*: any*/)
    }
  }
],
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "count",
    "storageKey": null
  }
],
v4 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v5 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_competencies_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v6 = {
  "_is_null": true
},
v7 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "expiry_date": (v6/*: any*/),
      "removed": (v1/*: any*/)
    }
  }
],
v8 = {
  "_lte": "now()"
},
v9 = [
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "expiry_date": (v8/*: any*/),
      "removed": (v1/*: any*/)
    }
  }
],
v10 = {
  "fields": [
    {
      "kind": "Literal",
      "name": "_gt",
      "value": "now()"
    },
    {
      "kind": "Variable",
      "name": "_lte",
      "variableName": "mon"
    }
  ],
  "kind": "ObjectValue",
  "name": "expiry_date"
},
v11 = {
  "kind": "Literal",
  "name": "removed",
  "value": (v1/*: any*/)
},
v12 = [
  {
    "fields": [
      (v10/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v13 = {
  "fields": [
    {
      "kind": "Variable",
      "name": "_gt",
      "variableName": "mon"
    },
    {
      "kind": "Variable",
      "name": "_lte",
      "variableName": "mon2"
    }
  ],
  "kind": "ObjectValue",
  "name": "expiry_date"
},
v14 = [
  {
    "fields": [
      (v13/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v15 = {
  "fields": [
    {
      "kind": "Variable",
      "name": "_gt",
      "variableName": "mon2"
    },
    {
      "kind": "Variable",
      "name": "_lte",
      "variableName": "mon3"
    }
  ],
  "kind": "ObjectValue",
  "name": "expiry_date"
},
v16 = [
  {
    "fields": [
      (v15/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v17 = {
  "fields": [
    {
      "kind": "Variable",
      "name": "_gt",
      "variableName": "mon3"
    }
  ],
  "kind": "ObjectValue",
  "name": "expiry_date"
},
v18 = [
  {
    "fields": [
      (v17/*: any*/),
      (v11/*: any*/)
    ],
    "kind": "ObjectValue",
    "name": "where"
  }
],
v19 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_contracts_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v20 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_job_appointments_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v21 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_counsellings_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v22 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_leaves_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v23 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_licenses_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v24 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_medicals_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v25 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_warnings_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v26 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_work_permits_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": (v3/*: any*/),
    "storageKey": null
  }
],
v27 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_sitesConnection",
    "kind": "LinkedField",
    "name": "default_sites_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_sitesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_sites",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": "employee_active_list_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_aggregate",
                "kind": "LinkedField",
                "name": "employee_list_aggregate",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": "employee_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "employee_removed_list_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "removed": {
                        "_eq": true
                      }
                    }
                  }
                ],
                "concreteType": "hr_employees_aggregate",
                "kind": "LinkedField",
                "name": "employee_list_aggregate",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": "employee_list_aggregate(where:{\"removed\":{\"_eq\":true}})"
              },
              {
                "alias": "supervisor_list_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "removed": (v1/*: any*/),
                      "supervisor_employee_list_aggregate": {
                        "count": {
                          "filter": {
                            "removed": {
                              "_gt": false
                            }
                          },
                          "predicate": {
                            "_gt": 0
                          }
                        }
                      }
                    }
                  }
                ],
                "concreteType": "hr_employees_aggregate",
                "kind": "LinkedField",
                "name": "employee_list_aggregate",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": "employee_list_aggregate(where:{\"removed\":{\"_eq\":false},\"supervisor_employee_list_aggregate\":{\"count\":{\"filter\":{\"removed\":{\"_gt\":false}},\"predicate\":{\"_gt\":0}}}})"
              },
              {
                "alias": "competency_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_competencies_aggregate",
                "kind": "LinkedField",
                "name": "competency_list_aggregate",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": "competency_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "competency_list_no_expiry_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "hr_employees_docs_competencies_aggregate",
                "kind": "LinkedField",
                "name": "competency_list_aggregate",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": "competency_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "competency_list_expired_aggregate",
                "args": (v9/*: any*/),
                "concreteType": "hr_employees_docs_competencies_aggregate",
                "kind": "LinkedField",
                "name": "competency_list_aggregate",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": "competency_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "competency_list_mon_expiry_aggregate",
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_competencies_aggregate",
                "kind": "LinkedField",
                "name": "competency_list_aggregate",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              {
                "alias": "competency_list_2mon_expiry_aggregate",
                "args": (v14/*: any*/),
                "concreteType": "hr_employees_docs_competencies_aggregate",
                "kind": "LinkedField",
                "name": "competency_list_aggregate",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              {
                "alias": "competency_list_3mon_expiry_aggregate",
                "args": (v16/*: any*/),
                "concreteType": "hr_employees_docs_competencies_aggregate",
                "kind": "LinkedField",
                "name": "competency_list_aggregate",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              {
                "alias": "competency_list_4mon_expiry_aggregate",
                "args": (v18/*: any*/),
                "concreteType": "hr_employees_docs_competencies_aggregate",
                "kind": "LinkedField",
                "name": "competency_list_aggregate",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              {
                "alias": "contract_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v19/*: any*/),
                "storageKey": "contract_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "contract_list_no_expiry_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "contract_details": {
                        "expiry_date": (v6/*: any*/)
                      },
                      "removed": (v1/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v19/*: any*/),
                "storageKey": "contract_list_aggregate(where:{\"contract_details\":{\"expiry_date\":{\"_is_null\":true}},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "contract_list_expired_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "contract_details": {
                        "expiry_date": (v8/*: any*/)
                      },
                      "removed": (v1/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v19/*: any*/),
                "storageKey": "contract_list_aggregate(where:{\"contract_details\":{\"expiry_date\":{\"_lte\":\"now()\"}},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "contract_list_mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          (v10/*: any*/)
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
                      },
                      (v11/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v19/*: any*/),
                "storageKey": null
              },
              {
                "alias": "contract_list_2mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          (v13/*: any*/)
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
                      },
                      (v11/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v19/*: any*/),
                "storageKey": null
              },
              {
                "alias": "contract_list_3mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          (v15/*: any*/)
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
                      },
                      (v11/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v19/*: any*/),
                "storageKey": null
              },
              {
                "alias": "contract_list_4mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          (v17/*: any*/)
                        ],
                        "kind": "ObjectValue",
                        "name": "contract_details"
                      },
                      (v11/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_contracts_aggregate",
                "kind": "LinkedField",
                "name": "contract_list_aggregate",
                "plural": false,
                "selections": (v19/*: any*/),
                "storageKey": null
              },
              {
                "alias": "job_appointment_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_job_appointments_aggregate",
                "kind": "LinkedField",
                "name": "job_appointment_list_aggregate",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": "job_appointment_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "job_appointment_list_no_expiry_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "hr_employees_docs_job_appointments_aggregate",
                "kind": "LinkedField",
                "name": "job_appointment_list_aggregate",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": "job_appointment_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "job_appointment_list_expired_aggregate",
                "args": (v9/*: any*/),
                "concreteType": "hr_employees_docs_job_appointments_aggregate",
                "kind": "LinkedField",
                "name": "job_appointment_list_aggregate",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": "job_appointment_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "job_appointment_list_mon_expiry_aggregate",
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_job_appointments_aggregate",
                "kind": "LinkedField",
                "name": "job_appointment_list_aggregate",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": null
              },
              {
                "alias": "job_appointment_list_2mon_expiry_aggregate",
                "args": (v14/*: any*/),
                "concreteType": "hr_employees_docs_job_appointments_aggregate",
                "kind": "LinkedField",
                "name": "job_appointment_list_aggregate",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": null
              },
              {
                "alias": "job_appointment_list_3mon_expiry_aggregate",
                "args": (v16/*: any*/),
                "concreteType": "hr_employees_docs_job_appointments_aggregate",
                "kind": "LinkedField",
                "name": "job_appointment_list_aggregate",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": null
              },
              {
                "alias": "job_appointment_list_4mon_expiry_aggregate",
                "args": (v18/*: any*/),
                "concreteType": "hr_employees_docs_job_appointments_aggregate",
                "kind": "LinkedField",
                "name": "job_appointment_list_aggregate",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": null
              },
              {
                "alias": "counselling_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_counsellings_aggregate",
                "kind": "LinkedField",
                "name": "counselling_list_aggregate",
                "plural": false,
                "selections": (v21/*: any*/),
                "storageKey": "counselling_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "counselling_list_no_expiry_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "hr_employees_docs_counsellings_aggregate",
                "kind": "LinkedField",
                "name": "counselling_list_aggregate",
                "plural": false,
                "selections": (v21/*: any*/),
                "storageKey": "counselling_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "counselling_list_expired_aggregate",
                "args": (v9/*: any*/),
                "concreteType": "hr_employees_docs_counsellings_aggregate",
                "kind": "LinkedField",
                "name": "counselling_list_aggregate",
                "plural": false,
                "selections": (v21/*: any*/),
                "storageKey": "counselling_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "counselling_list_mon_expiry_aggregate",
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_counsellings_aggregate",
                "kind": "LinkedField",
                "name": "counselling_list_aggregate",
                "plural": false,
                "selections": (v21/*: any*/),
                "storageKey": null
              },
              {
                "alias": "counselling_list_2mon_expiry_aggregate",
                "args": (v14/*: any*/),
                "concreteType": "hr_employees_docs_counsellings_aggregate",
                "kind": "LinkedField",
                "name": "counselling_list_aggregate",
                "plural": false,
                "selections": (v21/*: any*/),
                "storageKey": null
              },
              {
                "alias": "counselling_list_3mon_expiry_aggregate",
                "args": (v16/*: any*/),
                "concreteType": "hr_employees_docs_counsellings_aggregate",
                "kind": "LinkedField",
                "name": "counselling_list_aggregate",
                "plural": false,
                "selections": (v21/*: any*/),
                "storageKey": null
              },
              {
                "alias": "counselling_list_4mon_expiry_aggregate",
                "args": (v18/*: any*/),
                "concreteType": "hr_employees_docs_counsellings_aggregate",
                "kind": "LinkedField",
                "name": "counselling_list_aggregate",
                "plural": false,
                "selections": (v21/*: any*/),
                "storageKey": null
              },
              {
                "alias": "leave_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": "leave_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "leave_list_no_expiry_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": "leave_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "leave_list_expired_aggregate",
                "args": (v9/*: any*/),
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": "leave_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "leave_list_mon_expiry_aggregate",
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": null
              },
              {
                "alias": "leave_list_2mon_expiry_aggregate",
                "args": (v14/*: any*/),
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": null
              },
              {
                "alias": "leave_list_3mon_expiry_aggregate",
                "args": (v16/*: any*/),
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": null
              },
              {
                "alias": "leave_list_4mon_expiry_aggregate",
                "args": (v18/*: any*/),
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": null
              },
              {
                "alias": "license_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_licenses_aggregate",
                "kind": "LinkedField",
                "name": "license_list_aggregate",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": "license_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "license_list_no_expiry_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "hr_employees_docs_licenses_aggregate",
                "kind": "LinkedField",
                "name": "license_list_aggregate",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": "license_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "license_list_expired_aggregate",
                "args": (v9/*: any*/),
                "concreteType": "hr_employees_docs_licenses_aggregate",
                "kind": "LinkedField",
                "name": "license_list_aggregate",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": "license_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "license_list_mon_expiry_aggregate",
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_licenses_aggregate",
                "kind": "LinkedField",
                "name": "license_list_aggregate",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": null
              },
              {
                "alias": "license_list_2mon_expiry_aggregate",
                "args": (v14/*: any*/),
                "concreteType": "hr_employees_docs_licenses_aggregate",
                "kind": "LinkedField",
                "name": "license_list_aggregate",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": null
              },
              {
                "alias": "license_list_3mon_expiry_aggregate",
                "args": (v16/*: any*/),
                "concreteType": "hr_employees_docs_licenses_aggregate",
                "kind": "LinkedField",
                "name": "license_list_aggregate",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": null
              },
              {
                "alias": "license_list_4mon_expiry_aggregate",
                "args": (v18/*: any*/),
                "concreteType": "hr_employees_docs_licenses_aggregate",
                "kind": "LinkedField",
                "name": "license_list_aggregate",
                "plural": false,
                "selections": (v23/*: any*/),
                "storageKey": null
              },
              {
                "alias": "medical_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_medicals_aggregate",
                "kind": "LinkedField",
                "name": "medical_list_aggregate",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": "medical_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "medical_list_no_expiry_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "hr_employees_docs_medicals_aggregate",
                "kind": "LinkedField",
                "name": "medical_list_aggregate",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": "medical_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "medical_list_expired_aggregate",
                "args": (v9/*: any*/),
                "concreteType": "hr_employees_docs_medicals_aggregate",
                "kind": "LinkedField",
                "name": "medical_list_aggregate",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": "medical_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "medical_list_mon_expiry_aggregate",
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_medicals_aggregate",
                "kind": "LinkedField",
                "name": "medical_list_aggregate",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              {
                "alias": "medical_list_2mon_expiry_aggregate",
                "args": (v14/*: any*/),
                "concreteType": "hr_employees_docs_medicals_aggregate",
                "kind": "LinkedField",
                "name": "medical_list_aggregate",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              {
                "alias": "medical_list_3mon_expiry_aggregate",
                "args": (v16/*: any*/),
                "concreteType": "hr_employees_docs_medicals_aggregate",
                "kind": "LinkedField",
                "name": "medical_list_aggregate",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              {
                "alias": "medical_list_4mon_expiry_aggregate",
                "args": (v18/*: any*/),
                "concreteType": "hr_employees_docs_medicals_aggregate",
                "kind": "LinkedField",
                "name": "medical_list_aggregate",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              {
                "alias": "warning_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_warnings_aggregate",
                "kind": "LinkedField",
                "name": "warning_list_aggregate",
                "plural": false,
                "selections": (v25/*: any*/),
                "storageKey": "warning_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "warning_list_no_expiry_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "hr_employees_docs_warnings_aggregate",
                "kind": "LinkedField",
                "name": "warning_list_aggregate",
                "plural": false,
                "selections": (v25/*: any*/),
                "storageKey": "warning_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "warning_list_expired_aggregate",
                "args": (v9/*: any*/),
                "concreteType": "hr_employees_docs_warnings_aggregate",
                "kind": "LinkedField",
                "name": "warning_list_aggregate",
                "plural": false,
                "selections": (v25/*: any*/),
                "storageKey": "warning_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "warning_list_mon_expiry_aggregate",
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_warnings_aggregate",
                "kind": "LinkedField",
                "name": "warning_list_aggregate",
                "plural": false,
                "selections": (v25/*: any*/),
                "storageKey": null
              },
              {
                "alias": "warning_list_2mon_expiry_aggregate",
                "args": (v14/*: any*/),
                "concreteType": "hr_employees_docs_warnings_aggregate",
                "kind": "LinkedField",
                "name": "warning_list_aggregate",
                "plural": false,
                "selections": (v25/*: any*/),
                "storageKey": null
              },
              {
                "alias": "warning_list_3mon_expiry_aggregate",
                "args": (v16/*: any*/),
                "concreteType": "hr_employees_docs_warnings_aggregate",
                "kind": "LinkedField",
                "name": "warning_list_aggregate",
                "plural": false,
                "selections": (v25/*: any*/),
                "storageKey": null
              },
              {
                "alias": "warning_list_4mon_expiry_aggregate",
                "args": (v18/*: any*/),
                "concreteType": "hr_employees_docs_warnings_aggregate",
                "kind": "LinkedField",
                "name": "warning_list_aggregate",
                "plural": false,
                "selections": (v25/*: any*/),
                "storageKey": null
              },
              {
                "alias": "work_permit_list_active_aggregate",
                "args": (v2/*: any*/),
                "concreteType": "hr_employees_docs_work_permits_aggregate",
                "kind": "LinkedField",
                "name": "work_permit_list_aggregate",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": "work_permit_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "work_permit_list_no_expiry_aggregate",
                "args": (v7/*: any*/),
                "concreteType": "hr_employees_docs_work_permits_aggregate",
                "kind": "LinkedField",
                "name": "work_permit_list_aggregate",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": "work_permit_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "work_permit_list_expired_aggregate",
                "args": (v9/*: any*/),
                "concreteType": "hr_employees_docs_work_permits_aggregate",
                "kind": "LinkedField",
                "name": "work_permit_list_aggregate",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": "work_permit_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "work_permit_list_mon_expiry_aggregate",
                "args": (v12/*: any*/),
                "concreteType": "hr_employees_docs_work_permits_aggregate",
                "kind": "LinkedField",
                "name": "work_permit_list_aggregate",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": null
              },
              {
                "alias": "work_permit_list_2mon_expiry_aggregate",
                "args": (v14/*: any*/),
                "concreteType": "hr_employees_docs_work_permits_aggregate",
                "kind": "LinkedField",
                "name": "work_permit_list_aggregate",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": null
              },
              {
                "alias": "work_permit_list_3mon_expiry_aggregate",
                "args": (v16/*: any*/),
                "concreteType": "hr_employees_docs_work_permits_aggregate",
                "kind": "LinkedField",
                "name": "work_permit_list_aggregate",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": null
              },
              {
                "alias": "work_permit_list_4mon_expiry_aggregate",
                "args": (v18/*: any*/),
                "concreteType": "hr_employees_docs_work_permits_aggregate",
                "kind": "LinkedField",
                "name": "work_permit_list_aggregate",
                "plural": false,
                "selections": (v26/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_teams_aggregate",
                "kind": "LinkedField",
                "name": "team_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_teams_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_departments_aggregate",
                "kind": "LinkedField",
                "name": "department_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_departments_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_job_categories_aggregate",
                "kind": "LinkedField",
                "name": "job_category_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_job_categories_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_job_positions_aggregate",
                "kind": "LinkedField",
                "name": "job_position_list_aggregate",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "default_job_positions_aggregate_fields",
                    "kind": "LinkedField",
                    "name": "aggregate",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
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
    "name": "findByIdSiteHRDashboardStatsQuery",
    "selections": (v27/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdSiteHRDashboardStatsQuery",
    "selections": (v27/*: any*/)
  },
  "params": {
    "cacheID": "c6fe722b27e0f51af30bfb1054b7c25e",
    "id": null,
    "metadata": {},
    "name": "findByIdSiteHRDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdSiteHRDashboardStatsQuery(\n  $id: bigint\n  $mon: date\n  $mon2: date\n  $mon3: date\n) {\n  default_sites_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        employee_active_list_aggregate: employee_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        employee_removed_list_aggregate: employee_list_aggregate(where: {removed: {_eq: true}}) {\n          aggregate {\n            count\n          }\n        }\n        supervisor_list_aggregate: employee_list_aggregate(where: {removed: {_eq: false}, supervisor_employee_list_aggregate: {count: {filter: {removed: {_gt: false}}, predicate: {_gt: 0}}}}) {\n          aggregate {\n            count\n          }\n        }\n        competency_list_active_aggregate: competency_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        competency_list_no_expiry_aggregate: competency_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        competency_list_expired_aggregate: competency_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        competency_list_mon_expiry_aggregate: competency_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        competency_list_2mon_expiry_aggregate: competency_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        competency_list_3mon_expiry_aggregate: competency_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        competency_list_4mon_expiry_aggregate: competency_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        contract_list_active_aggregate: contract_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        contract_list_no_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_is_null: true}}}) {\n          aggregate {\n            count\n          }\n        }\n        contract_list_expired_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_lte: \"now()\"}}}) {\n          aggregate {\n            count\n          }\n        }\n        contract_list_mon_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gt: \"now()\", _lte: $mon}}}) {\n          aggregate {\n            count\n          }\n        }\n        contract_list_2mon_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon, _lte: $mon2}}}) {\n          aggregate {\n            count\n          }\n        }\n        contract_list_3mon_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon2, _lte: $mon3}}}) {\n          aggregate {\n            count\n          }\n        }\n        contract_list_4mon_expiry_aggregate: contract_list_aggregate(where: {removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon3}}}) {\n          aggregate {\n            count\n          }\n        }\n        job_appointment_list_active_aggregate: job_appointment_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        job_appointment_list_no_expiry_aggregate: job_appointment_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        job_appointment_list_expired_aggregate: job_appointment_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        job_appointment_list_mon_expiry_aggregate: job_appointment_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        job_appointment_list_2mon_expiry_aggregate: job_appointment_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        job_appointment_list_3mon_expiry_aggregate: job_appointment_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        job_appointment_list_4mon_expiry_aggregate: job_appointment_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        counselling_list_active_aggregate: counselling_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        counselling_list_no_expiry_aggregate: counselling_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        counselling_list_expired_aggregate: counselling_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        counselling_list_mon_expiry_aggregate: counselling_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        counselling_list_2mon_expiry_aggregate: counselling_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        counselling_list_3mon_expiry_aggregate: counselling_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        counselling_list_4mon_expiry_aggregate: counselling_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        leave_list_active_aggregate: leave_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        leave_list_no_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        leave_list_expired_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        leave_list_mon_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        leave_list_2mon_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        leave_list_3mon_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        leave_list_4mon_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        license_list_active_aggregate: license_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        license_list_no_expiry_aggregate: license_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        license_list_expired_aggregate: license_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        license_list_mon_expiry_aggregate: license_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        license_list_2mon_expiry_aggregate: license_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        license_list_3mon_expiry_aggregate: license_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        license_list_4mon_expiry_aggregate: license_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        medical_list_active_aggregate: medical_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        medical_list_no_expiry_aggregate: medical_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        medical_list_expired_aggregate: medical_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        medical_list_mon_expiry_aggregate: medical_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        medical_list_2mon_expiry_aggregate: medical_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        medical_list_3mon_expiry_aggregate: medical_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        medical_list_4mon_expiry_aggregate: medical_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        warning_list_active_aggregate: warning_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        warning_list_no_expiry_aggregate: warning_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        warning_list_expired_aggregate: warning_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        warning_list_mon_expiry_aggregate: warning_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        warning_list_2mon_expiry_aggregate: warning_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        warning_list_3mon_expiry_aggregate: warning_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        warning_list_4mon_expiry_aggregate: warning_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        work_permit_list_active_aggregate: work_permit_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        work_permit_list_no_expiry_aggregate: work_permit_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        work_permit_list_expired_aggregate: work_permit_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        work_permit_list_mon_expiry_aggregate: work_permit_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        work_permit_list_2mon_expiry_aggregate: work_permit_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        work_permit_list_3mon_expiry_aggregate: work_permit_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        work_permit_list_4mon_expiry_aggregate: work_permit_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        team_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        department_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        job_category_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n        job_position_list_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "89fdc6ad25b51ef6f7d2120fe5e36346";

module.exports = node;

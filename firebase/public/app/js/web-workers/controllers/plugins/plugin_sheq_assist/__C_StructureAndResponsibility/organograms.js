//add-activity/new
(() => {
    class Controller extends AControllerAssist {
        //title, sec1
        constructor(events, db) {
            super(events, db, {singular: "Organogram", plural: "Organograms"}, "plugin_sheq_assist/StructureAndResponsibility/organograms/", "plugin_sheq_assist_StructureAndResponsibility_organograms");

            this.filter = this.filter.bind(this);

            const {addAction, filter} = this;

            addAction("list/filter", filter);

            this.setQueryWhere(company_id => {
                const list = [['company_id', '==', company_id]];
                return list;
            });

            const fn = async () => {
                const createList = () => {
                    return [
                        {
                            "id": "r13PUwLMRH3NzZ2XVxjQ",
                            "data": {
                                "user": {
                                    "lname": "Masinga",
                                    "fname": "Precious",
                                    "id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1"
                                },
                                "company_id": "4hKU3CF7tder8OhqoGrf",
                                "tbl": "plugin_sheq_assist_StructureAndResponsibility_organograms",
                                "record_name": {
                                    "plural": "Organograms",
                                    "singular": "Organogram"
                                },
                                "action": "created",
                                "record": {
                                    "id": "frR4qZ7JVSYpLfuoXlh5",
                                    "data": {
                                        "project": {
                                            "name": "SAPPI",
                                            "id": "U8JQiBs8LwLOazPXpMly"
                                        },
                                        "user_id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1",
                                        "contractor_id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1",
                                        "created_at": {
                                            "seconds": 1625730179,
                                            "nanoseconds": 775000000
                                        },
                                        "list": [{
                                                "employeeReportedTo": {
                                                    "id": "CJX1S5rUEGJpxqF6TRuU",
                                                    "lname": "Macamo",
                                                    "fname": "Dique"
                                                },
                                                "employee": {
                                                    "fname": "Willem A",
                                                    "id": "rOJvoBxaWEZwa1U7MJ2a",
                                                    "lname": "Valentin"
                                                }
                                            }],
                                        "client": {
                                            "id": "kDLFWsDccWPFqMfzianq",
                                            "name": "Mzilazembe Forestry Services"
                                        },
                                        "type": "Type",
                                        "company_id": "4hKU3CF7tder8OhqoGrf",
                                        "_target": "Site",
                                        "site": {
                                            "id": "TT6lffkBDKMcfRwBQ17g",
                                            "name": "Houtboschoek"
                                        }
                                    }
                                },
                                "created_at": 1625730179775
                            }
                        },
                        {
                            "id": "Wqka53nOyFfVvEz4pql6",
                            "data": {
                                "record_name": {
                                    "plural": "Organograms",
                                    "singular": "Organogram"
                                },
                                "company_id": "4hKU3CF7tder8OhqoGrf",
                                "record": {
                                    "id": "yeFQMNNyVJ27OjSFWYQ7",
                                    "data": {
                                        "project": {
                                            "id": "UZN5Vm1x04GUSa5LUAXn",
                                            "name": "York Timbers"
                                        },
                                        "user_id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1",
                                        "client": {
                                            "name": "Mzilazembe Forestry Services",
                                            "id": "kDLFWsDccWPFqMfzianq"
                                        },
                                        "_target": "Site",
                                        "created_at": {
                                            "seconds": 1622014704,
                                            "nanoseconds": 722000000
                                        },
                                        "site": {
                                            "name": "Longridge",
                                            "id": "id6RiBTHHLSWoXC2OxFO"
                                        },
                                        "type": "Type",
                                        "list": [{
                                                "employeeReportedTo": {
                                                    "fname": "Willem A",
                                                    "id": "rOJvoBxaWEZwa1U7MJ2a",
                                                    "lname": "Valentin"
                                                },
                                                "employee": {
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "fname": "Sipho W"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Valentin",
                                                    "id": "rOJvoBxaWEZwa1U7MJ2a",
                                                    "fname": "Willem A"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Nkumane",
                                                    "id": "aOj0wNm29rwgttncQVvu",
                                                    "fname": "Zwelile"
                                                },
                                                "employeeReportedTo": {
                                                    "lname": "Zitha",
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "fname": "Sipho W"
                                                },
                                                "employee": {
                                                    "lname": "Mnisi",
                                                    "id": "YxrHmvMw1KHCUdeGzHLq",
                                                    "fname": "Greathorn"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Nhamposse",
                                                    "id": "Vos7mmiw5UbyQEwRrQ8M",
                                                    "fname": "Aldino J"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "fname": "Sipho W"
                                                },
                                                "employee": {
                                                    "lname": "Mathumbu",
                                                    "id": "9kPyAZS1VNrjCmSVWnIb",
                                                    "fname": "Mpho S"
                                                }
                                            }, {
                                                "employee": {
                                                    "fname": "Calvin E",
                                                    "lname": "Molapo",
                                                    "id": "D1G0PfLfaHzLkkf9leyE"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "lname": "Zitha"
                                                },
                                                "employee": {
                                                    "id": "7LjSh5c0tJFIhpGCwvG8",
                                                    "fname": "Francisco A",
                                                    "lname": "Sitoie"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "lname": "Zitha",
                                                    "fname": "Sipho W"
                                                },
                                                "employee": {
                                                    "id": "yCXjluE0QwvZmXLc14XP",
                                                    "fname": "Sidwell",
                                                    "lname": "Mashego"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Nkosi",
                                                    "fname": "Kenneth",
                                                    "id": "VltbLmqPpjxXRzkYqyPe"
                                                },
                                                "employeeReportedTo": {
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "fname": "Sipho W",
                                                    "lname": "Zitha"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "fname": "Sipho W",
                                                    "lname": "Zitha"
                                                },
                                                "employee": {
                                                    "id": "dR8wuUT1V6yZst3zj52h",
                                                    "fname": "Mostah K",
                                                    "lname": "Mokoena"
                                                }
                                            }, {
                                                "employee": {
                                                    "fname": "Sibusiso L",
                                                    "lname": "Nkosi",
                                                    "id": "iYqGXFkL0msd29mhj25h"
                                                },
                                                "employeeReportedTo": {
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "fname": "Sipho W"
                                                }
                                            }, {
                                                "employee": {
                                                    "fname": "David s",
                                                    "id": "PsQoAGbwSswSlgISLlqH",
                                                    "lname": "Mashego"
                                                },
                                                "employeeReportedTo": {
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "fname": "Sipho W",
                                                    "lname": "Zitha"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Mokoena",
                                                    "id": "QBzBB6VQcMqvv1OSt4QM",
                                                    "fname": "Peter M "
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "lname": "Zitha",
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E"
                                                },
                                                "employee": {
                                                    "lname": "Mhlongo",
                                                    "fname": "Surprise",
                                                    "id": "v7hp3H1NVlNFhgo6H7bl"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "lname": "Zitha",
                                                    "fname": "Sipho W"
                                                },
                                                "employee": {
                                                    "fname": "Mpho T",
                                                    "lname": "Tshota",
                                                    "id": "EQQRYEE8hVjsooBrghKz"
                                                }
                                            }, {
                                                "employee": {
                                                    "fname": "Petros V",
                                                    "lname": "Dube",
                                                    "id": "UflGaQMQj79Vs0Ig9S0s"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "lname": "Zitha"
                                                }
                                            }],
                                        "company_id": "4hKU3CF7tder8OhqoGrf"
                                    }
                                },
                                "action": "created",
                                "created_at": 1622014704722,
                                "user": {
                                    "lname": "Masinga",
                                    "id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1",
                                    "fname": "Precious"
                                },
                                "tbl": "plugin_sheq_assist_StructureAndResponsibility_organograms"
                            }
                        },
                        {
                            "id": "dgy2pdEHGemDESfZTUf8",
                            "data": {
                                "company_id": "4hKU3CF7tder8OhqoGrf",
                                "action": "created",
                                "record": {
                                    "data": {
                                        "site": {
                                            "name": "Houtboschoek",
                                            "id": "TT6lffkBDKMcfRwBQ17g"
                                        },
                                        "project": {
                                            "name": "SAPPI",
                                            "id": "U8JQiBs8LwLOazPXpMly"
                                        },
                                        "user_id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1",
                                        "client": {
                                            "name": "Mzilazembe Forestry Services",
                                            "id": "kDLFWsDccWPFqMfzianq"
                                        },
                                        "_target": "Site",
                                        "company_id": "4hKU3CF7tder8OhqoGrf",
                                        "created_at": {
                                            "seconds": 1622009474,
                                            "nanoseconds": 633000000
                                        },
                                        "list": [{
                                                "employee": {
                                                    "id": "CJX1S5rUEGJpxqF6TRuU",
                                                    "lname": "Macamo",
                                                    "fname": "Dique"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Willem A",
                                                    "id": "rOJvoBxaWEZwa1U7MJ2a",
                                                    "lname": "Valentin"
                                                }
                                            }, {
                                                "employee": {
                                                    "id": "rOJvoBxaWEZwa1U7MJ2a",
                                                    "lname": "Valentin",
                                                    "fname": "Willem A"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "id": "CJX1S5rUEGJpxqF6TRuU",
                                                    "lname": "Macamo",
                                                    "fname": "Dique"
                                                },
                                                "employee": {
                                                    "fname": "Rodney K",
                                                    "lname": "Malatji",
                                                    "id": "z3EIufCVoAsn0VRQ9aJ9"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "lname": "Macamo",
                                                    "fname": "Dique",
                                                    "id": "CJX1S5rUEGJpxqF6TRuU"
                                                },
                                                "employee": {
                                                    "id": "udJys8giWldENXbe44mR",
                                                    "fname": "Dolfred Tshepo",
                                                    "lname": "Shebu"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "lname": "Macamo",
                                                    "id": "CJX1S5rUEGJpxqF6TRuU",
                                                    "fname": "Dique"
                                                },
                                                "employee": {
                                                    "fname": "Mfanufikile Magwevu",
                                                    "id": "9ByO74A6Daxnx6kku8X0",
                                                    "lname": "Maseko"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "lname": "Macamo",
                                                    "id": "CJX1S5rUEGJpxqF6TRuU",
                                                    "fname": "Dique"
                                                },
                                                "employee": {
                                                    "lname": "Morema",
                                                    "id": "ctb6qWc1UEbUfJabGCMB",
                                                    "fname": "Dimitri Ditebogo"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Mogane",
                                                    "id": "XCSzbhfKuTVy5fjqB30s",
                                                    "fname": "Doctor Eric"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Dique",
                                                    "lname": "Macamo",
                                                    "id": "CJX1S5rUEGJpxqF6TRuU"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "id": "CJX1S5rUEGJpxqF6TRuU",
                                                    "fname": "Dique",
                                                    "lname": "Macamo"
                                                },
                                                "employee": {
                                                    "id": "rsOX3QDUjmLgy5fv0hjG",
                                                    "lname": "Mnisi",
                                                    "fname": "Phumzile"
                                                }
                                            }, {
                                                "employee": {
                                                    "fname": "Sipho Release",
                                                    "id": "vn5RdQa0RoV906x317gk",
                                                    "lname": "Mhlongo"
                                                },
                                                "employeeReportedTo": {
                                                    "lname": "Malatji",
                                                    "id": "z3EIufCVoAsn0VRQ9aJ9",
                                                    "fname": "Rodney K"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "id": "z3EIufCVoAsn0VRQ9aJ9",
                                                    "fname": "Rodney K",
                                                    "lname": "Malatji"
                                                },
                                                "employee": {
                                                    "fname": "Samkelilso Calvin",
                                                    "lname": "Shabangu",
                                                    "id": "JLjFDd5B2HEQeG1L6cLu"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "id": "z3EIufCVoAsn0VRQ9aJ9",
                                                    "lname": "Malatji",
                                                    "fname": "Rodney K"
                                                },
                                                "employee": {
                                                    "id": "ejqJA4HexX7qDv3z5N1j",
                                                    "fname": "Thapelo",
                                                    "lname": "Dibakoane"
                                                }
                                            }, {
                                                "employee": {
                                                    "id": "E6l2S3bl8zuJLGozPIvT",
                                                    "fname": "Sandile C ",
                                                    "lname": "Ceko"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Rodney K",
                                                    "id": "z3EIufCVoAsn0VRQ9aJ9",
                                                    "lname": "Malatji"
                                                }
                                            }],
                                        "client_id": "kDLFWsDccWPFqMfzianq",
                                        "type": "Type"
                                    },
                                    "id": "w0ddemVKFcukwuMpc9Lm"
                                },
                                "created_at": 1622009474633,
                                "record_name": {
                                    "plural": "Organograms",
                                    "singular": "Organogram"
                                },
                                "tbl": "plugin_sheq_assist_StructureAndResponsibility_organograms",
                                "user": {
                                    "id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1",
                                    "fname": "Precious",
                                    "lname": "Masinga"
                                }
                            }
                        },
                        {
                            "id": "yda4hpEVqUl5inEHGYn3",
                            "data": {
                                "record_name": {
                                    "plural": "Organograms",
                                    "singular": "Organogram"
                                },
                                "user": {
                                    "fname": "Precious",
                                    "lname": "Masinga",
                                    "id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1"
                                },
                                "record": {
                                    "id": "8DG9xmSpKxFuz9yK81xr",
                                    "data": {
                                        "created_at": {
                                            "seconds": 1621950735,
                                            "nanoseconds": 86000000
                                        },
                                        "user_id": "YLlKL1hUB3QiuWrCRVISDh4i7jl1",
                                        "client_id": "kDLFWsDccWPFqMfzianq",
                                        "client": {
                                            "name": "Mzilazembe Forestry Services",
                                            "id": "kDLFWsDccWPFqMfzianq"
                                        },
                                        "site": {
                                            "id": "id6RiBTHHLSWoXC2OxFO",
                                            "name": "Longridge"
                                        },
                                        "project": {
                                            "name": "York Timbers",
                                            "id": "UZN5Vm1x04GUSa5LUAXn"
                                        },
                                        "company_id": "4hKU3CF7tder8OhqoGrf",
                                        "type": "Type",
                                        "list": [{
                                                "employee": {
                                                    "lname": "Zitha",
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E"
                                                },
                                                "employeeReportedTo": {
                                                    "lname": "Valentin",
                                                    "id": "rOJvoBxaWEZwa1U7MJ2a",
                                                    "fname": "Willem A"
                                                }
                                            }, {
                                                "employee": {
                                                    "fname": "Willem A",
                                                    "lname": "Valentin",
                                                    "id": "rOJvoBxaWEZwa1U7MJ2a"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Mnisi",
                                                    "id": "YxrHmvMw1KHCUdeGzHLq",
                                                    "fname": "Greathorn"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "lname": "Zitha"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Nhamposse",
                                                    "id": "Vos7mmiw5UbyQEwRrQ8M",
                                                    "fname": "Aldino J"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E"
                                                }
                                            }, {
                                                "employee": {
                                                    "id": "D1G0PfLfaHzLkkf9leyE",
                                                    "fname": "Calvin E",
                                                    "lname": "Molapo"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "lname": "Zitha"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "lname": "Zitha",
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E"
                                                },
                                                "employee": {
                                                    "lname": "Sitoie",
                                                    "id": "7LjSh5c0tJFIhpGCwvG8",
                                                    "fname": "Francisco A"
                                                }
                                            }, {
                                                "employee": {
                                                    "id": "9kPyAZS1VNrjCmSVWnIb",
                                                    "fname": "Mpho S",
                                                    "lname": "Mathumbu"
                                                },
                                                "employeeReportedTo": {
                                                    "fname": "Sipho W",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "lname": "Zitha"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "lname": "Zitha",
                                                    "id": "rQEnV6vp2RsXQ6VcKA2E",
                                                    "fname": "Sipho W"
                                                },
                                                "employee": {
                                                    "fname": "Zwelile",
                                                    "id": "aOj0wNm29rwgttncQVvu",
                                                    "lname": "Nkumane"
                                                }
                                            }, {
                                                "employee": {
                                                    "id": "iiSN7MHgP19frOu7u1TO",
                                                    "lname": "Hongwane",
                                                    "fname": "Solly"
                                                },
                                                "employeeReportedTo": {
                                                    "lname": "Mnisi",
                                                    "id": "YxrHmvMw1KHCUdeGzHLq",
                                                    "fname": "Greathorn"
                                                }
                                            }, {
                                                "employeeReportedTo": {
                                                    "id": "YxrHmvMw1KHCUdeGzHLq",
                                                    "fname": "Greathorn",
                                                    "lname": "Mnisi"
                                                },
                                                "employee": {
                                                    "fname": "Difference",
                                                    "lname": "Silinda",
                                                    "id": "GAU7bOd7P23HUDamqgFH"
                                                }
                                            }, {
                                                "employee": {
                                                    "lname": "Sambo",
                                                    "fname": "Neclas",
                                                    "id": "E6PHuVpyR8VACXB4Xe87"
                                                },
                                                "employeeReportedTo": {
                                                    "id": "YxrHmvMw1KHCUdeGzHLq",
                                                    "fname": "Greathorn",
                                                    "lname": "Mnisi"
                                                }
                                            }],
                                        "_target": "Site"
                                    }
                                },
                                "company_id": "4hKU3CF7tder8OhqoGrf",
                                "created_at": 1621950735086,
                                "action": "created",
                                "tbl": "plugin_sheq_assist_StructureAndResponsibility_organograms"
                            }
                        }
                    ];
                };
                const list = createList();
                await Promise.all(list.map(async item => {
                    const {record, record: {data: {created_at}}} = item.data;
                    console.log('test item 1', created_at)
                    const doc_ref = await this.getDB().collection(this.tbl).doc(record.id);

                    record.data.created_at = this.getDB().Timestamp.fromMillis(Dates.parse(created_at));
                    console.log('test item 2', record.data.created_at)
                    const updated = await doc_ref.set(record.data, {merge: true});//Promise < void >
                }));
            };
//            fn();
        }

        async create(evt, data) {
            let newItem = await this.createAndUploadIfFile(evt, data, "doc");
            newItem = await mapResults.call(this, newItem);
            return newItem;
        }

        async update(evt, id, updateAttrs) {
            let updatedData = await this.updateAndUploadIfFile(evt, id, updateAttrs, "doc");
            let updatedItem = {id, data: updatedData};
            updatedItem = await mapResults.call(this, updatedItem);
            return updatedItem.data;
        }

        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerRead.prototype.loadOnSnapshot.call(this, evt, function onChange() {

                });

                const {user, user: {data: {client: my_client, project: my_project, site: my_site}}, company, client_id, project_id, site_id} = loggedUser;
//                console.log(this.tbl, 'list all', client_id, project_id, site_id, 'count', list.length)
                if (my_client) {
                    list = list.filter(val => {
                        const {client} = val.data;
                        if (!client || client === "All")
                            return true;
                        return my_client.id === client.id;
                    });
                } else if (client_id) {
                    list = list.filter(val => {
                        const {client} = val.data;
                        if (!client || client === "All")
                            return true;
                        return client_id === client.id;
                    });
                }
                if (my_project) {
                    list = list.filter(val => {
                        const {project} = val.data;
                        if (!project || project === "All")
                            return true;
                        return my_project.id === project.id;
                    });
                } else if (project_id) {
                    list = list.filter(val => {
                        const {project} = val.data;
                        if (!project || project === "All")
                            return true;
                        return project_id === project.id;
                    });
                }
                if (my_site) {
                    list = list.filter(val => {
                        const {site} = val.data;
                        if (!site || site === "All")
                            return true;
                        return my_site.id === site.id;
                    });
                } else if (site_id) {
                    list = list.filter(val => {
                        const {site} = val.data;
                        if (!site || site === "All")
                            return true;
                        return site_id === site.id;
                    });
                }

                list = await Promise.all(list.map(mapResults.bind(this)));

                console.log('organograms', list)

                return list;
            });
        }
        // </editor-fold>

        async filter(evt, search_val) {
            return Events.whenLoggedIn(async loggedUser => {
                const {created_at, type, _target, name} = search_val;
                const q = [
                    {key: 'type', comp: '=', val: type},
                    {key: '_target', comp: '=', val: _target},
                    [
                        {key: 'client.name', comp: 'LIKE', val: name},
                        {key: 'project.name', comp: 'LIKE', val: name},
                        {key: 'site.name', comp: 'LIKE', val: name}
                    ]
                ];
                return this.filter_impl(evt, q);
            });
        }
    }

    async function mapResults(item) {
        let {
            id,
            data: {
                list,
                client, project, site, client_id, project_id, site_id
            }
        } = item;

        if (list) {
            const employees_ctrl = await Events.get('plugin_sheq_assist/employees/');
            item.data.list = await Promise.all(list.map(async ({employee_list, employee, employeeReportedTo}) => {
                const item = {};
                if (employee) {
                    item.employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, employee.id);
                }
                if (employee_list) {
//                    console.log('employee_list', employee_list)
                    item.employee_list = await Promise.all(employee_list.map(async v => {
                        if(v.employee) {
                            return v;
                        }
                        const employee = await employees_ctrl.find_by_id.call(employees_ctrl, null, v.id);
                        return {employee};
                    }));
                    item.employee_list.sort((a, b) => {
//                        console.log('sort', a.employee.data.lname, b.employee.data.lname)
                        if (a.employee.data.lname > b.employee.data.lname) {
                            return 1;
                        }
                        if (a.employee.data.lname < b.employee.data.lname) {
                            return -1;
                        }
                        return 0;
                    });
                }
                if (employeeReportedTo) {
                    item.employeeReportedTo = await employees_ctrl.find_by_id.call(employees_ctrl, null, employeeReportedTo.id);
                }
                return item;
            }));
        }

        return item;
    }

    new Controller(events, db);
})();
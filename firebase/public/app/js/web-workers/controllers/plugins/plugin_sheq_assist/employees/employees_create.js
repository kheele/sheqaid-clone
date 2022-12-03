
async function createAll(evt) {
//            var q1 = this.getDB().collection('plugin_sheq_assist_job_positions').where('company_id', '==', 'A3RpXSVOhVKnZmmjS0DJ');
//            const querySnapshot1 = await q1.get();
//            querySnapshot1.forEach(async function (doc) {
//                await doc.ref.delete();
//            });
//            var q2 = this.getDB().collection("plugin_sheq_assist_employees").where('client.id', '==', 'B6sbxhjs6FRL4knuplv3');
//            const querySnapshot2 = await q2.get();
//            querySnapshot2.forEach(async function (doc) {
//                await doc.ref.delete();
//            });

//    var q3 = this.getDB().collection("default_users").where('client.id', '==', 'YAHmbyeVGSMlq91dqq0z');
//    const querySnapshot3 = await q3.get();
//    querySnapshot3.forEach(async function (doc) {
//        if (doc.data().username !== "marvyn@forgeweld.com") {
//            await doc.ref.delete();
//        }
//    });

    const list = [
        {
            lname: "Malema",
            fname: "Thomas",
            id_num: "5505125840085",
            department: "Underground 1",
            job_position: "Ass Welder"
        },
        {
            lname: "Mosinyali",
            fname: "Solomon Balanganani",
            id_num: "6801019304083",
            department: "Underground 1",
            job_position: "Ass Welder"
        },
        {
            lname: "Seitei",
            fname: "Jacob Mothlamme",
            id_num: "6701205776088",
            department: "Boilershop",
            job_position: "Assistant"
        },
        {
            lname: "Manchidi",
            fname: "Ernest",
            id_num: "9311215987054",
            department: "BTF",
            job_position: "Boilermaker"
        },
        {
            lname: "Mamabolo",
            fname: "Mkhurana Jeremih",
            id_num: "9002195386086",
            department: "Underground 2",
            job_position: "Boilermaker"
        },
        {
            lname: "Setsumi",
            fname: "Mojalefa Joseph",
            id_num: "8603315562085",
            department: "Underground 2",
            job_position: "Boilermaker"
        },
        {
            lname: "Xulu",
            fname: "S'Khumbuzo",
            id_num: "8606215660081",
            department: "Underground 2",
            job_position: "Boilermaker"
        },
        {
            lname: "Mukhari",
            fname: "Resemathi John",
            id_num: "5209045480086",
            job_position: "Boilermaker"
        },
        {
            lname: "Surajbally",
            fname: "Reshma",
            id_num: "7501270070089",
            department: "Office",
            job_position: "Bookkeeper/Accountant"
        },
        {
            lname: "Craig",
            fname: "Esaias Renier Cronje",
            id_num: "6809165052083",
            department: "Stores",
            job_position: "Data Capturer"
        },
        {
            lname: "Nkuna",
            fname: "Judas",
            id_num: "5909205598086",
            department: "Underground 1",
            job_position: "End Fitment"
        },
        {
            lname: "Baloyi",
            fname: "Pauline",
            id_num: "6004190635082",
            department: "Office",
            job_position: "Expeditor"
        },
        {
            lname: "Lekoto",
            fname: "Johannes Matsobane",
            id_num: "7308035903087",
            department: "GRP",
            job_position: "Finisher"
        },
        {
            lname: "Mathaba",
            fname: "Jan",
            id_num: "7004255866084",
            department: "Underground 1",
            job_position: "Finisher"
        },
        {
            lname: "Surajbally",
            fname: "Vaishnauv",
            id_num: "9801166344087",
            department: "Underground 2",
            job_position: "Fitments"
        },
        {
            lname: "Hlungwani",
            fname: "Foster",
            id_num: "9511076004081",
            department: "End Flagging",
            job_position: "Flagging Operator"
        },
        {
            lname: "Kgole",
            fname: "Stephen",
            id_num: "7006036012086",
            department: "Forklift Driver",
            job_position: "Forklift Driver"
        },
        {
            lname: "Mlangeni",
            fname: "Mandla Jeremia",
            id_num: "6402095748084",
            department: "Underground 2",
            job_position: "Grinder"
        },
        {
            lname: "Mogoba",
            fname: "John Mmamong",
            id_num: "6905065548087",
            department: "Underground 2",
            job_position: "Grinder"
        },
        {
            lname: "Phora",
            fname: "Gardner Mafoko",
            id_num: "6504046014085",
            department: "Underground 2",
            job_position: "Grinder"
        },
        {
            lname: "Maoka",
            fname: "Cecil",
            id_num: "'7603095438085",
            department: "GRP",
            job_position: "GRP Assistant"
        },
        {
            lname: "Ndlovu",
            fname: "Alfred Khazamula",
            id_num: "7603215745088",
            department: "GRP",
            job_position: "GRP Assistant"
        },
        {
            lname: "Makhafola",
            fname: "Thalala Peter",
            id_num: "7101016981085",
            department: "GRP",
            job_position: "GRP Operator"
        },
        {
            lname: "Moganedi",
            fname: "Julian Jacob",
            id_num: "7906255305089",
            department: "GRP",
            job_position: "GRP Operator"
        },
        {
            lname: "Brown",
            fname: "Fiona Muriel",
            id_num: "5404220090087",
            department: "Office",
            job_position: "HR"
        },
        {
            lname: "Nundkisun",
            fname: "Darren",
            id_num: "8801075210081",
            department: "Office",
            job_position: "Jnr Production Manager"
        },
        {
            lname: "Holmes",
            fname: "Nathan",
            id_num: "1018015076087",
            department: "Underground 2",
            job_position: "Learner"
        },
        {
            lname: "Mabua",
            fname: "Peter Thabang",
            id_num: "7306136158080",
            department: "Maintenance",
            job_position: "Maintenance"
        },
        {
            lname: "Kroezen",
            fname: "Roedolph Christiaan",
            id_num: "8307275013085",
            department: "Maintenance",
            job_position: "Maintenance Officer"
        },
        {
            lname: "De Lange",
            fname: "Marietjie",
            id_num: "7305250193089",
            department: "Office",
            job_position: "Nupi Sales"
        },
        {
            lname: "Makua",
            fname: "Violet",
            id_num: "8512180793081",
            department: "Cleaning",
            job_position: "Office ass"
        },
        {
            lname: "Kroezen",
            fname: "Danie",
            id_num: "7905095021088",
            department: "Office",
            job_position: "Production Manager"
        },
        {
            lname: "Mahlafunya",
            fname: "Tumelo",
            id_num: "9003295565084",
            department: "Quality",
            job_position: "Quality Controller"
        },
        {
            lname: "Joyce",
            fname: "Marvin",
            id_num: "8804065011089",
            department: "Quality",
            job_position: "Quality Manager"
        },
        {
            lname: "Mukwevho",
            fname: "Weekly Azwifaneli",
            id_num: "8901171102081",
            department: "Office",
            job_position: "Receptionist"
        },
        {
            lname: "Motileng",
            fname: "Simon Mahlathin",
            id_num: "7101095413083",
            department: "GRP",
            job_position: "Roller"
        },
        {
            lname: "Baloyi",
            fname: "Simon",
            id_num: "8811045511081",
            department: "GRP",
            job_position: "Roller"
        },
        {
            lname: "Padi",
            fname: "Florence Mpho",
            id_num: "8802040541089",
            department: "Office",
            job_position: "Sales"
        },
        {
            lname: "Mushi",
            fname: "Frans Malesela",
            id_num: "6105295333083",
            department: "Sandblast",
            job_position: "Sandblaster"
        },
        {
            lname: "Manganye",
            fname: "Mokhachane Thomas",
            id_num: "7909225870083",
            department: "Underground 1",
            job_position: "Sandblaster"
        },
        {
            lname: "Malatji",
            fname: "Jimmy",
            id_num: "8411265380084",
            department: "Blast",
            job_position: "Spraypainter"
        },
        {
            lname: "Mthsweni",
            fname: "Johannes Sthupha",
            id_num: "6707135324089",
            department: "GRP",
            job_position: "Spraypainter"
        },
        {
            lname: "Kekana",
            fname: "David",
            id_num: "5804075891085",
            department: "Paintshop",
            job_position: "Spraypainter"
        },
        {
            lname: "Molatuli",
            fname: "Ramasike",
            id_num: "8911105846083",
            department: "Paintshop",
            job_position: "Spraypainter"
        },
        {
            lname: "Fekema",
            fname: "Hluphekile William",
            id_num: "8112315592084",
            department: "Boilershop",
            job_position: "Stores Assistant"
        },
        {
            lname: "Makhubela",
            fname: "Elias",
            id_num: "7303146099081",
            department: "Stores",
            job_position: "Stores Assistant"
        },
        {
            lname: "Mhlongo",
            fname: "Rasemake Isaac",
            id_num: "6004235602089",
            department: "Stores",
            job_position: "Stores Clerk"
        },
        {
            lname: "Chauke",
            fname: "Charles",
            id_num: "6706275339089",
            department: "Underground 1",
            job_position: "Subarc Operator"
        },
        {
            lname: "Makgeta",
            fname: "Thomas",
            id_num: "8405255618087",
            department: "Underground 1",
            job_position: "Subarc Operator"
        },
        {
            lname: "Maseka",
            fname: "Johannes",
            id_num: "8409045782088",
            department: "Underground 1",
            job_position: "Subarc Operator"
        },
        {
            lname: "Ngubane",
            fname: "Njabula Prince",
            id_num: "9004105473089",
            department: "Underground 1",
            job_position: "Subarc Operator"
        },
        {
            lname: "Shandu",
            fname: "Nkosinathi",
            id_num: "8709275398087",
            department: "Underground 1",
            job_position: "Subarc Operator"
        },
        {
            lname: "Aphane ",
            fname: "Madimetsa Jan",
            id_num: "5302035793087",
            department: "Underground 2",
            job_position: "Subarc Operator"
        },
        {
            lname: "Ndlovu",
            fname: "Salome Fikile",
            id_num: "9106050666086",
            department: "Stores",
            job_position: "Timekeeper"
        },
        {
            lname: "Maluleka",
            fname: "Edward",
            id_num: "8007175997086",
            department: "Boilershop",
            job_position: "Welder"
        },
        {
            lname: "Phiri",
            fname: "Thabiso",
            id_num: "9403185783088",
            department: "Boilershop",
            job_position: "Welder"
        },
        {
            lname: "Maoka",
            fname: "Alfred Papane",
            id_num: "7903015877085",
            department: "BTF",
            job_position: "Welder"
        },
        {
            lname: "Mofana",
            fname: "Joseph",
            id_num: "5912135472083",
            department: "GRP",
            job_position: "Welder"
        },
        {
            lname: "Nkoana",
            fname: "Thomas Tlou",
            id_num: "8007016001080",
            department: "Underground 1",
            job_position: "Welder"
        },
        {
            lname: "Nkuna",
            fname: "Patrick Nyempeni",
            id_num: "6512285415087",
            department: "Underground 1",
            job_position: "Welder"
        },
        {
            lname: "Rakgotho",
            fname: "Lekgoba Piet",
            id_num: "6209255918089",
            department: "Underground 1",
            job_position: "Welder"
        },
        {
            lname: "Sepeng",
            fname: "Emmas",
            id_num: "7707125866089",
            department: "Underground 1",
            job_position: "Welder"
        },
        {
            lname: "Tshabalala",
            fname: "Ludewick",
            id_num: "9508125141088",
            department: "Underground 1",
            job_position: "Welder"
        },
        {
            lname: "Botabota",
            fname: "Malesela Frans",
            id_num: "7801095732081",
            department: "Underground 2",
            job_position: "Welder"
        },
        {
            lname: "Mathe",
            fname: "Thomas",
            id_num: "5810275354089",
            department: "Underground 2",
            job_position: "Welder"
        },
        {
            lname: "Motshegwa",
            fname: "Rasetodo Hendrick",
            id_num: "8310275456080",
            department: "Underground 2",
            job_position: "Welder"
        },
        {
            lname: "Moyana",
            fname: "Joseph",
            id_num: "7408205502089",
            department: "Underground 2",
            job_position: "Welder"
        },
        {
            lname: "Sibiya",
            fname: "Eugene",
            id_num: "8305275668080",
            department: "Underground 2",
            job_position: "Welder"
        },
        {
            lname: "Tshivshase",
            fname: "Norman",
            id_num: "7710215465086",
            department: "Underground 2",
            job_position: "Welder"
        }
    ];

    const job_positions = await Events.get('plugin_sheq_assist/employees/job-positions/');
    let job_position_list = await job_positions.list(evt);
    const departments = await Events.get('plugin_sheq_assist/employees/departments/');
    let department_list = await departments.list(evt);

    const newD = new Date();
    job_position_list = job_position_list.filter(({data: {created_at}}) => created_at.getMonth() === newD.getMonth() && created_at.getDate() === newD.getDate());
    department_list = department_list.filter(({data: {created_at}}) => created_at.getMonth() === newD.getMonth() && created_at.getDate() === newD.getDate());
    console.log('job_position_list', job_position_list.length, job_position_list)
    console.log('department_list', department_list.length, department_list)

    const created_at = this.getDB().FieldValue.serverTimestamp();

    list.forEach(async data => {
        data.created_at = this.getDB().FieldValue.serverTimestamp();
        data.country = {code: 'ZA', name: 'South Africa', phone_code: '+27'};

        data.user_id = 'AGIUkznxQNFJKCpD5uyf';
        data.company_id = 'A3RpXSVOhVKnZmmjS0DJ';
        data.client = {id: 'YAHmbyeVGSMlq91dqq0z', name: 'Forgeweld'};
        data.client_id = 'YAHmbyeVGSMlq91dqq0z';

        data.project = {id: 'cGiWU2jvYs042tywGJ2M', name: 'Forgeweld - Factory'};
        data.project_id = 'cGiWU2jvYs042tywGJ2M';

        data.site = {id: 'F5IxPuwi0H4M1qYJy7Zs', name: 'Forgeweld - Factory'};
        data.site_id = 'F5IxPuwi0H4M1qYJy7Zs';

        data.fname = data.fname.toLowerCase().toTitleCase();
        data.lname = data.lname.toLowerCase().toTitleCase();

        if (data.department || data.job_position) {
            data.optional_info = {};
        }
        if (data.department) {
            const department = department_list.find(v => v.data.name.toLowerCase() === data.department.toLowerCase().replace("'", ""));
            if (department) {
                data.optional_info.department = {id: department.id, name: department.data.name};
            }
        }
        delete data.department;
        if (data.job_position) {
            const job_position = job_position_list.find(v => v.data.name.toLowerCase() === data.job_position.toLowerCase().replace("'", ""));
            if (job_position) {
                data.optional_info.job_position = {id: job_position.id, name: job_position.data.name};
            }
        }
        delete data.job_position;

        console.log('saving', data)
        const doc_ref = await this.getDB().collection("plugin_sheq_assist_employees").add(data);//Promise < DocumentReference < T > >
        let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
        data = doc_snapshot.data();
        const {created_at} = data;
        if (created_at && created_at.toDate) {
            data.created_at = created_at.toDate();
        }
        console.log('saved', data)
    });
//            this.getDB().collection("plugin_sheq_assist_employees").where('company_id', '==', 'A3RpXSVOhVKnZmmjS0DJ').onSnapshot(querySnapshot => {
//                querySnapshot.docChanges().forEach(async change => {
//                    const {doc} = change;
//                    await this.getDB().collection("plugin_sheq_assist_employees").doc(doc.id).delete();
//                });
//            });
}
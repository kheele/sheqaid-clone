class PluginsFuns{static async find_billable_by_id(o,i=!1){let t=await Promise.all(["plugin_sheq_assist_clients","default_companies"].map(async a=>{try{const s=await db.collection(a).doc(o);let t=await s.get();if(!t.exists)return null;const n=t.data();n.created_at&&(n.created_at=n.created_at.toDate());let e=[{id:t.id,data:n}];return e=await Promise.all(e.map(PluginsFuns.mapBillableCompanyResults.call(this,null,i))),e[0]}catch(t){return null}}));return t=t.filter(t=>!!t),t[0]}static async mapPluginsResults(t){const{id:e,data:{data:a,data:{modules:s=[]}}}=t;return s&&!s.isEmpty()&&(t.data.modules=await Promise.all(s.map(async t=>(t.company_list&&(t.company_list_keys=t.company_list.filter(t=>!!t),t.company_list=await Promise.all(t.company_list_keys.map(async t=>PluginsFuns.find_billable_by_id.call(this,t,!0))),t.company_list=t.company_list.filter(t=>!!t)),t)))),{id:e,data:a}}static mapBillableCompanyResults(y,h=!1){return async a=>{var{company_id:e,name:t,company_name:s,address:n,company_address:o,category:i,company_category:r}=a.data;if(a.data.name=s||t,a.data.address=o||n,a.data.category=r||i,e){const d=await db.collection("default_companies").doc(e);let t=await d.get();if(t.exists){const m=t.data();m.created_at&&(m.created_at=m.created_at.toDate()),a.data.consultant={id:t.id,data:m}}}if(h)return a;const u=await Events.get("plugin_sheq_assist/projects/"),c=await u.list(y);a.data.projects=c.filter(t=>{var{client:e,client_id:t}=t.data;return e?e.id===a.id:t===a.id});const l=await Events.get("plugin_sheq_assist/sites/"),p=await l.list(y);return a.data.sites=p.filter(t=>{var{client:e,client_id:t}=t.data;return e?e.id===a.id:t===a.id}),a}}}class AllUserFuns{static async createOrGetUserID(t,e,a,s){try{return await t.createUserWithEmailAndPassword(e,a).then(t=>t.user.uid).then(s)}catch(t){if("auth/email-already-in-use"!==t.code)throw console.error(t),t;{const n=functions.httpsCallable("callables-getUserUidByUsername");e=await n(e);if(e&&e.data){var{data:e}=e;return s(e,!1)}}}}static async sendCreationEmail(t,{companyName:e,username:a,password:s,fname:n,lname:o,contractorName:i,contractorUsername:r}){const u={UserCreate:()=>`<h3><b>Dear ${n+" "+o}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${a}</b></p>\n
                <p>Password is <b>${s}</b></p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                ${Utils.getAppDownloadOptionMsg()}`,UserSignup:()=>`<h3><b>Dear ${n+" "+o}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${a}</b></p>\n
                <p>The company associated with your account is <b>${e}</b></p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                <p>Best Regards<br/>SHEQ Aid</p>`,ContractorUserCreate:()=>`<h3><b>Dear ${n+" "+o}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${a}</b></p>\n
                <p>Password is <b>${s}</b></p>\n
                <p>Contractor Name: ${i}</p>\n
                <p>Contractor Email Addess: ${r}</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                ${Utils.getAppDownloadOptionMsg()}`,ContractorUserSignup:()=>`<h3><b>Dear ${n+" "+o}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${a}</b></p>\n
                <p>Contractor Name: ${i}</p>\n
                <p>Contractor Email Addess: ${r}</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>\n
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                <p>Best Regards<br/>SHEQ Aid</p>`,ContractorCreate:()=>`<h3><b>Dear ${i}</b></h3>\n
                <p>We are pleased to inform you that your account has been successfully registered on the SHEQ Aid system.</p>\n
                <p>Your Username is <b>${a}</b></p>\n
                <p>Please use <b>${a}</b> as your Username in order to set up your account.</p>\n
                <p>
                    Please keep this email for your records as it contains important information regarding your account on the SHEQ Aid.<br/>
                    You can now log in and start using the features and tools that the system offers.
                </p>
                <p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n
                <p>Thank you for choosing the SHEQ Aid system.</p>\n
                ${Utils.getAppDownloadOptionMsg({isContractor:!0})}`}[t];t={from:'"SHEQ Aid" <support@sheqsolve.com>',to:a,subject:"Welcome to SHEQ Aid",html:u()};console.log("callables-sendEmail",t);const c=functions.httpsCallable("callables-sendEmail");t=await c(t);console.log("mailRes",t)}}class QuestionnaireFuns{static hasQuestionFile(t){return QuestionnaireFuns.hasQuestionImageInQues(t)||QuestionnaireFuns.hasQuestionImageInOptions(t)}static hasQuestionImageInQues(t){return!!t&&!Object.getPathsByKey(t,"questionImage").isEmpty()}static hasQuestionImageInOptions(t){return!!t&&!Object.getPathsByKey(t,"optionImage").isEmpty()}static getQuestionImagesInQues(t){return t?Object.getPathsByKey(t,"questionImage"):null}static getQuestionImagesInOptions(t){return t?Object.getPathsByKey(t,"optionImage"):null}static unmapQuestionnaires(a,s){return async(t,e)=>{return t.questions?(t.questions=await(async t=>{const e=await Promise.all(Object.values(t).map(QuestionnaireFuns.unmapQuestionnaires(a,s)));return a?e.map(QuestionnaireFuns.createQuestionPath(a)):e})(t.questions),s&&(t.questions=await Promise.all(t.questions.map(ContractorQuestionnaireFuns.getLinkDoc))),t=QuestionnaireFuns.createQuestionPath(a)(t)):a&&(t=QuestionnaireFuns.createQuestionPath(a)(t)),(t=s&&t.linkDoc&&!t.linkDoc.id?await ContractorQuestionnaireFuns.getLinkDoc(t):t).expiry&&!isNumber(t.expiry)&&isFunction(t.expiry.toDate)&&(t.expiry=t.expiry.toDate()),t}}static createQuestionPath(a){return t=>{const e=Object.getPathByValue(a,t);return t.quesPath=e,t.idx=e.filter(t=>t.isNumeric()).map(t=>parseInt(t)+1).join("."),t}}static isQuestionFile(t){return!!t&&(!!t.answer&&("Photo"===t.questionType||"Document"===t.questionType))}static async uploadResponseFile(s,n,o,i){if(o.answer&&("Photo"===o.questionType||"Document"===o.questionType)){let t;t=isArray(o.answer)?o.answer:[o.answer],o.answer=await Promise.all(t.map(async(t,a)=>t.dlUrls?t:await files.upload.call(this,t,async t=>{let e=this.tbl+"/"+s+"/"+n+"-";return e+=i.filter(t=>t.isNumeric()).map(t=>parseInt(t)+1).join("-")+"-"+a+"/","Document"===o.questionType?e+="answers-doc/":"Photo"===o.questionType&&(e+="answers-photo/"),e+t.name}).catch(t=>{})))}return o}static async uploadQuestionFile(o,a,i){return(await Promise.all(Object.keys(a).map(async(t,e)=>{const n=a[t];return QuestionnaireFuns.hasQuestionImageInQues(n)&&await Promise.all(QuestionnaireFuns.getQuestionImagesInQues(n).map(async t=>{const e=[...t],a=Object.getValueByPath(n,t);if(null!==a&&isFile(a.questionImage)){const s=e.join("-");t=await files.upload.call(this,a.questionImage,async function(t){return this.tbl+"/"+o+"/"+i+"-"+s+"/"+t.name}.bind(this)).catch(t=>{});a.questionImage=t}return a})),QuestionnaireFuns.hasQuestionImageInOptions(n)&&await Promise.all(QuestionnaireFuns.getQuestionImagesInOptions(n).map(async t=>{const e=[...t];t.pop(),t.pop();const a=Object.getValueByPath(n,t);if(null!==a&&isArray(a.options)){const s=e.join("-");a.options=await Promise.all(a.options.filter(t=>isFile(t.optionImage)).map(async(t,e)=>{var a=await files.upload.call(this,t.optionImage,async function(t){return this.tbl+"/"+o+"/"+i+"-"+s+"--"+e+"/"+t.name}.bind(this)).catch(t=>{});t.optionImage=a}))}return a})),n}))).toObject()}}
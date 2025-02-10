import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {Document, Image, Page, PDFViewer, StyleSheet, Text, View} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
    paddingTop: 35,
    paddingBottom: 45,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
//    fontFamily: 'Roboto',
  },
  employeeName: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: 'blue'
  },
  trainingName: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: 'blue'
  },
  text: {
    margin: 12,
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
//    fontFamily: 'Roboto',
  },
  footerText: {
    margin: 12,
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
//    fontFamily: 'Roboto',
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 30,
    marginHorizontal: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'table',
  },
  header: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 15,
    textAlign: 'center',
//    fontFamily: 'Roboto',
  }
});

//Font.register({
//  family: 'Roboto',
//  src: getPDFFont('Roboto-Regular.ttf'),
//});

// Create Document Component
@observer
class MyView extends React.Component {
    render() {
        const {state: {employee, training}} = this.props;
//console.log('this.props.state.doc', doc)
//        hr: {id: hr.id, fname: hr.data.fname, lname: hr.data.lname}, 
//            allocation, job_title, course_or_module, 
//            requirement, max_participants_per_course, training_standard, training_provider_requirement, training_frequency,
//            competency_evaluation, unit_standard, credits, nqf_level, 
//            cost, certificate, certificate_expiration
//        Institution/Company, names, ID/Passport Number, Course Completed, NQF Level, Total Credits, Accreditation Number, Date Of Issue, Date Of Expiry-->
        return <React.Fragment>
            <Image style={styles.image} src=""/>
            <Text style={styles.header} fixed>{storage.loggedUser.company.data.company_name}</Text>
            <Text style={styles.title}>Certificate Of Competency</Text>
            <Text style={styles.text}>This is to certify that</Text>
            <Text style={styles.employeeName}>{employee ? (employee.data.fname + ' ' + employee.data.lname) : '........................................'}</Text>
            <Text style={styles.text}>Identity/Passport Number</Text>
            <Text style={styles.text}>{employee ? employee.data.id_num : '........................................'}</Text>
            <Text style={styles.text}>has successfully achieved competence against</Text>  
            <Text style={styles.trainingName}>{training ? training.course_or_module : '........................................'}</Text>
            <Text style={styles.text}>ETQA approval number: ............</Text>  
            <Text style={styles.text}>Aligned to Unit Standard {training ? training.unit_standard : '......'} - NQF Level {training ? training.nqf_level : '......'} - Total {training ? training.credits : '......'} Credits</Text>  
            <Text style={styles.text}>Participate in {training ? training.course_or_module : '......'} at workplace</Text>  
            <View>
                <View>
                    
                </View>
                <View>
                    <View>
                        <Text style={styles.text}>Training Director</Text> 
                        <Text style={styles.text}>....</Text> 
                    </View>
                    <View>
                        <Text style={styles.text}>Accreditation Number</Text> 
                        <Text style={styles.text}>....</Text> 
                    </View>
                    <View>
                        <View>
                            <Text style={styles.text}>IBM Ref Number</Text> 
                            <Text style={styles.text}>....</Text> 
                        </View>
                        <View>
                            <Text style={styles.text}>Date of Issue</Text> 
                            <Text style={styles.text}>....</Text> 
                        </View>
                    </View>
                </View>
            </View>
            <Text style={styles.footerText}>Issued without alteration or erasure as an original copy</Text>  
        </React.Fragment>;
    }
}

@observer
class PDFReaderInternal extends React.Component {
    static propTypes = {
        state: PropTypes.object.isRequired
    };

    render() {
        return <PDFViewer>
            <Document>
                <Page size="A4" style={styles.page} wrap>
                    <MyView {...this.props}/>
                </Page>
            </Document>
        </PDFViewer>;
    }
}

export default PDFReaderInternal;

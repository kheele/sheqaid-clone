// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import {execWhen} from 'utils/Utils';

import {Panel, styles} from 'pdf-components';

const PageWrapper = ({size, orientation, style, children}) => (
    <Page wrap size={size} orientation={orientation} style={style}>
        {children}
    </Page>
);

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos = "PageFirst";
        }, 100);
    }

    render() {
        let {
            data: {
                company, project, site
            }
        } = this.props.item;
        const {title} = this.props;

        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    placeItems: "center",
                    justifyContent: 'center',
                    fontSize: 26
                }}>
                    <Text style={{margin: '20px auto 0'}}>{title}</Text>
                    <Text style={{margin: '0px auto 20px', fontSize: '15px'}}>OF</Text>

                    {company && <Text style={{margin: '30px auto 0px'}}>COMPANY</Text>}
                    {company && <Text style={{
                        margin: '-30px auto 20px',
                        fontSize: '15px'
                    }}>{company.name || company.data.name}</Text>}

                    {project && <Text style={{margin: '30px auto 0px'}}>PROJECT</Text>}
                    {project && <Text style={{
                        margin: '-30px auto 20px',
                        fontSize: '15px'
                    }}>{project.name || project.data.name}</Text>}

                    {site && <Text style={{margin: '30px auto 0px'}}>SITE</Text>}
                    {site &&
                        <Text style={{margin: '-30px auto 0', fontSize: '15px'}}>{site.name || site.data.name}</Text>}
                </View>
            </View>
        </PageWrapper>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {

    render() {

        return <PageWrapper size="A4" style={styles.page}>
            <View fixed style={[styles.flexRow, {
                fontSize: 9,
                justifyContent: 'center',
                placeItems: "center",
                padding: '7px',
                borderTop: '4px solid #fafafa',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0
            }]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQIntel</Text>
                <Text style={{borderLeft: '4px solid #ddd', paddingLeft: 10, width: '60px'}}>Last Page</Text>
            </View>
        </PageWrapper>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Page2">
@observer
class Page2 extends React.Component {
    @observable state = {renderer: false};

    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageFirst").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "Page2";
            }, 100);
        });
    }

    render() {
        if (!this.state.renderer) return null;
        const {
            data: {
                company, project, site,
                responsible_department, responsible_person,
                expiry, internal_or_external, desc,
                category, title, doc, doc_old
            }
        } = this.props.item;

        const {showCategory} = this.props;
        const {isConsultant} = storage.is;

        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>1. {title} DETAILS</Text>
                    <View style={[styles.flexRow, styles.gridGap5]}>
                        <Panel title="Department" value={responsible_department} renderer={val => val.name}
                               colStyle={[styles.col6, {
                                   borderBottom: '4px solid #fafafa',
                                   borderRight: '4px solid #fafafa'
                               }]}/>
                        <Panel title="Responsible Person" value={responsible_person}
                               renderer={val => val.fname + ' ' + val.lname}
                               colStyle={[styles.col6, {borderBottom: '4px solid #fafafa'}]}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Expiry Date" value={expiry} type="date"
                               colStyle={[showCategory ? styles.col4 : styles.col6, {
                                   borderBottom: '4px solid #fafafa',
                                   borderRight: '4px solid #fafafa'
                               }]}/>
                        <Panel title="Internal / External?" value={internal_or_external}
                               colStyle={[showCategory ? styles.col4 : styles.col6, {
                                   borderBottom: '4px solid #fafafa',
                                   borderRight: showCategory ? '4px solid #fafafa' : 0
                               }]}/>
                        {showCategory && <Panel title="Document Category" value={category}
                                                colStyle={[styles.col4, {borderBottom: '4px solid #fafafa'}]}/>}
                    </View>
                    <View style={[styles.flexColumn]}>
                        <Panel title="Document Description" value={desc} colStyle={[styles.col12]}/>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>2. COMPANY DETAILS</Text>
                    {isConsultant && <View style={[styles.flexRow]}>
                        <Panel title="Company" value={company} renderer={val => val.name || val.data.name}
                               colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>}
                    <View style={[styles.flexRow]}>
                        <Panel title="Project" value={project} renderer={val => val.name || val.data.name}
                               colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Site" value={site} renderer={val => val.name || val.data.name}
                               colStyle={{width: '100%'}}/>
                    </View>
                </View>
            </View>
        </PageWrapper>;
    }
}

// </editor-fold>

export {
    PageFirst, PageLast, Page2
};
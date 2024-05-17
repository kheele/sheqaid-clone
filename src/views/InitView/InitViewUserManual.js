import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {UserManualDialog} from 'components/dialogs';
import {PluginsView} from 'components/page-lists';
import {Button} from "components/inputs";

@observer
class InitViewUserManual extends React.Component {

    constructor(props) {
        super(props);

		this.onManual = this.onManual.bind(this);

        this.onFilterAll = this.onFilterAll.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

	onManual(evt, el) {
		const {item} = el.props;
		let {id, data: {name, svgIconLeft, faIconLeft, borderColor, site_url}} = item;

        this.refs.userManualDialog.open(item);
	}

    onFilterAll(_) {
        const {listAll} = manualManager;
        return listAll;//.filter(({data: {active}}) => active);
    }

    renderItem(item, idx) {
		let {id, data: {name, svgIconLeft, faIconLeft, borderColor, site_url}} = item;
        
		return <div key={id} className='col-lg-2 col-md-2 col-sm-3 col-xs-4'>
			<div style={{borderColor}}>
				{!svgIconLeft && <i className={"fa fa-" + faIconLeft}/>}
				{svgIconLeft && <img src={'img/svg/' + svgIconLeft + '.svg'} className="fa fa-"/>}
				<h3>{name}</h3>
                <div className="buttons">
                    <Button className="btn btn-primary padding-h-10 font-size-13 border-radius-20" item={item} onClick={this.onManual}>View Manual</Button>
                </div>
			</div>
		</div>;
    }

    render() {
        return <>
            <PluginsView
                title=''
                onFilterAll={this.onFilterAll}
                renderModuleItem={this.renderItem}
            />
            <UserManualDialog ref="userManualDialog"/>
        </>;
    }
}

export default InitViewUserManual;

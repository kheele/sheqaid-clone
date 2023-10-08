/* eslint-disable camelcase */

import {Dates} from "utils/Dates";

export default async ({item, list, email}) => {
	const {id: loggedUserId} = storage.loggedUser.user;
	
	const {
		id, data: {
			ref_num, claim_number,
			employee
		}
	} = item;
	
	const dateRange = (list) => {
		const dates = list.map(({sender, read, msg, date}) => date).distinct();
		dates.sort();
		return `${Dates.formatDate(dates[0])} - ${Dates.formatDate(dates.getLastElement())}`;
	};
	
	const listGroup = list.groupBy(({sender, read, msg, date}) => {
		return Dates.formatDate(date);
	});
	
	const style = 'padding: 5px 10px 5px 10px; border-radius: 10px; box-shadow: 0 0 3px #ddd; line-height: 1.4; min-width: 46px; max-width: 270px';
	const timeStyle = 'width: 100%;display: block;';
	const timeSpanStyle = 'font-size: 11px; font-weight: bold; float: left;margin: 3px 0 0; padding: 1px 5px 0; background: #eee; border-radius: 10px;';
	const opts = {
		to: email,
		subject: `SHEQ Aid Chat (Ref#: ${ref_num}, Claim#: ${claim_number ? claim_number : 'N/A'}, Employee: ${employee.full_name})`,
		html: `<div style="display: grid;max-width: 300px;">
    	<div style="margin: 0 0 0px 0;">
    	    <div style="margin-bottom: 5px;padding: 5px 0; background: rgb(2,168,168);border-radius: 10px;color: #eee;">
    	        <span style="width: 70px; float: left; text-align: right; padding-right: 10px;">Ref#:</span> ${ref_num}
    	    </div>
    	    <div style="margin-bottom: 5px;padding: 5px 0; background: rgb(2,168,168);border-radius: 10px;color: #eee;">
    	        <span style="width: 70px; float: left; text-align: right; padding-right: 10px;">Claim#:</span> ${claim_number ? claim_number : 'N/A'}
    	    </div>
    	    <div style="margin-bottom: 5px;padding: 5px 0; background: rgb(2,168,168);border-radius: 10px;color: #eee;">
    	        <span style="width: 70px; float: left; text-align: right; padding-right: 10px;">Employee:</span> ${employee.full_name}
    	    </div>
    	    <div style="margin-bottom: 5px;padding: 5px 0; background: rgb(2,168,168);border-radius: 10px;color: #eee;">
    	        <span style="width: 70px; float: left; text-align: right; padding-right: 10px;">Date:</span>${dateRange(list)}
    	    </div>
    	</div>
    	<div style="display:grid;background: rgb(2,168,168); padding: 5px 10px; color: #fafafa; border-radius: 12px;">
    	    <b>${list.length} Message(s)</b>
    	</div>
    	<div style="display:grid;margin: 5px 0 10px 0;background: rgb(2,168,168);padding: 10px; border-radius: 12px;">
	      ${Object.keys(listGroup).map(key => {
					const list = listGroup[key];
					let div = `<div style="display:block;width:100%;">`;
					div += `<h4 style="margin: 5px 0 5px 0;text-align: center;color: #eee;font-size: 11px;">${key}</h4>`;
					div += list.map(({sender, read, msg, date}, n) => {
						date = Dates.formatTime(date).split(':');//.reverse();
						date.pop();
						date = date.join(':');
						let div = `<div style="display:block;width:100%;margin: ${n > 0 ? 10 : 0}px 0 0;">`;
						if (sender.uid === loggedUserId) {//right
							div += `<div style="float: right; ${style}; margin: 0 0 0 30px; background: #94d9bc;">
		             ${msg}
		             <div style="${timeStyle}">
		                <span style="${timeSpanStyle}">${date}</span>
		             </div>
		          </div>`;
						} else {//left
							div += `<div style="float: left; ${style}; margin: 0 30px 0 0; background: #e9c7c7;">
	                ${msg}
	                <div style="${timeStyle}">
	                  <span style="${timeSpanStyle}">${date}</span>
	                </div>
	            </div>`;
						}
						div += '</div>';
						return div;
					}).join('\n');
					div += '</div>';
					return div;
				}).join('\n')}
    	</div>
    	<p style="line-height:1.2;margin: 10px 0 0;">Powered By:<br/>SHEQ Aid</p>
    </div>`
	};
	
	await workers.emit.sendEmail("send-msg/sendEmail", opts);
	
	return true;
};

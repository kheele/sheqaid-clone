import {observer} from "mobx-react";
import React from "react";
import {execWhen} from "utils/UtilsFuns";

// <editor-fold defaultstate="collapsed" desc="PaymentForm">
@observer
class PaymentForm extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
//
		setTimeout(() => {
			braintree.client.create({
				authorization: "sandbox_d5z7mwpy_8mwhq93wqw6ff2js"
			}, (err, clientInstance) => {
				if (err) {
					//                console.error(err);
					return;
				}

				braintree.hostedFields.create({
					client: clientInstance,
					styles: {
						'input': {
							'font-size': '16px',
							'color': '#3A3A3A'
						},
						'input.invalid': {
							'color': 'red'
						},
						'input.valid': {
							'color': 'rgb(2,168,168)'
						},
						'.number': {
							'font-family': 'monospace'
						},
					},
					fields: {
						number: {
							selector: '#card-number',
							placeholder: '4111 1111 1111 1111'
						},
						cvv: {
							selector: '#cvv',
							placeholder: '123'
						},
						expirationDate: {
							selector: '#expiration-date',
							placeholder: '10/2022'
						}
					}
				}, (hostedFieldsErr, hostedFieldsInstance) => {
					if (hostedFieldsErr) {
						console.error(hostedFieldsErr);
						return;
					}

					execWhen(() => this.refs.form && this.refs.submit).then(() => {
						const {submit, form} = this.refs;
						submit.removeAttribute('disabled');

						form.addEventListener('submit', (event) => {
							event.preventDefault();

							hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
								if (tokenizeErr) {
									console.error(tokenizeErr);
									return;
								}

								// If this was a real integration, this is where you would
								// send the nonce to your server.
								console.log('Got a nonce: ' + payload.nonce);
							});
						}, false);
					});
				});
			});
		});
	}

	render() {
		return <div id="PaymentForm">
			<form ref="form" action="/" method="post">
				<div className="col-lg-12">
					<label class="hosted-fields--label" for="card-number">Card Number</label>
					<div id="card-number" class="hosted-field"></div>
				</div>
				<div className="col-lg-6">
					<label class="hosted-fields--label" for="expiration-date">Card Expiration Date</label>
					<div id="expiration-date" class="hosted-field"></div>
				</div>
				<div className="col-lg-6">
					<label class="hosted-fields--label" for="cvv">Card CVV</label>
					<div id="cvv" class="hosted-field"></div>
				</div>
			</form>
		</div>;
	}
}

// </editor-fold>

export default PaymentForm;
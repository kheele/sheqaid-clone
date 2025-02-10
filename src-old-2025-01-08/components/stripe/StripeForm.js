import React from "react";
import {observer} from 'mobx-react';

import {loadStripe} from '@stripe/stripe-js';
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    Elements,
    ElementsConsumer
} from '@stripe/react-stripe-js';

@observer
class Form extends React.Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(evt) {
        evt.preventDefault();

        const {stripe, elements} = this.props;
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        const payload = await this.stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardNumberElement)
        });
        console.log("[PaymentMethod]", payload);
    }

    render() {
        const {stripe, elements} = this.props;
        const options = {
            style: {
                base: {
                    fontSize: '17px',
                    color: '#666',
                    background: '#fff'
                },
                invalid: {
                    color: 'red'
                }
            }
        };
        return <div className="stripe-form row col-lg-8 pull-left-2 padding-10">
            <label className="block stripe-input">
                Card number
                <CardNumberElement options={options} onChange={event => {
                        console.log("CardNumberElement [change]", event);
        }}/>
            </label>
            <label className="col-lg-6 stripe-input">
                Expiration date
                <CardExpiryElement options={options} onChange={event => {
                            console.log("CardNumberElement [change]", event);
        }}/>
            </label>
            <label className="col-lg-6 pull-right stripe-input">
                CVC
                <CardCvcElement options={options} onChange={event => {
                                console.log("CardNumberElement [change]", event);
        }}/>
            </label>
        </div>;
    }
}

@observer
class InjectedCheckoutForm extends React.Component {

    render() {
        return <ElementsConsumer>
            {({stripe, elements}) => (
            <Form stripe={stripe} elements={elements} />
            )}
        </ElementsConsumer>;
    }
}

@observer
class StripeForm extends React.Component {
    stripePromise;

    constructor(props) {
        super(props);

        this.stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
    }

    render() {
        return <Elements stripe={this.stripePromise}>
            <InjectedCheckoutForm />
        </Elements>;
    }
}

export default StripeForm;

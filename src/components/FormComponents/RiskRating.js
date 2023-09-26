import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import styleRiskRating from "./RiskRating.lazy.css";

// <editor-fold defaultstate="collapsed" desc="RiskRating">
@observer
class RiskRating extends React.Component {

	@observable
	state = {
		lists: {
			list: []
		}
	};

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		styleRiskRating.use();
	}

	componentWillUnmount() {
		styleRiskRating.unuse();
	}

	render() {
		let {hasFrequency, selected, consequence, likelihood, frequency, readonly, name, onChange} = this.props;
		if (!selected && (consequence && likelihood)) {
			selected = {consequence, likelihood};
		}
		return <div className="RiskRating">
			<div className="RiskRatingInfo flex margin-0">
				<div className="RiskRatingInfoLeft fixed-flex padding-0">
					<div className="flex">
						<div className="RiskRatingTitles fixed-flex min-w-90">Risk Index</div>
						<div className="RiskRatingTitles fixed-flex min-w-90">Category</div>
						<div className="RiskRatingTitles fixed-flex min-w-90">Action</div>
					</div>
					<div className="flex">
						<div className="fixed-flex min-w-90 RiskRatingExtreme">&gt;15</div>
						<div className="fixed-flex min-w-90 RiskRatingExtreme">Extreme</div>
						<div className="fixed-flex min-w-90">Immediate Action</div>
					</div>
					<div className="flex">
						<div className="fixed-flex min-w-90 RiskRatingHigh">9 - 15</div>
						<div className="fixed-flex min-w-90 RiskRatingHigh">High</div>
						<div className="fixed-flex min-w-90">Requires Action</div>
					</div>
					<div className="flex">
						<div className="fixed-flex min-w-90 RiskRatingModerate">5 - 8</div>
						<div className="fixed-flex min-w-90 RiskRatingModerate">Moderate</div>
						<div className="fixed-flex min-w-90">ALARP</div>
					</div>
					<div className="flex">
						<div className="fixed-flex min-w-90 RiskRatingLow">&lt;5</div>
						<div className="fixed-flex min-w-90 RiskRatingLow">Low</div>
						<div className="fixed-flex min-w-90">Maintain Risk</div>
					</div>
				</div>
				<div className="RiskRatingInfoRight padding-0">
					{!hasFrequency &&
						<div className="RiskRatingTitleFormula min-h-40">Formula = (Likelihood * Severity)</div>}
					{hasFrequency &&
						<div className="RiskRatingTitleFormula min-h-40">Formula = (Likelihood + Frequency) / 2 *
							Severity</div>}
					<div className="flex Freq margin-l-0">
						<div className="RiskRatingTitles fixed-flex min-w-50">Freq.</div>
						<div className="padding-0">Yearly/Low exposure/Not exceeding danger level (OEL)</div>
						<div className="padding-0">Few Times a year / negligable exposure level</div>
						<div className="padding-0">Monthly / short periods of time weekly / possible to exceed OEL</div>
						<div className="padding-0">Weekly / Continuous 2 - 4 hours per shift</div>
						<div className="padding-0">Daily / Continuous / Intermettently exceeding OEL</div>
					</div>
					<div className="flex Prob margin-l-0">
						<div className="RiskRatingTitles fixed-flex min-w-50">Prob.</div>
						<div className="padding-0">Rare/Practically Impossible / Very unlikely / has not happened
							before
						</div>
						<div className="padding-0">Unlikely / Not likely to happen / Unlikely in 20 years</div>
						<div className="padding-0">Possible to happen / Could happen within 10 years</div>
						<div className="padding-0">Likely to happen at some point</div>
						<div className="padding-0">Almost certain to happen / Two or more yearly</div>
					</div>
				</div>
			</div>
			<div className="RiskRatingTable">
				<div className="flex">
					<div className="RiskRatingTitles">Fin. Loss</div>
					<div className="RiskRatingTitles">Safety</div>
					<div className="RiskRatingTitles">Health</div>
					<div className="RiskRatingTitles">Enviro.</div>
					<div className="RiskRatingTitles fixed-flex min-w-70">Severity</div>
					<RiskRatingNum name={name} likelihood={1} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingNum name={name} likelihood={2} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingNum name={name} likelihood={3} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingNum name={name} likelihood={4} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingNum name={name} likelihood={5} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&gt;R2mil<br/>Disaster</div>
					<div className="RiskRatingTypes">Multiple Fatalities</div>
					<div className="RiskRatingTypes">Permanent/Disabity with potential multiple lethal effect</div>
					<div className="RiskRatingTypes">Disastrous/Irreversible Impact</div>
					<RiskRatingNum name={name} consequence={5} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&gt;R1.5-3mil<br/>Severe</div>
					<div className="RiskRatingTypes">Single Fatality/Permanent Disability</div>
					<div className="RiskRatingTypes">Permanent Disabity with lethal effect</div>
					<div className="RiskRatingTypes">Severe Impact/Long term damage</div>
					<RiskRatingNum name={name} consequence={4} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&gt;R20K-1.5mil<br/>Moderate</div>
					<div className="RiskRatingTypes">Not Permanent Disabity / LTI</div>
					<div className="RiskRatingTypes">Serious But Reversible Health Effect</div>
					<div className="RiskRatingTypes">Significant Reversible Impact</div>
					<RiskRatingNum name={name} consequence={3} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&gt;R5K-R20K</div>
					<div className="RiskRatingTypes">Restricted/Medical Treatment Injury</div>
					<div className="RiskRatingTypes">Medical Treatment On Site</div>
					<div className="RiskRatingTypes">Moderate/Short Term Damage</div>
					<RiskRatingNum name={name} consequence={2} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&lt;R5K</div>
					<div className="RiskRatingTypes">Minor Injury / First Aid Case</div>
					<div className="RiskRatingTypes">Minor if any adverse health effect</div>
					<div className="RiskRatingTypes">Minor & Limited Impact</div>
					<RiskRatingNum name={name} consequence={1} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
			</div>
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RiskRatingNum">
@observer
class RiskRatingNum extends React.Component {

	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(e) {
		const {consequence, likelihood, selected, name, onChange, hasFrequency, readonly} = this.props;
		if (readonly) return;
		consequence && (selected.consequence = consequence);
		likelihood && (selected.likelihood = likelihood);
		onChange && onChange(selected, name, this);
	}

	@computed get selected() {
		const {consequence, likelihood, selected, hasFrequency} = this.props;
		if (selected) {
			let {
				consequence: selectedConsequence,
				likelihood: selectedLikelihood,
				frequency: selectedFrequency
			} = selected;

			const likelihoodLetters = ['A', 'B', 'C', 'D', 'E'];
			selectedLikelihood = isNumber(selectedLikelihood) ? selectedLikelihood : (likelihoodLetters.indexOf(selectedLikelihood) + 1);
			return selectedConsequence === consequence || selectedLikelihood === likelihood;
		}
	}

	render() {
		const {consequence, likelihood, hasFrequency} = this.props;
		let className = "RiskRatingNums fixed-flex";
		if (consequence) {
			className += " consequence min-w-70";
		} else if (likelihood) {
			className += " likelihood min-w-40";
		}
		if (this.selected) {
			className += " active";
		}
		return <div className={className} onClick={this.onClick}>{consequence || likelihood}</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RiskRatingScore">
@observer
class RiskRatingScore extends React.Component {

	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(e) {
		const {consequence, likelihood, selected, name, onChange, hasFrequency, readonly} = this.props;
		if (readonly) return;
		selected.consequence = consequence;
		selected.likelihood = likelihood;
		onChange && onChange(selected, name, this);
	}

	@computed get selected() {
		const {consequence, likelihood, selected} = this.props;
		if (selected) {
			let {
				consequence: selectedConsequence,
				likelihood: selectedLikelihood,
				frequency: selectedFrequency,
				hasFrequency
			} = selected;

			if ('likelihood' in selected) {
//                const likelihoodLetters = ['A', 'B', 'C', 'D', 'E'];
//                selectedLikelihood = isNumber(selectedLikelihood) ? selectedLikelihood : (likelihoodLetters.indexOf(selectedLikelihood) + 1);

//                if(!isNumber(selectedLikelihood)) return false;

				let scoreActual;
				if (hasFrequency) {
					scoreActual = ((likelihood + selectedFrequency) / 2) * consequence;
				} else {
					scoreActual = likelihood * consequence;
				}
//                console.log('-------------------------------')
//                console.log('likelihood', likelihood, '=', selectedLikelihood)
//                console.log('consequence', consequence, '=', selectedConsequence)
//                console.log('scoreActual', scoreActual, '=', Math.round(scoreActual))

				const scoreWhole = likelihood * consequence;
//                console.log('scoreWhole', scoreWhole, '=', Math.round(scoreActual))
				return (consequence === selectedConsequence && likelihood === selectedLikelihood) && Math.round(scoreActual) === scoreWhole;
			} else {
				return (consequence === selectedConsequence && likelihood === selectedLikelihood);
			}

		}
	}

	@computed get value() {
		const {consequence, likelihood, hasFrequency} = this.props;
		const score = likelihood * consequence;
		let className = "fixed-flex min-w-40 RiskRatingPoint";
		if (score > 15) {
			className += " RiskRatingExtreme";
		} else if (score >= 9 && score <= 15) {
			className += " RiskRatingHigh";
		} else if (score >= 5 && score <= 8) {
			className += " RiskRatingModerate";
		} else if (score < 5) {
			className += " RiskRatingLow";
		}

		if (this.selected) {
			className += " active";
		}
		return {score, className};
	}

	render() {
		const {score, className} = this.value;
		return <div className={className} onClick={this.onClick}>{score}</div>;
	}
}

// </editor-fold>

export default RiskRating;
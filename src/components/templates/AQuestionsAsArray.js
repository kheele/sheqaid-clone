import React, {lazy, Suspense} from 'react';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {CircularProgress, Grid} from '@material-ui/core';

import {scrollTo} from 'utils/Utils';

import NavItem from '../navs/NavItem';
import Popover from '../popovers/Popover';
import SelectEmployeesDialog from './SelectEmployeesDialog';
import PageLoadingProgress from '../PageLoadingProgress';

import ProfileDocTemplateDialog from 'views/plugins/plugin_extra/__B_Contractors/forms/ProfileDocTemplateDialog';

import UploadDialog from './UploadDialog';
import SelectTemplateDocDialog from './SelectTemplateDocDialog';

import FormHeader from './FormHeader';
import FormBody from './FormBodyAsArray';

const TitlePage = lazy(() => import('./TitlePageAsArray'/* webpackChunkName:"Templates.TitlePageAsArray" */));

@observer
class AQuestions extends React.Component {

	style;
	@observable visibilityState = {
		value: null
	};

	constructor(props, style) {
		super(props);

		this.style = style;

		this.scrollTo = scrollTo.bind(this);
		this.onFormOpen = this.onFormOpen.bind(this);

		this.clearQuestions = this.clearQuestions.bind(this);
		this.setQuestions = this.setQuestions.bind(this);
		this.addMoreSectionField = this.addMoreSectionField.bind(this);
		this.addMoreQuestionField = this.addMoreQuestionField.bind(this);

		this.onSelectNotified = this.onSelectNotified.bind(this);
		this.onSelectItemSelectNotified = this.onSelectItemSelectNotified.bind(this);
		this.renderItemSelectNotified = this.renderItemSelectNotified.bind(this);

		this.onUploadDialog = this.onUploadDialog.bind(this);
		this.onSelectTemplateDocDialog = this.onSelectTemplateDocDialog.bind(this);
		this.onViewTemplateDocDialog = this.onViewTemplateDocDialog.bind(this);
	}

	componentWillMount() {
		this.style.use();
	}

	async componentDidMount() {
		const {item} = this.props;
		if(this.state) {
			this.state.item = item;
		}

		await this.defaultQuestionList();
		this.state.loadingFormData = false;
	}

	componentWillUnmount() {
		this.style.unuse();
	}

	onVisibilityChange(visibility) {
		this.visibilityState.value = visibility;
	}

	@computed
	get itemData() {
		const {item} = this.state || this.props;
		return (item ? item.data : item) || {};
	}

	async defaultQuestionList() {
		const {defaultDocTitle, defaultType} = this.props;
		const {itemData: formData} = this;
		if (!this.isTitlePage) {
			if (formData && formData.question_list) {
				let {type, name, desc, question_list} = formData;

				console.log('question_list', name, question_list.length);
				question_list.isEmpty() && (question_list = [this.defaultQuestion]);
				this.state.formData = {type, name, desc, question_list};
			} else {
				this.state.formData = {
					type: defaultType || null,
					name: defaultDocTitle || 'Untitled Template',
					desc: '',
					question_list: [this.defaultQuestion]
				};
			}
		} else if (this.isTitlePage) {
			if (formData && formData.page_title_list) {
				let {type, page_title_list} = formData;

				console.log('page_title_list', page_title_list.length);
				page_title_list.isEmpty() && (page_title_list = this.defaultQuestions);
				this.state.formData = {type, question_list: page_title_list};
			} else {
				this.state.formData = {type: 'Title Page', question_list: this.defaultQuestions};
			}
		}
	}

	get defaultQuestion() {
		return {
			is_page_title: this.is_page_title,
			questionText: "",
			questionImage: null,
			linkDoc: null,
			score: null,
			maxScore: null,
			isMandatory: false,
			isMultiAnswer: false,
			hasExpiry: false,
			hasResponseAttachment: false,
			responseAttachmentRequired: false,
			responseAttachment: null,
			expiry: null,
			notify: false,
			notifyAction: null,
			notified_list: [],
			questionType: "Yes,No,N/A",
			open: true
		};
	}

	get defaultSection() {
		return {
			is_page_title: this.is_page_title,
			questionText: '',
			linkDoc: null,
			open: true,
			question_list: [this.defaultQuestion]
		};
	}

	clearQuestions(evt, btn) {
		const {isSection, formData} = btn.props;
		if (isSection) {
			formData.question_list = [this.defaultQuestion];
		} else {
			this.defaultQuestionList();
		}
	}

	setQuestions(question_list) {
		this.state.formData.question_list.pushAll(question_list);
	}

	addMoreImpl(evt, btn, val) {
		const {getDialogDOM} = this.props;
		const {isSection, formData} = btn.props;

		const {formBody} = this.refs;
		const scroll = () => {
			setTimeout(() => {
//                const jq = $(btn.getDOMNode()).closest('.h-full').children('[data-rbd-droppable-id="droppable"]').children(':last-of-type');
//                console.log('addMoreImpl', jq[0])
//                const scrollTop = jq.height() + jq.offset().top;
//                $(getDialogDOM().querySelector('.dialog-content')).animate({scrollTop}, 1500, () => {
//                    jq.css('border', '2px solid red')
//                });
			}, 500);
		};
		if (isSection) {
			setTimeout(() => {
				formData.question_list.forEach(q => q.open = false);
				formData.question_list.pushAll(val);
				scroll();
			}, 0);
		} else {
			formBody.listRef.expandCloseAll().then(() => {
				this.setQuestions(val);
				scroll();
			});
		}
	}

	addMoreSectionField(evt, btn) {
		this.addMoreImpl(evt, btn, this.defaultSection);
	}

	addMoreQuestionField(evt, btn) {
		this.addMoreImpl(evt, btn, this.defaultQuestion);
	}

	onSelectNotified(evt, ques) {
		return new Promise((resolve, reject) => {
			const list = ques.questionType.split(',');
			this.refs.popover.ques = ques;
			this.refs.popover.onDone = resolve;
			this.refs.popover.settings({
				style: {minWidth: 200},
				fixedCenter: true,
				isDialog: true,
				contentNode: <div>
					<h4>Notify If Answer Is:</h4>
					{list.map(this.renderItemSelectNotified)}
				</div>
			}).open();
		});
	}

	onSelectItemSelectNotified(e, elem) {
		const {item} = elem.props;
		const {ques, onDone} = this.refs.popover;
		this.refs.selectEmployeesDialog.open(ques.notified_list).then(list => {
			onDone({notifyAction: item, list});
		});
	}

	renderItemSelectNotified(item, n) {
		return <NavItem key={item} item={item} onClick={this.onSelectItemSelectNotified} title={item}/>;
	}

	onUploadDialog(type) {
		const {readonly} = this.props;
		if (readonly) return Promise.resolve();
		return this.refs.uploadDialog.open(type);
	}

	onSelectTemplateDocDialog() {
		const {readonly} = this.props;
		if (readonly) return Promise.resolve();
		return this.refs.selectTemplateDocDialog.open();
	}

	onViewTemplateDocDialog(ques) {
		this.refs.viewTemplateDocDialog.open(ques.linkDoc);
	}

	onFormOpen(evt, el) {
		const jq = $(evt.target);
		let currRow = jq.closest('.TitlePage');
		if (currRow.length === 0) {
			currRow = jq.closest('.FormBody');
		}

		if (currRow.hasClass('active')) {
			currRow.removeClass('active');
		} else {
			const curr = currRow.addClass('active');
			currRow.prevAll("div").removeClass('active');
			currRow.nextAll("div").removeClass('active');
			this.scrollTo(curr);
		}
	}

	get isTitlePage() {
		return this.key === 'TitlePage';
	}

	render() {
		const {
			readonly,
			item,
			defaultTitlePageQuestions,
			mainTitle,
			defaultType,
			getDialogDOM,
			isLibrary,
			isEditting,
			isPrivate
		} = this.props;
		const {loadingFormData, formData} = this.state;
		const isTitlePage = this.isTitlePage;
		const className = isTitlePage ? "margin-t-15 margin-b-15 TitlePage" : "Questions";
		return <div className={"hor-center " + className}>
			<Grid container direction="column" justify="center" alignItems="center">
				{loadingFormData && <CircularProgress/>}
				{!loadingFormData && <Grid item>
					{!isTitlePage && <FormHeader formData={formData} readonly={readonly} mainTitle={mainTitle}/>}
					{!isTitlePage && <Suspense fallback={<PageLoadingProgress/>}>
						<TitlePage
							ref="titlePage"
							isEditting={isEditting}
							getDialogDOM={getDialogDOM}
							defaultQuestions={defaultTitlePageQuestions}
							item={item}
							readonly={readonly}
							onFormOpen={this.onFormOpen}/>
					</Suspense>}
					<FormBody
						ref="formBody"
						defaultType={defaultType}
						isTitlePage={isTitlePage}
						formData={formData}
						clearQuestions={this.clearQuestions}
						addMoreSectionField={this.addMoreSectionField}
						addMoreQuestionField={this.addMoreQuestionField}
						onSelectNotified={this.onSelectNotified}
						onUploadDialog={this.onUploadDialog}
						onSelectTemplateDocDialog={this.onSelectTemplateDocDialog}
						onViewTemplateDocDialog={this.onViewTemplateDocDialog}
						onFormOpen={this.onFormOpen}
						visibilityState={this.visibilityState}
						isLibrary={isLibrary}
						isPrivate={isPrivate}
						readonly={readonly}/>
				</Grid>}
			</Grid>
			<Popover key="popover" ref="popover"/>
			<ProfileDocTemplateDialog ref="viewTemplateDocDialog"/>
			<SelectEmployeesDialog ref="selectEmployeesDialog"/>
			{!readonly && <SelectTemplateDocDialog ref="selectTemplateDocDialog"/>}
			{!readonly && <UploadDialog ref="uploadDialog"/>}
		</div>;
	}
}

export default AQuestions;//221
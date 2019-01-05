/**
 * Email Detail
 */
import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input, InputGroupText, UncontrolledTooltip, Label } from 'reactstrap';
import { connect } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import { withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Avatar from '@material-ui/core/Avatar';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';

// redux actions
import { hideLoadingIndicator, onNavigateToEmailListing, onDeleteEmail } from 'Actions';

//Intl Message
import IntlMessages from 'Util/IntlMessages';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import $ from 'jquery';
import axios from 'axios';
import ReplyComponent from './ReplyComponent';
import ForwordComponent from './ForwordComponent';
import RequestedDocReply from './RequestedDocReply';

let BaseUrl = 'http://localhost:3001/';

const emaills = [{

	"_id": "5c18cf7ea6150c3234f5315d",
	"total_emails": 1,
	"subject": "testing again",
	"mail_type": "very_important",
	"emails":
		[{
			"id": "1",
			"to": [{
				"seen": 0,
				"receive_mail_type": "Direct",
				"_id": "5c0e35b551a9e62c1459d693",
				"first_name": "admin",
				"email_id": "admin@gmail.com"
			}],
			"cc": [],
			"bcc": [],
			"froms": {
				"id": "5c0e35b551a9e62c1459d693",
				"username": "sunil",
				"email_id": "sunil@gmail.com"
			},
			"message": "<p>Hii admin how r u</p>",
			"create_Date": "Dec 14 2018",
			"create_Time": "10:46 AM"
		},
		{
			"id": "2",
			"parent_id": "1",
			"to": [{
				"seen": 0,
				"receive_mail_type": "Direct",
				"_id": "5c0e35b551a9e62c1459d693",
				"first_name": "admin",
				"email_id": "admin@gmail.com"
			}],
			"cc": [],
			"bcc": [],
			"froms": {
				"id": "5c0e35b551a9e62c1459d693",
				"username": "admin",
				"email_id": "admin@gmail.com"
			},
			"message": "<p>I am fine</p>",
			"create_Date": "Dec 14 2018",
			"create_Time": "10:46 AM"
		},
		{
			"id": "3",
			"parent_id": "2",
			"to": [{
				"seen": 0,
				"receive_mail_type": "Direct",
				"_id": "5c0e35b551a9e62c1459d693",
				"first_name": "admin",
				"email_id": "admin@gmail.com"
			}],
			"cc": [],
			"bcc": [],
			"froms": {
				"id": "5c0e35b551a9e62c1459d693",
				"username": "sunil",
				"email_id": "sunil@gmail.com"
			},
			"message": "<p>Where are you</p>",
			"create_Date": "Dec 14 2018",
			"create_Time": "10:46 AM"
		},
		{
			"id": "4",
			"parent_id": "3",
			"to": [{
				"seen": 0,
				"receive_mail_type": "Direct",
				"_id": "5c0e35b551a9e62c1459d693",
				"first_name": "admin",
				"email_id": "admin@gmail.com"
			}],
			"cc": [],
			"bcc": [],
			"froms": {
				"id": "5c0e35b551a9e62c1459d693",
				"username": "admin",
				"email_id": "admin@gmail.com"
			},
			"message": "<p>I am  out of town</p>",
			"create_Date": "Dec 14 2018",
			"create_Time": "10:46 AM"
		}]

}]

class EmailDetail extends Component {
	constructor(props) {
		super(props);
		console.log('this is props', this.props)
		this.state = {
			isSimpleMailStatus: false,
			isRequestMailStatus: false,
			isRequestMailReplyStatus: false,
			replyStatus: false,
			forwordStatus: false,
			footerButtonStatus: true,
			show: false,
			showSec: true,
			showTyping: false,
			activeUserTyping: "",
			messages: { from: '', message: '' },
			from: {},
			msgArr: [],
			currentMailData: { mail_type: '', subject: '' },
			emaiilDatailsData: { froms: { username: '', email_id: '' }, message: '', create_Date: '', create_Time: '' },
			emaiilDatailsData1:[],
			makeReplyFormdata: { root_mail_id: '', subject: '', mail_type: '' },
			makeForwordFormdata: { subject: '', message: '', fromEmailId: '', mail_type: '' },
			makeRequestedDocReplyFormData: { subject: '', froms: { username: '', email_id: '' }, emails: { docName: '', create_Date: '', create_Time: '' } },
			/*START REPLY FOR REQUESTED DOCUMENT */
			actualFilenameState: '',
			to: [],
			mail_type: 'important',
			froms: {},
			subject: '',
			docName: '',
			snackbar: false,
			successMessage: ''
			/*END REPLY FOR REQUESTED DOCUMENT */
		}
		this.showDiv = this.showDiv.bind(this)
		this.showDivSec = this.showDivSec.bind(this)
		this.openQuestion = this.openQuestion.bind(this);
	}
	showDiv = () => {
		const { show } = this.state;
		this.setState({ show: !show });
	}
	showDivSec = () => {
		const { showSec } = this.state;
		this.setState({ showSec: !showSec });
	}
	componentDidMount() {
		alert(this.props.match.params.id)
		let email_id = this.props.match.params.id;
		let myid = this.props.match.params.myid;

		if (email_id) {
			axios.get(BaseUrl + 'api/composemail/' + email_id)
				.then(res => {
					this.setState({ currentMailData: res.data });
					if (res.data.isRequestMail === 1) {
						this.setState({ isRequestMailStatus: true })
					}
					if (res.data.isRequestMailReply === 1) {
						this.setState({ isRequestMailReplyStatus: true })
					}
					if (res.data.isRequestMail === 0 && res.data.isRequestMailReply === 0) {
						this.setState({ isSimpleMailStatus: true })
					}
					this.setState({ emaiilDatailsData: res.data.emails });
					this.setState({ emaiilDatailsData1: res.data.emails });
					
					this.setState({ makeReplyFormdata: { root_mail_id: this.props.match.params.id, subject: res.data.subject, mail_type: res.data.mail_type } })

					//this.setState({ to: res.data.emails.froms });
					//let finalTo = [];
					//finalTo.push({ "seen": 0, "_id": res.data.emails.froms.id, "first_name": res.data.emails.froms.username, "email_id": res.data.emails.froms.email_id })
					//this.setState({ to: finalTo })
					//this.setState({ makeRequestedDocReplyFormData: { subject: res.data.subject, froms: res.data.emails.froms, emails: { docName: res.data.emails.docName, create_Date: res.data.emails.create_Date, create_Time: res.data.emails.create_Time } } })
					
					//this.setState({ makeForwordFormdata: { subject: res.data.subject, message: res.data.message, fromEmailId: res.data.froms.id, mail_type: res.data.mail_type } })
				});
		}
		this.setState({ froms: this.props.fromsData.froms })
		this.changeSeenStatus(email_id, myid);
		this.uploadDefPdfFun();

		//this.replyApiCalled();
	}
	replyApiCalled() {
		alert('not called')
		let root_id = "5c236cd52eab05209c1cbe14";
		let parent_id = "200";
		let to = [
			{
				"seen": 0,
				"receive_mail_type": "Direct",
				"_id": "5c0e355d51a9e62c1459d690",
				"first_name": "admin",
				"email_id": "admin@gmail.com"
			}
		];
		let froms = {
			"id": "5c0e359851a9e62c1459d692",
			"username": "sunil",
			"email_id": "s@gmail.com"
		};
		let mail_type = "very_important";
		let subject = "test seen";
		let message = "this is reply for new";
		let type = "reply";

		axios.put(BaseUrl + 'api/composemail/replyApi/' + root_id, { parent_id, to, froms, type, mail_type, subject, message }) //API FOR INSERT
			.then((result) => {
				this.setState({
					snackbar: true,
					sectionReload: false,
					successMessage: 'Mail Sended Successfully'
				});
				this.props.history.push("/app/email_client/folder/inbox")
			});
	}

	openQuestion(index) {
		// when a question is opened, compare what was clicked and if we got a match, change state to show the desired question.
		this.setState({
			selectedQuestion: (this.state.selectedQuestion === index ? -1 : index)
		});
	}
	//FUNCTIION FOR CHANGE SEEN STATUS
	changeSeenStatus(email_id, myid) {
		if (email_id && myid) {
			axios.put(BaseUrl + 'api/composemail/changeSeenStatus/' + email_id, { email_id, myid }) //API FOR UPDATE
				.then((result) => {
					console.log('seen');
				});
		}
	}

	componentWillMount() {
		this.getEmailDetails();
		$('.searchDivCls').show();
	}

	/**
	 * Get Email Details By Id
	 */
	getEmailDetails() {
		let self = this;
		setTimeout(() => {
			this.props.hideLoadingIndicator();
		}, 1500);
	}

	/**
	 * On Back Press Naviagte To Email Listing Page
	 */
	onBackPress() {
		const { history } = this.props;
		this.props.onNavigateToEmailListing();
		history.goBack();
	}

	/**
	 * On Delete Email
	 */
	onDeleteEmail() {
		const { history } = this.props;
		this.props.onDeleteEmail();
		history.goBack();
	}
	replyFun(id) {
		this.setState({ replyStatus: true, footerButtonStatus: false });
	}
	forwordFun() {
		this.setState({ forwordStatus: true, footerButtonStatus: false });
	}

	/***********************************Add Debriefing PDF SECTION FUNCTIONS START*********************************/
	uploadDefPdfFun() {
		let that = this;
		$(document).ready(function () {
			var ajaxCall;
			$(document).on('click', '.upload-btn', function () {
				$('.block4').hide();
				$('.progressCss ').css({ 'margin-top': '14px' });
				$('.actualfileNameCls').text('');
				that.setState({ actualFilenameState: '' });
				that.setState({ subject: '' });
				$('.delete_Pdf').html('');
				$('#upload-input').click();
				$('.progress-bar').text('0%');
				$('.progress-bar').width('0%');
			});
			$(document).on('change', '#upload-input', function () {
				$('.block3').show();
				$('.parent>div').css({ background: '#f5f5f5' });
				var files = $(this).get(0).files;
				var fileSize = ($("#upload-input")[0].files[0].size / 1024 / 1024);
				var actualFilename = this.value.match(/[^\\\/]+$/, '')[0];
				that.setState({ actualFilenameState: actualFilename });
				that.setState({ subject: 'Faisal has attached your requested file ' + actualFilename })
				$('.actualfileNameCls').text(actualFilename + '' + '(' + fileSize + 'k)');
				$('.defPdfErrorCls').text('');
				if (fileSize > 200) {
					alert("Only allowed less then 200 MB file");
					return false;
					$('#upload-input').val('');
				}
				if (files.length > 0) {
					// create a FormData object which will be sent as the data payload in the
					// AJAX request
					var formData = new FormData();

					// loop through all the selected files and add them to the formData object
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						var filenames = file.name;
						var fileExtension = ['gif', 'png', 'jpg', 'jpeg', 'doc', 'pdf', 'xlsx'];
						if ($.inArray(file.name.split('.').pop().toLowerCase(), fileExtension) == -1) {
							alert("this format is not allowed.");
							$('#upload-input').val(''); // Clean field
							$('.actualfileNameCls').text('');
							that.setState({ actualFilenameState: '' });
							that.setState({ subject: '' });
							return false;
						}
						// add the files to formData object for the data payload
						formData.append('uploads', file, file.name);

					}

					ajaxCall = $.ajax({
						url: BaseUrl + 'api/composemail/uploadRequestDoc',
						type: 'POST',
						data: formData,
						processData: false,
						contentType: false,
						success: function (data) {
							console.log('upload successful!\n' + data.msg);
							console.log('upload successful!\n' + data.file);
							that.setState({ docName: data.file });
							$('#upload-input').val('');
							$('.block3').hide();
							$('.block4').show();
							//$('.cancel_div').hide();
							//$('.uploadDefPdfDivCls').hide();
							$('.progressCss').css({ 'margin-top': '14px' });
							$('.delete_Pdf').html('<a href="javascript:void(0)" class="close-icon1" file="' + data.file + '" id="delete_Pdf"></a>');
						},
						xhr: function () {
							// create an XMLHttpRequest
							var xhr = new XMLHttpRequest();

							// listen to the 'progress' event
							xhr.upload.addEventListener('progress', function (evt) {

								if (evt.lengthComputable) {
									// calculate the percentage of upload completed
									var percentComplete = evt.loaded / evt.total;
									percentComplete = parseInt(percentComplete * 100);
									$('.progress').show();
									$('.cancel_div').show();

									// update the Bootstrap progress bar with the new percentage
									$('.progress-bar').text(percentComplete + '%');
									$('.progress-bar').width(percentComplete + '%');

									// once the upload reaches 100%, set the progress bar text to done
									if (percentComplete === 100) {
										$('.progress-bar').html('Done');
									}

								}

							}, false);

							return xhr;
						}
					});

				}
			});

			$(document).on('click', '.stopDefPdfUpload', function (e) {
				ajaxCall.abort();
				$('.parent>div').css({ background: 'white' });
				$('.progress').hide();
				$('#upload-input').val('');
				$('.actualfileNameCls').text('');
				that.setState({ actualFilenameState: '' });
				that.setState({ subject: '' });
				$('.cancel_div').hide();
				console.log("Canceled");
			});

			$(document).on('click', '#delete_Pdf', function () {
				$('.parent>div').css({ background: 'white' });
				$(this).attr('href', 'javascript:void(0)');
				$(this).html("deleting..");
				var file = $(this).attr("file");
				$.ajax({
					url: BaseUrl + 'api/composemail/deleteRequestDoc/' + file,
					type: 'GET',
					data: {},
					success: function (res) {
						$('.progress').hide();
						$('#upload-input').val('');
						$('.actualfileNameCls').text('');
						that.setState({ actualFilenameState: '' });
						that.setState({ subject: '' });
						$('.defPdfCls').hide();
						$('.delete_Pdf').html('');
						$('.uploadDefPdfDivCls').show();
						that.setState({ docName: '' });
						//showMsg("alert alert-danger", "File deleted successfully!")
					}
				});
			});

		});
	}
	/* FUNCTION FOR SET VALIDATION */
	setValidation() {
		let formIsValid = true;

		if (!this.state.actualFilenameState) {
			formIsValid = false;
			this.setState({ defPdfError: true })
		}
		else {
			this.setState({ defPdfError: false })
		}
		return formIsValid;
	}
	/* FUNCTION FOR SUBMIT RECORDS(INSERT & UPDATE) */
	handleRequestDocReply = (e) => {
		e.preventDefault();
		if (this.setValidation()) {
			this.setState({ sectionReload: true });
			//setTimeout(() => {

			const { mail_type, to, subject, froms, docName, isRequestMail } = this.state;
			let isRequestMailReply = 1;

			console.log('the doc sssssssssss', isRequestMailReply, mail_type, subject, to, froms, docName)
			axios.post(BaseUrl + 'api/composemail', { isRequestMailReply, mail_type, subject, to, froms, docName }) //API FOR INSERT
				.then((result) => {
					this.setState({
						snackbar: true,
						sectionReload: false,
						modal: false,
						successMessage: 'Record Inserted Successfully'
					});
				});

			//}, 1500);
			setTimeout(() => { this.props.history.push("/app/email_client/folder/inbox") }, 2500);
		}
		else {
			this.setState({ formErrorAlert: true })
		}
	}
	render() {
		const { currentEmail, loading } = this.props;
		const { makeReplyFormdata, makeForwordFormdata, makeRequestedDocReplyFormData } = this.state;
		if (loading) {
			return (
				<RctSectionLoader />
			)
		}
		return (
			<div className="email-detail-page-warrper">
				{console.log('makeReplyFormdata makeReplyFormdata', makeReplyFormdata)}
				{this.state.isSimpleMailStatus &&
					<div>
						{this.state.currentMailData !== null &&
							<div>
								<div className="top-head d-flex justify-content-between align-items-center">
									<IconButton onClick={() => this.onBackPress()}>
										<ArrowBackIcon />
									</IconButton>
									<h2 className="mb-0 text-capitalize w-75 d-flex align-items-center">{this.state.currentMailData.subject}</h2>
									<div className="wself-70 ">
										{/*{this.getTaskLabelNames(currentEmail.email_labels)}*/}
										<ul className="maildetail_ul email_detail_header_common_cls">
											<li id="UncontrolledTooltipExample">
												<i class="fa fa-flag-o" style={{ color: 'orange' }}></i>&nbsp;
												Orange
											</li>
											<li>
												<i class="fa fa-envelope-o" style={{ color: '#808080' }}></i>&nbsp;
												Marks as unread
											</li>
											<li>
												<i class="fa fa-download" style={{ color: '#808080' }}></i>&nbsp;
												Archive
											</li>
											<li>
														|
											</li>
											<li>CC out</li>
										</ul>
									</div>
								</div>
								{this.state.emaiilDatailsData1 && this.state.emaiilDatailsData1.map((results, index, arrr) => (
									<div key={`item-${index}`} className={arrr.length - 1 === index ? 'open' : `item ${this.state.selectedQuestion === index ? 'open' : ''}`}>
										<div className="outside_shadow" onClick={() => this.openQuestion(index)}>
											<div className="user-detail d-flex justify-content-between align-items-center py-3 px-4" style={{ cursor: 'pointer' }}>
												<div className="media w-80">
													<Avatar className="mr-20 rounded">{results.froms.username.charAt(0)}</Avatar>
													<div className="media-body">
														<h5 className="mb-1">{results.froms.username}</h5>
														<p className="mb-0 font-sm">From <span className="text-muted font-xs">&lt;{results.froms.email_id}&gt;</span></p>
														<p className="mb-0 font-sm">To: <span className="text-muted font-xs">Me</span></p>
													</div>
												</div>
												<span className="text-muted w-20 text-right font-xs">{results.create_Date}, {results.create_Time}</span>
											</div>

											<div className='messageBoxClass'>
												<hr className="emailDetailHr" />
												<div className="mail-detail mail_details_msg_comman_cls">
													<div className="mb-20">
														<div dangerouslySetInnerHTML={{ __html: results.message }}></div>
													</div>
													<span className="d-block fw-semi-bold font-sm">Regards,</span>
													<span className="d-block font-xs text-muted">{results.froms.username}</span>
												</div>

											</div>

										</div>
										{arrr.length - 1 === index &&
											<div>
												{this.state.footerButtonStatus && <div className="outside_shadow1">
													<div className="mail-reply-wrap d-flex align-items-center p-20">
														<span>Click here to <a href="javascript:void(0)" className="linkCommonCls" onClick={() => this.replyFun(results.id)}><u>Reply</u></a>, {/*<a href="javascript:void(0)" className="linkCommonCls"><u>Reply to all</u></a>,*/} or <a href="javascript:void(0)" onClick={() => this.forwordFun()} className="linkCommonCls"><u>Forward</u></a></span>
													</div>
												</div>}
												{this.state.replyStatus &&
													<ReplyComponent makeReplyFormdata={makeReplyFormdata} parent_id={results.id} fromEmailId={results.froms.id} history={this.props.history} />
												}
												{this.state.forwordStatus &&
													<ForwordComponent makeForwordFormdata={makeForwordFormdata} history={this.props.history} />
												}
											</div>
										}
									</div>

								))}
							</div>
						}
						</div>
				}
				{this.state.isRequestMailStatus &&
					<div>
						{/*<div className="top-head border-bottom-0 d-flex justify-content-between">
							<IconButton onClick={() => this.onBackPress()}>
								<ArrowBackIcon />
							</IconButton>
							<div className="mail-action">
								<IconButton>
									<i className="zmdi zmdi-mail-reply"></i>
								</IconButton>
								<IconButton>
									<i className="zmdi zmdi-print"></i>
								</IconButton>
								<IconButton onClick={() => this.onDeleteEmail()}>
									<i className="zmdi zmdi-delete"></i>
								</IconButton>
							</div>
						</div>*/}
						{this.state.currentMailData !== null &&
							<div>
								<div className="top-head d-flex justify-content-between align-items-center">
									<IconButton onClick={() => this.onBackPress()}>
										<ArrowBackIcon />
									</IconButton>
									<h2 className="mb-0 text-capitalize w-75 d-flex align-items-center">{this.state.currentMailData.subject}</h2>
									<div className="wself-70 ">
										{/*{this.getTaskLabelNames(currentEmail.email_labels)}*/}
										<ul className="maildetail_ul email_detail_header_common_cls">
											<li id="UncontrolledTooltipExample">
												<i class="fa fa-flag-o" style={{ color: 'orange' }}></i>&nbsp;
											Orange
										</li>
											<li>
												<i class="fa fa-envelope-o" style={{ color: '#808080' }}></i>&nbsp;
											Marks as unread
										</li>
											<li>
												<i class="fa fa-download" style={{ color: '#808080' }}></i>&nbsp;
											Archive
										</li>
											<li>
												|
										</li>
											<li>CC out</li>
										</ul>
									</div>
								</div>
								<div className="outside_shadow">
									<div className="user-detail d-flex justify-content-between align-items-center py-3 px-4" onClick={this.showDiv} style={{ cursor: 'pointer' }}>
										<div className="media w-80">
											<Avatar className="mr-20 rounded">{this.state.emaiilDatailsData.froms.username.charAt(0)}</Avatar>
											{/*{currentEmail.from.avatar !== '' ?
												<img src={currentEmail.from.avatar} alt="user profile" className="mr-20 rounded img-fluid" width="50" height="50" />
												: <Avatar className="mr-20 rounded">{currentEmail.from.name.charAt(0)}</Avatar>
											}*/}
											<div className="media-body">
												<h5 className="mb-1">{this.state.emaiilDatailsData.froms.username}</h5>
												<p className="mb-0 font-sm">From <span className="text-muted font-xs">&lt;{this.state.emaiilDatailsData.froms.email_id}&gt;</span></p>
												<p className="mb-0 font-sm">To: <span className="text-muted font-xs">Me</span></p>
											</div>
										</div>
										<span className="text-muted w-20 text-right font-xs">{this.state.emaiilDatailsData.create_Date}, {this.state.emaiilDatailsData.create_Time}</span>
									</div>
									<hr />
									{/*{this.state.show && (*/}
									<div>
										<div className="mail-detail mail_details_msg_comman_cls">
											<div className="mb-20">
												<div dangerouslySetInnerHTML={{ __html: this.state.emaiilDatailsData.message }}></div>
												{/*<p>{this.state.currentMailData.message}</p>*/}
											</div>
											<span className="d-block fw-semi-bold font-sm">Regards,</span>
											<span className="d-block font-xs text-muted">{this.state.emaiilDatailsData.froms.username}</span>
										</div>
										{/*<div className="attachments p-20">
											<div className="d-flex justify-content-between">
												<h4>3 Attachments</h4>
												<div className="mail-action">
													<IconButton>
														<i className="zmdi zmdi-file"></i>
													</IconButton>
													<IconButton>
														<i className="zmdi zmdi-cloud-download"></i>
													</IconButton>
												</div>
											</div>
											<ul className="list-unstyled d-flex">
												<li className="mx-2">
													<img src={require('Assets/img/about-card-1.png')} alt="attachments" className="img-fluid mb-10" width="180" height="140" />
													<p className="mb-5 font-xs">Attachment 1.jpg</p>
													<div className="list-action">
														<a href="javascript:void(0)"><i className="zmdi zmdi-download mr-10"></i></a>
														<a href="javascript:void(0)"><i className="zmdi zmdi-zoom-in"></i></a>
													</div>
												</li>
												<li className="mx-2">
													<img src={require('Assets/img/about-card-2.png')} alt="attachments" className="img-fluid mb-10" width="180" height="140" />
												<p className="mb-5 font-xs">Attachment 2.jpg</p>
													<div className="list-action">
														<a href="javascript:void(0)"><i className="zmdi zmdi-download mr-10"></i></a>
														<a href="javascript:void(0)"><i className="zmdi zmdi-zoom-in"></i></a>
													</div>
												</li>
												<li className="mx-2">
													<img src={require('Assets/img/about-card-3.png')} alt="attachments" className="img-fluid mb-10" width="180" height="140" />
												<p className="mb-5 font-xs">Attachment 3.jpg</p>
													<div className="list-action">
														<a href="javascript:void(0)"><i className="zmdi zmdi-download mr-10"></i></a>
														<a href="javascript:void(0)"><i className="zmdi zmdi-zoom-in"></i></a>
													</div>
												</li>
											</ul>
										</div>*/}
									</div>
									{/*})}*/}
								</div>
								{this.state.footerButtonStatus && <div className="outside_shadow1">
									<div className="mail-reply-wrap d-flex align-items-center p-20">
										<span>Click here to <a href="javascript:void(0)" className="linkCommonCls" onClick={() => this.replyFun()}><u>Reply</u></a></span>
									</div>
								</div>}
								{this.state.replyStatus &&
									<div className="outside_shadow">
										<InputGroup className="selfinputgroup">
											<InputGroupAddon addontype="prepend">
												<InputGroupText>To</InputGroupText>
											</InputGroupAddon>
											<InputGroupAddon addontype="prepend">
												<InputGroupText className="replyReceipentClsCss">{this.state.emaiilDatailsData.froms.email_id}</InputGroupText>
											</InputGroupAddon>
										</InputGroup><br /><br />
										<div className="parent">
											<div className="block1">
												<b><span className="actualfileNameCls"></span></b>
											</div>
											<div className="block2">
												<div className="progress progressCss">
													<div className="progress-bar" role="progressbar"></div>
												</div>
											</div>
											<div className="block3">
												<span className="cancel_div cancel_divCss">
													<a className="close-icon1 stopDefPdfUpload"></a>
												</span>
											</div>
											<div className="block4">
												<div className="delete_Pdf delete_PdfClsCss"></div>
											</div>
										</div>
										<hr />
										<div className="form-group">
											<div className="uploadDefPdfDivCls">
												<button className="btn btn-sm upload-btn upload-btnCss" type="button">Attach document</button>
												<input id="upload-input" type="file" name="uploads" multiple />
												{this.state.defPdfError ? <span style={{ color: "red" }} className="defPdfErrorCls">Please select file </span> : ''}
												&emsp;&emsp;
												<Button className="btn-primary text-white" onClick={this.handleRequestDocReply} style={{ borderRadius: 20, marginRight: 20 }}>
													<Icon className="mr-10">send</Icon>
													<IntlMessages id="widgets.send" />
												</Button>
											</div>
										</div>
									</div>

								}

							</div>
						}
					</div>
				}
				{this.state.isRequestMailReplyStatus &&
					<div>
						<RequestedDocReply makeRequestedDocReplyFormData={makeRequestedDocReplyFormData} />
					</div>}
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ emailApp }) => {
	return emailApp;
};

export default withRouter(connect(mapStateToProps, {
	hideLoadingIndicator,
	onNavigateToEmailListing,
	onDeleteEmail
})(EmailDetail));

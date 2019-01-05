/**
* Email App Sidebar
* Used To Filter Mail List
*/
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { connect } from 'react-redux';
import { Link,withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';

// helpers
import { getAppLayout } from 'Helpers/helpers';

// actions
import { filterEmails } from 'Actions';

//Intl Message
import IntlMessages from 'Util/IntlMessages';
import axios from 'axios';
import $ from 'jquery';
let BaseUrl = 'http://localhost:3001/';

class EmailAppSidebar extends Component {

	constructor() {
		super();
		this.state = {
			checkAdmin:false
		};
	}
	componentDidMount() {

		let token = localStorage.getItem('token');
		if (token) {
			axios.get(BaseUrl + 'api/usersAuth/checkSession/sessionGotted/' + token)
				.then(result => {
					if (result.data.failed) {
						console.log('Error here');
						this.props.history.push('/login')
					}
					else if (result.data.message) {
						if (result.data.users_details.isAdmin === 1) {
							this.setState({ checkAdmin: true })
						}
						//this.props.history.push('/app/email_client/folder/inbox')
					}

					else {
						console.log('Error here');
						this.props.history.push('/login')
					}
				});
		}
		$('.fa-envelope-o').css('color', '#b9d40b');
		$('#inbox').click(function () {
			$('.fa-envelope-o').css('color', '#b9d40b');
			$('.zmdi-email-open').css('color', '#464d69');
			$('.zmdi-delete').css('color', '#464d69');
			$('.zmdi-mail-send').css('color', '#464d69');
			$('.drafts').css('color', '#464d69');
		})
		$('#req_document').click(function () {
			$('.fa-envelope-o').css('color', '#464d69');
			$('.zmdi-email-open').css('color', '#b9d40b');
			$('.zmdi-delete').css('color', '#464d69');
			$('.zmdi-mail-send').css('color', '#464d69');
			$('.drafts').css('color', '#464d69');
		})
		$('#trash').click(function () {
			$('.fa-envelope-o').css('color', '#464d69');
			$('.zmdi-email-open').css('color', '#464d69');
			$('.zmdi-delete').css('color', '#b9d40b');
			$('.zmdi-mail-send').css('color', '#464d69');
			$('.drafts').css('color', '#464d69');
		})
		$('#sent').click(function () {
			$('.fa-envelope-o').css('color', '#464d69');
			$('.zmdi-email-open').css('color', '#464d69');
			$('.zmdi-delete').css('color', '#464d69');
			$('.zmdi-mail-send').css('color', '#b9d40b');
			$('.drafts').css('color', '#464d69');
		})
		$('#drafts').click(function () {
			$('.fa-envelope-o').css('color', '#464d69');
			$('.zmdi-email-open').css('color', '#464d69');
			$('.zmdi-delete').css('color', '#464d69');
			$('.zmdi-mail-send').css('color', '#464d69');
			$('.drafts').css('color', '#b9d40b');
		})
	}

	navigateTo(key) {
		const { match, history } = this.props;
		history.push(`${match.url}/folder/${key}`);
	}
	navigateToOther(key) {
		const { match, history } = this.props;
		history.push(`${match.url}/${key}`);
	}

	/**
	 * Filter Emails
	 */
	filterEmails(label) {
		this.props.filterEmails(label);
	}

	/**
	 * Get Scroll Height
	 */
	getScrollHeight() {
		const { location } = this.props;
		const appLayout = getAppLayout(location)
		switch (appLayout) {
			case 'app':
				return 'calc(100vh - 130px)';
			case 'agency':
				return 'calc(100vh - 416px)';
			case 'boxed':
				return 'calc(100vh - 416px)';
			case 'horizontal':
				return 'calc(100vh - 333px)';
			default:
				break;
		}
	}

	render() {
		const { folders, selectedFolder, labels } = this.props;
		return (
			<Scrollbars
				className="rct-scroll"
				autoHide
				style={{ height: this.getScrollHeight() }}
			>
				<div className="sidebar-filters-wrap">
					<List className="p-0 filters list-unstyled">
						<ListItem button onClick={() => this.navigateTo('inbox')} id="inbox"><i className="mr-20 fa fa-envelope-o" ></i><span className="filter-title">Inbox</span>&emsp;&emsp;&emsp;&emsp;&emsp;<span className="importantSignCls">!</span>&nbsp;<span className="filter-title inboxBadge">143</span></ListItem><hr className="hrSlidebar" />
						<ListItem button onClick={() => this.navigateTo('requested')} id="req_document"><i className="mr-20 zmdi zmdi-email-open"></i><span className="filter-title">Requested Documents</span></ListItem><hr className="hrSlidebar" />
						<ListItem button onClick={() => this.navigateTo('archive')} id="trash"><i className="mr-20 zmdi zmdi-delete"></i><span className="filter-title">Archive</span></ListItem><hr className="hrSlidebar" />
						<ListItem button onClick={() => this.navigateTo('sent')} id="sent"><i className="mr-20 zmdi zmdi-mail-send"></i><span className="filter-title">Sent Email</span></ListItem><hr className="hrSlidebar" />
						<ListItem button onClick={() => this.navigateTo('drafts')} id="drafts"><i className="mr-20 zmdi zmdi-email-open drafts"></i><span className="filter-title">Send Later</span></ListItem><hr className="hrSlidebar" />
					</List>
					{/*<List className="p-0 filters list-unstyled">
						{folders.map((folder, key) => (
							<ListItem
								button
								key={key}
								onClick={() => this.navigateTo(folder.handle)}
								className={classnames({ 'item-active': selectedFolder === folder.id })}>
								<i className={`mr-20 zmdi zmdi-${folder.icon}`} />
								<span className="filter-title">
									<IntlMessages id={folder.title} />
								</span>
							</ListItem>
						))}
					</List>*/}
					{this.state.checkAdmin  && 
						<div>
							<h6 className="sidebar-title px-20 pt-20">Users</h6>
							<div className="sidebar-filters-wrap">
								<List className="p-0 filters list-unstyled">
									<ListItem button onClick={() => this.navigateToOther('createuser')}><span className="material-icons mr-10">person</span><div className="item rct-block-content">&nbsp;<span className="filter-title" >Create User</span></div></ListItem>
									<ListItem button onClick={() => this.navigateToOther('manageuser')}><span className="material-icons mr-10">group</span><div className="item rct-block-content">&nbsp;<span className="filter-title" >Manage User</span></div></ListItem>
									<ListItem button onClick={() => this.navigateToOther('binuser')}><span className="material-icons mr-10">delete</span><div className="item rct-block-content">&nbsp;<span className="filter-title" >Bin User</span></div></ListItem>
								</List>
							</div>
							<h6 className="sidebar-title px-20 pt-20">Group</h6>
							<div className="sidebar-filters-wrap">
								<List className="p-0 filters list-unstyled">
									<ListItem button onClick={() => this.navigateToOther('creategroup')}><span className="material-icons mr-10">group_add</span><div className="item rct-block-content">&nbsp;<span className="filter-title" >Create Group</span></div></ListItem>
									<ListItem button onClick={() => this.navigateToOther('managegroup')}><span className="material-icons mr-10">group</span><div className="item rct-block-content">&nbsp;<span className="filter-title" >Manage Group</span></div></ListItem>
									<ListItem button onClick={() => this.navigateToOther('bingroup')}><span className="material-icons mr-10">delete</span><div className="item rct-block-content">&nbsp;<span className="filter-title" >Bin Group</span></div></ListItem>
								</List>
							</div>
						</div>
					}
					
				</div>
			</Scrollbars>
		);
	}
}

// map state to props
const mapStateToProps = ({ emailApp }) => {
	return emailApp;
};

export default withRouter(connect(mapStateToProps, {
	filterEmails
})(EmailAppSidebar));

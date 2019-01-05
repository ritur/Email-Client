/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import screenfull from 'screenfull';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

// actions
import { collapsedSidebarAction } from 'Actions';

// helpers
import { getAppLayout } from "Helpers/helpers";

// components
import Notifications from './Notifications';
import ChatSidebar from './ChatSidebar';
import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
import LanguageProvider from './LanguageProvider';
import SearchForm from './SearchForm';
import QuickLinks from './QuickLinks';
import MobileSearchForm from './MobileSearchForm';
import Cart from './Cart';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import profiles from './user2.png';
import logo from './logo.png';
import axios from 'axios';
import EmailListing from '../../routes/email_client/components/EmailListing';
//let Dmoo_page = 'hello';
import Snackbar from '@material-ui/core/Snackbar';
import io from "socket.io-client";
const SOCKET_URL = "http://localhost:3001";
const socket = io(SOCKET_URL);
let BaseUrl = 'http://localhost:3001/';

class Header extends Component {

	constructor(props) {
		super(props);
		console.log('the props data isssssssssssss in draf', this)
			this.state = {
			customizer: false,
			isMobileSearchFormVisible: false,
			username: '',
			composedMessage: "",
			usersChannels: [],
			token: "",
			snackbar: false,
		}
		let that = this;
 		socket.on('refresh privateMessages', function (data) {
			if (data.mail_type === 'very_important'){
				that.veryImporatantGotMailFun()
			}
			console.log('the socket data is email listig hai', data)
		});
	}

	/* FUNCTION FOR GET SELECT VALUE BASED ON ID FOR UPDATE QUESTIONS */
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
						console.log('user data is',result.data.users_details);
						this.setState({ username: result.data.users_details.first_name})

						let username = result.data.users_details.first_name
						socket.emit('enter channel', username);
						this.props.history.push('/app/email_client/folder/inbox')

						
					}

					else {
						console.log('Error here');
						this.props.history.push('/login')
					}
				});
		}
		
	}
	veryImporatantGotMailFun(){
		this.setState({ snackbar:true})
	}
	//**FOR CLOSE SCACKEBAR */
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ snackbar: false });
	};

	// function to change the state of collapsed sidebar
	onToggleNavCollapsed = (event) => {
		const val = !this.props.navCollapsed;
		this.props.collapsedSidebarAction(val);
	}

	handleLogout = () => {
		axios.post(BaseUrl + 'api/usersAuth/checkSession/logout')   //FOR IMPORT CASES
			.then(res => {
				if (res.data.failed) {
					console.log('something wrong');
				}
				else if (res.data.sessionData) {
					console.log('You are logout');
					this.props.history.push('/login');
				}
				else {
					console.log('something wrong');
				}
			});

	}
	// open dashboard overlay
	openDashboardOverlay() {
		$('.dashboard-overlay').toggleClass('d-none');
		$('.dashboard-overlay').toggleClass('show');
		if ($('.dashboard-overlay').hasClass('show')) {
			$('body').css('overflow', 'hidden');
		} else {
			$('body').css('overflow', '');
		}
	}

	// close dashboard overlay
	closeDashboardOverlay() {
		$('.dashboard-overlay').removeClass('show');
		$('.dashboard-overlay').addClass('d-none');
		$('body').css('overflow', '');
	}

	// toggle screen full
	toggleScreenFull() {
		screenfull.toggle();
	}

	// mobile search form
	openMobileSearchForm() {
		this.setState({ isMobileSearchFormVisible: true });
	}

	render() {
		const { isMobileSearchFormVisible, snackbar } = this.state;
		$('body').click(function () {
			$('.dashboard-overlay').removeClass('show');
			$('.dashboard-overlay').addClass('d-none');
			$('body').css('overflow', '');
		});
		const { horizontalMenu, agencyMenu, location } = this.props;
		<EmailListing something={'hello'}/>
		return (
			<div>
				<AppBar position="static" className="rct-header">
					<Toolbar className="d-flex justify-content-between w-100 pl-0">
						
						<div className="logo-div">
							<span ><Link to="/app/email_client/folder/inbox"><img src={logo} /></Link></span>
						</div>
						<div className="profile-div">
							<h3 style={{ color: 'green', textAlign: 'rigth', paddingTop: '10px' }}>{this.state.username}&nbsp;&nbsp;&nbsp;
							<span ><a href="javascript:void(0)" onClick={this.handleLogout} className="logoutCls"><img src={profiles} height="35px" style={{ borderRadius: "50%"}} /></a></span>&nbsp;&nbsp;&nbsp;
							</h3>
						</div>
					</Toolbar>
				</AppBar>
				<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
					open={snackbar}
					autoHideDuration={50000}
					onClose={this.handleClose}
					message={<span id="message-id">You have a "Very Important Email."</span>}
					action={[
						<Button variant="raised" key="undo" className="btn-danger btn-sm text-white" dense="true" onClick={this.handleClose}> UNDO </Button>,
						<IconButton key="close" aria-label="Close" color="inherit" onClick={this.handleClose} >
							<i className="zmdi zmdi-close"></i>
						</IconButton>,
					]}
				/>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings }) => {
	return settings;
};

export default withRouter(connect(mapStateToProps, {
	collapsedSidebarAction
})(Header));

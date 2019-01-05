import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { SessionSlider } from 'Components/Widgets';
import AppConfig from 'Constants/AppConfig';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert' //FOR SWEET ALERT
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Snackbar from '@material-ui/core/Snackbar';
import { Link } from 'react-router-dom';
import {
    signinUserInFirebase,
    signinUserWithFacebook,
    signinUserWithGoogle,
    signinUserWithGithub,
    signinUserWithTwitter
} from 'Actions';
let BaseUrl = 'http://localhost:3001/';

class Signin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUserData: { isAdmin:1, useremail: '', userpassword: '' },
            currentUserData1: [],
            formErrorAlert: false,
            sectionReload: false,
            snackbar: false,
            successMessage: '',
            isValidation:0,
            currentChannel:'Public-Main'
        };
       
    }
    /* FUNCTION FOR GET SELECT VALUE BASED ON ID FOR UPDATE QUESTIONS */
    componentDidMount() {
        // axios.get('http://localhost:3001/api/usersAuth/checkSession/sessionGotted')   //FOR IMPORT CASES
        //     .then(res => {
        //         if (res.data.failed) {
        //             console.log('You are not login');
        //             this.props.history.push('/login');
        //         }
        //         else if (res.data.sessionData) {

        //             console.log('You are login');
        //             this.props.history.push('/app/email_client/createuser')
        //         }
        //         else {
        //             console.log('You are not login');
        //             this.props.history.push('/login');
        //         }
        //     });
    }
    /* FUNCTION FOR CONFIRM ERROE ALERT BOX*/
    onConfirmformErrorAlert(key) {
        this.setState({ [key]: false })
    }
    /* FOR FOR STORE TEXTBOX VALUE INTO ANOTHER VARIABLE WHEN MOUSE CHANGE */
    handleChange = (e) => {
        const state = this.state.currentUserData
        state[e.target.name] = e.target.value;
        this.setState({ currentUserData: state });
        if (this.state.isValidation == 1) {
            this.setValidation(); //CALL VALIDATION FUNCTION
        }
    }
    /* FUNCTION FOR SET VALIDATION */
    setValidation() {
        let fields = this.state.currentUserData
        let formIsValid = true;
        if (!fields["useremail"]) {
            formIsValid = false;
            this.setState({ useremailError: true })
        }
        else {
            this.setState({ useremailError: false, isValidation: 1 })
        }

        if (!fields["userpassword"]) {
            formIsValid = false;
            this.setState({ userpasswordError: true })
        }
        else {
            this.setState({ userpasswordError: false, isValidation: 1})
        }
        return formIsValid;
    }
    /* FUNCTION FOR SUBMIT RECORDS(INSERT & UPDATE) */
    handleSaveData = (e) => {
        
        e.preventDefault();
        
        if (this.setValidation()) {
            this.setState({ sectionReload: true });
            const { isAdmin,useremail, userpassword } = this.state.currentUserData;
            const currentChannel = this.state.currentChannel;  

            axios.post(BaseUrl +'api/usersAuth/login', { isAdmin, useremail, userpassword }) //API FOR INSERT
                .then(result => {
                    if (result.data.failed) {
                        setTimeout(() => {
                            this.setState({ sectionReload: false });
                            this.setState({ formErrorAlert: true })
                            this.setState({ currentUserData: { useremail: '', userpassword: '' } });
                            console.log('Error here');
                        }, 1500);
                    }
                    else if (result.data.message){
                        if (result.data.token){
                            localStorage.setItem('token', result.data.token);
                        }
                        setTimeout(() => {
                            this.setState({ snackbar: true, sectionReload: false, successMessage: 'Great you are successfully logined' });
                            this.setState({ currentUserData: { useremail: '', userpassword: '' } });
                        }, 1500);
                        setTimeout(() => { this.props.history.push('/app/email_client/folder/inbox') }, 1520);
                    }
                    
                    else{
                        setTimeout(() => {
                            this.setState({ sectionReload: false });
                            this.setState({ formErrorAlert: true })
                            this.setState({ currentUserData: { useremail: '', userpassword: '' } });
                            console.log('Error here');
                        }, 1500);
                    }
                })
        }
    }

    render() {
        const { isAdmin, useremail, userpassword, formErrorAlert, sectionReload, snackbar } = this.state;
        const { loading } = this.props;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    <div className="session-inner-wrapper">
                        <SweetAlert show={formErrorAlert} title="Oops! email id or password are not matched" onConfirm={() => this.onConfirmformErrorAlert('formErrorAlert')} btnSize="sm" />
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className="col-sm-7 col-md-7 col-lg-7" style={{ 'margin-left': 'auto', 'margin-right': 'auto' }}>
                                    {sectionReload &&
                                        <RctSectionLoader />
                                    }
                                    <div className="session-body">
                                        <div className="session-head mb-30">
                                            <h1 className="font-weight-bold text-center">Log In</h1>
                                        </div>
                                        <Form>
                                            <FormGroup className="has-wrapper">
                                                <Input type="mail" name="useremail" id="user-mail" className="has-input input-lg" placeholder="Enter Email Address" value={this.state.currentUserData.useremail} onChange={this.handleChange} />
                                                <span className="has-icon"><i className="ti-email"></i></span>
                                                {this.state.useremailError ? <span style={{ color: "red" }}>Enter your email</span> : ''}
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input type="password" name="userpassword" id="pwd" className="has-input input-lg" placeholder="Password" value={this.state.currentUserData.userpassword} onChange={this.handleChange} />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                                {this.state.userpasswordError ? <span style={{ color: "red" }}>Enter your password </span> : ''}
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button color="primary" className="btn-block text-white w-100" variant="raised" size="large" onClick={this.handleSaveData}> Log In</Button>
                                            </FormGroup>
                                        </Form>
                                        {/*<p className="text-muted">By signing up you agree to {AppConfig.brandName}</p>*/}
                                        <p className="text-center">
                                            <Link to={{
                                                pathname: '/forgot',
                                                state: { activeTab: 0 }
                                            }}>
                                            Forgot Password?
                                            </Link>
                                       </p>
                                   </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={snackbar}
                        onClose={() => this.setState({ snackbar: false })}
                        autoHideDuration={2000}
                        message={<span id="message-id">{this.state.successMessage}</span>}
                    />
                </div>
            </QueueAnim>
        );
    }
}

// map state to props
const mapStateToProps = ({ authUser }) => {
    const { user, loading } = authUser;
    return { user, loading }
}

export default connect(mapStateToProps, {
    signinUserInFirebase,
    signinUserWithFacebook,
    signinUserWithGoogle,
    signinUserWithGithub,
    signinUserWithTwitter
})(Signin);

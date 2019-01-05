import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { SessionSlider } from 'Components/Widgets';
import AppConfig from 'Constants/AppConfig';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert' //FOR SWEET ALERT
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Snackbar from '@material-ui/core/Snackbar';

import {
    signinUserInFirebase,
    signinUserWithFacebook,
    signinUserWithGoogle,
    signinUserWithGithub,
    signinUserWithTwitter
} from 'Actions';
let BaseUrl = 'http://localhost:3001/';

class ResetPwd extends Component {

    constructor(props) {
        super(props);
        console.log('pros is',this)
        this.state = {
            currentUserData: { resetPwd: '', resetConPwd: '' },
            currentUserData1: [],
            formErrorAlert: false,
            sectionReload: false,
            snackbar: false,
            successMessage: '',
            resetPasswordToken: '',
            isValidation:0
        };
    }
    /* FUNCTION FOR GET SELECT VALUE BASED ON ID FOR UPDATE QUESTIONS */
    componentDidMount() {
        this.setState({ resetPasswordToken: this.props.match.params.token});
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
        if (!fields["resetPwd"]) {
            formIsValid = false;
            this.setState({ resetPwdError: true })
        }
        else {
            this.setState({ resetPwdError: false, isValidation:1 })
        }

        if (!fields["resetConPwd"]) {
            formIsValid = false;
            this.setState({ resetConPwdError: true })
        }
        else {
            this.setState({ resetConPwdError: false, isValidation: 1})
        }
        if (this.state.currentUserData.resetPwd != this.state.currentUserData.resetConPwd) {
            formIsValid = false;
            this.setState({ matchConPwdError: true })
        }
        else {
            this.setState({ matchConPwdError: false ,isValidation:1})
        }
        return formIsValid;
    }
    /* FUNCTION FOR SUBMIT RECORDS(INSERT & UPDATE) */
    handleSaveData = (e) => {
        e.preventDefault();
        if (this.setValidation()) {
            this.setState({ sectionReload: true });
            const { resetConPwd } = this.state.currentUserData;
            const { resetPasswordToken } = this.state;
            axios.post(BaseUrl +'api/forgetPassword/resetPassword', { resetPasswordToken, resetConPwd }) //API FOR INSERT
                .then(result => {
                    if (result.data.failed) {
                        setTimeout(() => {
                            this.setState({ sectionReload: false });
                            this.setState({ formErrorAlert: true });
                            this.setState({ currentUserData: { resetPwd: '', resetConPwd: '' } });
                            console.log('Error here');
                        }, 1500);
                    }
                    else if (result.data.message)
                    {
                        setTimeout(() => {
                            this.setState({ snackbar: true, sectionReload: false, successMessage: 'Great your password is successfully reset' });
                            console.log('The data is', result.data);
                            this.setState({ currentUserData: { resetPwd: '', resetConPwd: '' } });
                        }, 1500);
                        setTimeout(() => { this.props.history.push('/login') }, 2600);
                    }
                    else
                    {
                        setTimeout(() => {
                            this.setState({ sectionReload: false });
                            this.setState({ formErrorAlert: true });
                            this.setState({ currentUserData: { resetPwd: '', resetConPwd: '' } });
                            console.log('Error here');
                        }, 1500);
                    }
                })
        }
    }

    onUserSignUp() {
        this.props.history.push('/signup');
    }

    render() {
        const { resetPasswordToken, resetPwd, resetConPwd, formErrorAlert, sectionReload, snackbar } = this.state;
        const { loading } = this.props;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    <div className="session-inner-wrapper">
                        <SweetAlert show={formErrorAlert} title="Oops! Password reset token is invalid or has expired please try again" onConfirm={() => this.onConfirmformErrorAlert('formErrorAlert')} btnSize="sm" />
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className="col-sm-7 col-md-7 col-lg-7" style={{ 'margin-left': 'auto', 'margin-right': 'auto' }}>
                                    {sectionReload &&
                                        <RctSectionLoader />
                                    }
                                    <div className="session-body">
                                        <div className="session-head mb-30">
                                            <h1 className="font-weight-bold text-center">Reset Password</h1>
                                        </div>
                                        <Form>
                                            <FormGroup className="has-wrapper">
                                                <Input type="password" name="resetPwd" id="user-mail" className="has-input input-lg" placeholder="Enter Your Password" value={this.state.currentUserData.resetPwd} onChange={this.handleChange} />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                                {this.state.resetPwdError ? <span style={{ color: "red" }}>Enter your password</span> : ''}
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input type="password" name="resetConPwd" id="pwd" className="has-input input-lg" placeholder="Enter Your Confirm Password" value={this.state.currentUserData.resetConPwd} onChange={this.handleChange} />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                                {this.state.resetConPwdError ? <span style={{ color: "red" }}>Enter your confirm password </span> : ''}
                                                {this.state.resetConPwdError ? '' : this.state.matchConPwdError ? <span style={{ color: "red" }}>Password not match</span> : ''}
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button color="primary" className="btn-block text-white w-100" variant="raised" size="large" onClick={this.handleSaveData}> Reset Password </Button>
                                            </FormGroup>
                                        </Form>
                                        {/*<p className="text-muted">By signing up you agree to {AppConfig.brandName}</p>*/}
                                        {/*<p className="text-center"><a target="_blank" href="/topnegotiator/forgetPassword" className="text-muted ">Forget Password</a></p>*/}
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
})(ResetPwd);

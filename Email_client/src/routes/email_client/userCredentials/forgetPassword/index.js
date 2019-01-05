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

class ForgetsPassword extends Component {

    constructor() {
        super();
        this.state = {
            currentUserData: { useremail: '' },
            formErrorAlert: false,
            sectionReload: false,
            snackbar: false,
            successMessage: ''
        };
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
        this.setValidation(); //CALL VALIDATION FUNCTION
    }
    /* FUNCTION FOR SET VALIDATION */
    setValidation() {
        let fields = this.state.currentUserData
        let formIsValid = true;
        if (!fields["useremail"]) {
            formIsValid = false;
            this.setState({ emailNotFoundError: false });
            this.setState({ useremailError: true })
        }
        else {
            this.setState({ useremailError: false })
        }
        return formIsValid;
    }
    /* FUNCTION FOR SUBMIT RECORDS(INSERT & UPDATE) */
    handleSaveData = (e) => {
        e.preventDefault();
        

        if (this.setValidation()) {
            this.setState({ sectionReload: true });
            const { useremail } = this.state.currentUserData;
            axios.post(BaseUrl +'api/forgetPassword/sendemail', { useremail }) //API FOR INSERT
                .then(result => {
                    if (result.data.failed) {
                        setTimeout(() => {
                            this.setState({ sectionReload: false });
                            this.setState({ emailNotFoundError: true })
                            this.setState({ currentUserData: { useremail: '' } });
                            console.log('Error here');
                        }, 1500);
                    }
                    else {
                        setTimeout(() => {
                            this.setState({ sectionReload: false });
                            console.log('The data is', result.data);
                            this.setState({ currentUserData: { useremail: '' } });

                        }, 1500);
                        setTimeout(() => { this.setState({ formErrorAlert: true }) }, 1530);


                    }
                })
        }
    }

    onUserSignUp() {
        this.props.history.push('/signup');
    }

    render() {
        const { useremail, userpassword, formErrorAlert, sectionReload, snackbar } = this.state;
        const { loading } = this.props;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    <div className="session-inner-wrapper"><br /><br /><br /><br />
                        <SweetAlert show={formErrorAlert} title="An e-mail has been sent to your email successfully." onConfirm={() => this.onConfirmformErrorAlert('formErrorAlert')} btnSize="sm" />
                        <div className="container">
                            <div className="row row-eq-height">
                                <div className="col-sm-7 col-md-7 col-lg-7" style={{ 'margin-left': 'auto', 'margin-right': 'auto' }}>
                                    {sectionReload &&
                                        <RctSectionLoader />
                                    }
                                    <div className="session-body">
                                        <div className="session-head mb-30">
                                            <h1 className="font-weight-bold text-center">Forgot Password</h1>
                                        </div>
                                        <Form>
                                            <FormGroup className="has-wrapper">
                                                <Input type="mail" name="useremail" id="user-mail" className="has-input input-lg" placeholder="Enter Email Address" value={this.state.currentUserData.useremail} onChange={this.handleChange} />
                                                <span className="has-icon"><i className="ti-email"></i></span>
                                                {this.state.useremailError ? <span style={{ color: "red" }}>Enter your email</span> : ''}
                                                {this.state.useremailError ? '' : this.state.emailNotFoundError ? <span style={{ color: "red" }}>Email not Found</span> : ''}
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button color="primary" className="btn-block text-white w-100" variant="raised" size="large" onClick={this.handleSaveData}> Submit </Button>
                                            </FormGroup>
                                        </Form>
                                        <p className="text-center">
                                            <Link to={{
                                                pathname: '/login',
                                                state: { activeTab: 0 }
                                            }}>
                                                Back To Login
                                            </Link>
                                        </p>
                                        {/*<p className="text-muted">By signing up you agree to {AppConfig.brandName}</p>*/}
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
})(ForgetsPassword);

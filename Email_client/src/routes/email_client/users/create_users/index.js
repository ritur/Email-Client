import React, { Component, Fragment } from 'react';
import { Media } from 'reactstrap';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import { Scrollbars } from 'react-custom-scrollbars';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup1 from '@material-ui/core/FormGroup'; //For checkbox
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText, Col } from 'reactstrap';
import api from 'Api';
import { getTheDate, convertDateToTimeStamp } from 'Helpers/helpers';
import { RctCardFooter } from "Components/RctCard";
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import $ from 'jquery';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import update from 'react-addons-update';
import Avatar from '@material-ui/core/Avatar';
import SweetAlert from 'react-bootstrap-sweetalert' //FOR SWEET ALERT
import axios from 'axios';
import '../../css/style.css';
let BaseUrl = 'http://localhost:3001/';

class CreateUser extends Component {
    constructor() {
        super();
        this.state = {
            currentCaseData: [],
            sessionData: [],
            createUserAllData: { status: 1, first_name:'', last_name:'', phone:'', email_id:'', conPassword:'', role:'' },
            seminar_id: '',
            edit_value: '',
            sectionReload: false,
            snackbar: false,
            formErrorAlert: false,
            successMessage: ''
        };
    }

    /* FUNCTION FOR GET SELECT VALUE BASED ON ID FOR UPDATE QUESTIONS */
    componentDidMount() {
        let that = this;
        $(document).ready(function () {
            $(".emailCls").change(function (e) {
                console.log(e.target.value);
                var inputEmail = that.state.createUserAllData.email_id
                axios.post(BaseUrl + 'api/usersAuth/checkEmailId', { inputEmail }) //API FOR INSERT
                    .then(result => {
                        if (result.data.failed) {
                            $('.emailExistError').text('Email already exist');
                            console.log('Error here');
                            that.setState({ isEmailExist: false });
                        }
                        else if (result.data.message) {
                            $('.emailExistError').text('');
                            that.setState({ isEmailExist: true });
                        }
                        else {
                            $('.emailExistError').text('Email already exist');
                            that.setState({ isEmailExist: false });
                            console.log('Error here');
                        }
                    })
            });
        })
        // axios.get('http://localhost:3001/api/adminLogins/checkSession/sessionGotted')   //FOR IMPORT CASES
        //     .then(res => {
        //         if (res.data.failed) {
        //             console.log('You are not login');
        //             this.props.history.push('/login');
        //         }
        //         else if (res.data.sessionData) {

        //             console.log('You are login');
        //             this.props.history.push('/app/topnegotiator/seminar/createSeminar')
        //         }
        //         else {
        //             console.log('You are not login');
        //             this.props.history.push('/login');
        //         }
        //     });

        // axios.get('http://localhost:3001/api/Cases')   //FOR IMPORT CASES
        //     .then(res => {
        //         this.setState({ currentCaseData: res.data });
        //         console.log(this.state.currentCaseData);
        //     });

        var edit_value = localStorage.getItem("edit_item");
        this.setState({ edit_value: edit_value });
        if (edit_value) {
            axios.get(BaseUrl +'api/usersAuth/' + edit_value)
                .then(res => {
                    this.setState({ createUserAllData: res.data });
                    this.setState({ seminar_id: res.data.seminar_id });
                    console.log(this.state.createUserAllData);
                });
        }
        $(document).ready( function () {
            $('.searchDivCls').hide();
        })
        
    }
    
    /* FOR FOR STORE TEXTBOX VALUE INTO ANOTHER VARIABLE WHEN MOUSE CHANGE */
    handleChange = (e) => {
        const state = this.state.createUserAllData
        state[e.target.name] = e.target.value;
        this.setState({ createUserAllData: state });
       // this.setValidation(); //CALL VALIDATION FUNCTION
    }
    /* FUNCTION FOR CONFIRM ERROE ALERT BOX*/
    onConfirmformErrorAlert(key) {
        this.setState({ [key]: false })
    }
    /* FUNCTION FOR SET VALIDATION */
    setValidation() {
        let fields = this.state.createUserAllData
        let formIsValid = true;
        if (!fields["first_name"]) {
            formIsValid = false;
            this.setState({ firstNameError: true })
        }
        else {
            this.setState({ firstNameError: false })
        }
        
        if (!fields["email_id"]) {
            formIsValid = false;
            this.setState({ emailError: true })
        }
        else {
            this.setState({ emailError: false })
        }

        if (typeof fields["email_id"] !== "undefined") {
            let lastAtPos = fields["email_id"].lastIndexOf('@');
            let lastDotPos = fields["email_id"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email_id"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email_id"].length - lastDotPos) > 2)) {
                formIsValid = false;
                this.setState({ emailValidError: true });
            }
            else {
                this.setState({ emailValidError: false, isCheckFillField: 1 });
            }
        }
        if (!fields["conPassword"]) {
            formIsValid = false;
            this.setState({ passwordError: true })
        }
        else {
            this.setState({ passwordError: false })
        }

        if (!fields["role"]) {
            formIsValid = false;
            this.setState({ roleError: true })
        }
        else {
            this.setState({ roleError: false })
        }
        
        if (!this.state.isEmailExist) {
            formIsValid = false;
        }
        return formIsValid;
    }
    /* FUNCTION FOR SUBMIT RECORDS(INSERT & UPDATE) */
    handleSaveData = (e) => {
        e.preventDefault();
        if (this.setValidation()) {
            this.setState({ sectionReload: true });
            setTimeout(() => {
                console.log('the form data is',this.state.createUserAllData);
                var edit_value = localStorage.getItem("edit_item");
                if (edit_value) {
                    const { first_name,last_name,phone, email_id, conPassword, role } = this.state.createUserAllData;
                    axios.put(BaseUrl +'api/usersAuth/' + edit_value, { first_name, last_name, phone, email_id, conPassword, role }) //API FOR UPDATE
                        .then((result) => {
                            this.setState({ edit_value: null })
                        });
                    this.setState({
                        snackbar: true,
                        sectionReload: false,
                        successMessage: 'Record Updated Successfully'
                    });
                }
                else {
                    const { status, first_name, last_name, phone, email_id, conPassword, role } = this.state.createUserAllData;
                    console.log('POST DATA HEREEEEEEEEEEEEEEEEEEEEE', this.state.createUserAllData);
                    axios.post(BaseUrl +'api/usersAuth', { status, first_name, last_name, phone, email_id, conPassword, role }) //API FOR INSERT
                        .then((result) => {
                            this.setState({
                                snackbar: true,
                                sectionReload: false,
                                successMessage: 'Record Inserted Successfully'
                            });
                        });
                }
            }, 1500);
            setTimeout(() => { this.props.history.push("/app/email_client/manageuser") }, 2500);
        }
        else {
            this.setState({ formErrorAlert: true })
        }
    }
    /* FUNCTION FOR RENDER RECORDS*/
    render() {
        const { sessionData, createUserAllData } = this.state;
        const { formErrorAlert, sectionReload, snackbar } = this.state;
        return (
            <div className="formelements-wrapper">
                <Fragment>
                    {sectionReload &&
                        <RctSectionLoader />
                    }
                    {/*<PageTitleBar title="User" match={this.props.match} />*/}
                    <RctCollapsibleCard heading={this.state.edit_value ? 'Edit User' : 'Create User'}>
                        <hr className="hrCls"/>
                        <SweetAlert show={formErrorAlert} title="Please fill required fields!" onConfirm={() => this.onConfirmformErrorAlert('formErrorAlert')} btnSize="sm" />
                        <div className="row" >
                            <div className="col-sm-4 col-md-4 col-xl-4">
                                <div className="form-group">
                                    <TextField fullWidth label="First Name *" placeholder="Enter first name" name="first_name" value={this.state.createUserAllData.first_name} onChange={this.handleChange} />
                                    {this.state.firstNameError ? <span style={{ color: "red" }}>Enter first name </span> : ''}
                                </div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-xl-4">
                                <div className="form-group">
                                    <TextField fullWidth label="Last Name " placeholder="Enter last name" name="last_name" value={this.state.createUserAllData.last_name} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-xl-4">
                                <div className="form-group">
                                    <TextField fullWidth label="Phone" placeholder="Enter phone" name="phone" value={this.state.createUserAllData.phone} onChange={this.handleChange} />
                                </div>
                            </div>
                         </div>
                        <div className="row" >
                            <div className="col-sm-4 col-md-4 col-xl-4">
                                <div className="form-group">
                                    <TextField fullWidth label="Email *" placeholder="Enter email" name="email_id" className="emailCls" value={this.state.createUserAllData.email_id} onChange={this.handleChange} />
                                    {this.state.emailError ? <span style={{ color: "red" }}>Enter email</span> : ''}
                                    {this.state.emailError ? '' : this.state.emailValidError ? <span style={{ color: "red" }}>Enter valid email</span> : ''}
                                    {this.state.emailError ? '' : this.state.emailValidError ? '' : <span className="emailExistError" style={{ color: "red" }}></span>}
                                </div>
                            </div>
                            {!this.state.edit_value && <div className="col-sm-4 col-md-4 col-xl-4">
                                <div className="form-group">
                                    <TextField fullWidth label="Password" placeholder="Enter password" name="conPassword" value={this.state.createUserAllData.conPassword} onChange={this.handleChange} />
                                    {this.state.passwordError ? <span style={{ color: "red" }}>Enter password</span> : ''}
                                </div>
                            </div>}
                            <div className="col-sm-4 col-md-4 col-xl-4">
                                <div className="form-group">
                                    <FormControl fullWidth style={{ float: 'right' }}>
                                        <InputLabel>Role *</InputLabel>
                                        <Select value={this.state.createUserAllData.role} onChange={this.handleChange}
                                            inputProps={{ name: 'role', }}>
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            <MenuItem value="Account"><em>Account</em></MenuItem>
                                            <MenuItem value="Finanace"><em>Finanace</em></MenuItem>
                                            <MenuItem value="Sales"><em>Sales</em></MenuItem>
                                        </Select>
                                    </FormControl>
                                    {this.state.roleError ? <span style={{ color: "red" }}>Select Role </span> : ''}
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row" >
                            <div className="col-sm-12 col-md-12 col-xl-12">
                                <div className="form-group">
                                    <Button className="bg-primary text-white" onClick={this.handleSaveData} >{this.state.edit_value ? 'Update User' : 'Create User'}</Button>
                                </div>
                            </div>
                        </div>
                    </RctCollapsibleCard>
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
                </Fragment>
            </div>
        );
    }
}
export default CreateUser;

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
import InputMaterial from '@material-ui/core/Input'; //USE FOR MULTISELECT
import ListItemText from '@material-ui/core/ListItemText';  //USE FOR MULTISELECT
import FormGroup1 from '@material-ui/core/FormGroup'; //For checkbox
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select1 from '@material-ui/core/Select';
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
import { Typeahead } from 'react-bootstrap-typeahead';
import SweetAlert from 'react-bootstrap-sweetalert' //FOR SWEET ALERT
import axios from 'axios';
import '../../css/style.css';
let BaseUrl = 'http://localhost:3001/';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];

class CreateUser extends Component {
    constructor() {
        super();
        this.state = {
            sessionData: [],
            value: [],
            createGroupAllData: { status: 1, email_id: ''},
            groupMembers:[],
            allUsers:[],
            edit_value: '',
            sectionReload: false,
            snackbar: false,
            formErrorAlert: false,
            successMessage: '',
            multiple: true
        };
    }

    /* FUNCTION FOR GET SELECT VALUE BASED ON ID FOR UPDATE QUESTIONS */
    componentDidMount() {
        
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
            axios.get(BaseUrl +'api/groupApi/' + edit_value)
                .then(res => {
                    this.setState({ createGroupAllData: res.data });
                    this.setState({ groupMembers: res.data.groupMembers });
                    console.log('groups',this.state.createGroupAllData);
                });
        }
        axios.get(BaseUrl +'api/usersAuth/getSelectedUserFieldsForGroup') //USE FOR PUT CASE TYPE DROPDOWN 
            .then(res => {
                this.setState({ allUsers: res.data});
                console.log('the users are',this.state.allUsers);
            });
       
        $('.searchDivCls').hide();
       
    }

    handleChangeUsers = (selectedOption) => {
        this.setState({ groupMembers: selectedOption });
        console.log('the options are', selectedOption)
    }

    /* FOR FOR STORE TEXTBOX VALUE INTO ANOTHER VARIABLE WHEN MOUSE CHANGE */
    handleChange = (e) => {
        const state = this.state.createGroupAllData
        state[e.target.name] = e.target.value;
        this.setState({ createGroupAllData: state });
        //this.setValidation(); //CALL VALIDATION FUNCTION
    }
    
    /* FUNCTION FOR CONFIRM ERROE ALERT BOX*/
    onConfirmformErrorAlert(key) {
        this.setState({ [key]: false })
    }
    /* FUNCTION FOR SET VALIDATION */
    setValidation() {
        let fields = this.state.createGroupAllData
        let formIsValid = true;
        if (!fields["email_id"]) {
            formIsValid = false;
            this.setState({ groupNameError: true })
        }
        else {
            this.setState({ groupNameError: false })
        }

        if (this.state.groupMembers.length == 0) {
            formIsValid = false;
            this.setState({ groupMembersError: true })
        }
        else {
            this.setState({ groupMembersError: false })
        }
       
        return formIsValid;
    }
    /* FUNCTION FOR SUBMIT RECORDS(INSERT & UPDATE) */
    handleSaveData = (e) => {
        e.preventDefault();
        if (this.setValidation()) {
            this.setState({ sectionReload: true });
            setTimeout(() => {
                console.log('the form data is', this.state.createGroupAllData);
                console.log('group members are', this.state.groupMembers)
                var edit_value = localStorage.getItem("edit_item");
                if (edit_value) {
                    const { email_id, } = this.state.createGroupAllData;
                    const { groupMembers } = this.state;
                    axios.put(BaseUrl +'api/groupApi/' + edit_value, { email_id, groupMembers }) //API FOR UPDATE
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
                    const { status, email_id } = this.state.createGroupAllData;
                    const { groupMembers} = this.state;
                    console.log('POST DATA HEREEEEEEEEEEEEEEEEEEEEE', this.state.createGroupAllData);
                    axios.post(BaseUrl +'api/groupApi', { status, email_id, groupMembers}) //API FOR INSERT
                        .then((result) => {
                            this.setState({
                                snackbar: true,
                                sectionReload: false,
                                successMessage: 'Record Inserted Successfully'
                            });
                        });
                }
            }, 1500);
            setTimeout(() => { this.props.history.push("/app/email_client/managegroup") }, 2500);
        }
        else {
            this.setState({ formErrorAlert: true })
        }
    }
    /* FUNCTION FOR RENDER RECORDS*/
    render() {
        const { sessionData, createGroupAllData, groupMembers, selectedOption, multiple} = this.state;
        const { formErrorAlert, sectionReload, snackbar } = this.state;
        return (
            <div className="formelements-wrapper">
                <Fragment>
                    {sectionReload &&
                        <RctSectionLoader />
                    }
                    {/*<PageTitleBar title="Group" match={this.props.match} />*/}
                    <RctCollapsibleCard heading={this.state.edit_value ? 'Edit Group' : 'Create Group'}>
                        <hr className="hrCls" />
                        <SweetAlert show={formErrorAlert} title="Please fill required fields!" onConfirm={() => this.onConfirmformErrorAlert('formErrorAlert')} btnSize="sm" />
                        <div className="row" >
                            <div className="col-sm-4 col-md-4 col-xl-4">
                                <div className="form-group">
                                    <TextField fullWidth label="Group Name *" placeholder="Enter group name" name="email_id" value={this.state.createGroupAllData.email_id} onChange={this.handleChange} />
                                    {this.state.groupNameError ? <span style={{ color: "red" }}>Enter group name </span> : ''}
                                </div>
                            </div> ,
            
                            <div className="col-sm-7 col-md-7 col-xl-7">
                                <div className="form-group">
                                    <FormControl fullWidth>
                                        {/*<InputLabel htmlFor="select-multiple-checkbox">Group Members *</InputLabel>*/}
                                         
                                        <Typeahead className="selfinputgroup4"
                                            labelKey="email_id"
                                            multiple={multiple}
                                            options={this.state.allUsers}
                                            onChange={this.handleChangeUsers}
                                            selected={this.state.groupMembers}
                                            placeholder="Select members"
                                            minLength={0}
                                            onKeyDown={this.keyDown}
                                        />
                                       {/*} <Select1 multiple value={this.state.groupMembers}
                                            onChange={this.handleCaseTypeChange}
                                            input={<InputMaterial id="select-multiple-checkbox" />}
                                            renderValue={selected => selected.join(', ')}
                                            MenuProps={MenuProps}>
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {this.state.allUsers.map(groupMembers => (
                                                groupMembers.status === 1 &&
                                                <MenuItem key={groupMembers} value={groupMembers.first_name}>
                                                    <Checkbox checked={this.state.groupMembers.indexOf(groupMembers.first_name) > -1} />
                                                    <ListItemText primary={groupMembers.first_name} />
                                                </MenuItem>
                                            ))}
                                        </Select1>*/}
                                    </FormControl>
                                    {this.state.groupMembersError ? <span style={{ color: "red" }}>Select group members </span> : ''}
                                </div>
                            </div>
                           
                        </div>
                        <hr />
                        <div className="row" >
                            <div className="col-sm-12 col-md-12 col-xl-12">
                                <div className="form-group">
                                    <Button className="bg-primary text-white" onClick={this.handleSaveData} >{this.state.edit_value ? 'Update Group' : 'Create Group'}</Button>
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

import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import axios from 'axios';
import MUIDataTable from "mui-datatables"; //FOR DATATABLE
import $ from 'jquery';
import { Link } from 'react-router-dom';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Snackbar from '@material-ui/core/Snackbar';
let BaseUrl = 'http://localhost:3001/';

class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createUsersAllData: [{ status: '' }],
            userId: null,
            userId1: null,
            sectionReload: false,
            snackbar: false,
            successMessage: '',
            status: 0,
            login_status:null,
            login_status_text:'Active'
        };
        this.edit_fun = this.edit_fun.bind(this);
        localStorage.setItem("edit_item", "");
    }

    /* FUNCTION FOR SEND ID(EDIT PAGE) FOR EDITING  */
    edit_fun(edit) {
        localStorage.setItem("edit_item", edit);
    }

    /* FUNCTION FOR GET DATA FORM DATABASE*/
    componentDidMount() {
        // axios.get('http://localhost:3001/api/adminLogins/checkSession/sessionGotted')   //FOR IMPORT CASES
        //     .then(res => {
        //         if (res.data.failed) {
        //             console.log('You are not login');
        //             this.props.history.push('/login');
        //         }
        //         else if (res.data.sessionData) {

        //             console.log('You are login');
        //             this.props.history.push('/app/topnegotiator/seminar/manageSeminar')
        //         }
        //         else {
        //             console.log('You are not login');
        //             this.props.history.push('/login');
        //         }
        //     });

        axios.get(BaseUrl +'api/usersAuth')
            .then(res => {
                this.setState({ createUsersAllData: res.data });
                console.log('current user data is',this.state.createUsersAllData);
                // res.data.map((item,key) => {
                //     console.log('status',item.login_status),
                //     console.log('fn',item.first_name)
                //     item.login_status === 0 && this.setState({ login_status_text:'Inactive'});
                // }) 
            });
       
        $('.searchDivCls').hide();
    }

    /* FUNCTION CALL ON DELETE BUTTON CLICK AND OPEN DIALOG BOX  */
    onMoveBinConformBoxFun(id) {
        var userId = id;
        this.refs.moveBinConDialog.open();
        this.setState({ userId1: userId });
    }
    
    
    /* FUNCTION CALL WHEN DELETE CONFIRM (YES)  */
    onMoveBinConformedFun() {
        this.refs.moveBinConDialog.close();
        this.setState({ sectionReload: true });
        var getId = this.state.userId1;

        setTimeout(() => {
            if (getId) {
                let status = this.state.status;
                console.log('status');
                console.log(status);
                axios.put(BaseUrl +'api/usersAuth/' + getId, { status }) //API FOR UPDATE
                    .then((result) => {
                        this.componentDidMount();
                    });
                this.setState({
                    snackbar: true,
                    sectionReload: false,
                    successMessage: 'Record Move Into Bin Successfully'
                });
            }
        }, 1500);
    }
    
    /* FUNCTION CALL ON DELETE BUTTON CLICK AND OPEN DIALOG BOX  */
    userSuspendFun(id,login_status) {
        var userId = id;
        var login_status = login_status;
        this.refs.suspendConDialog.open();
        this.setState({ userId1: userId, login_status: login_status });
    }

    /* FUNCTION CALL WHEN DELETE CONFIRM (YES)  */
    userSuspendConformedFun() {
        this.refs.suspendConDialog.close();
        this.setState({ sectionReload: true });
        var getId = this.state.userId1;
        setTimeout(() => {
            if (getId) {
                let login_status;
                if(this.state.login_status == 1)
                {
                    login_status = 0;
                }
                else{
                    login_status = 1;
                }
                //alert(login_status);
                console.log('login_status');
                console.log(login_status);
                axios.put(BaseUrl +'api/usersAuth/' + getId, { login_status }) //API FOR UPDATE
                    .then((result) => {
                        this.componentDidMount();
                    });
                this.setState({
                    snackbar: true,
                    sectionReload: false,
                    successMessage: this.state.login_status == 1 ? 'Record Successfully Inactive' : 'Record Successfully Active' 
                });
            }
        }, 1500);
    }
    /* FUNCTION FOR RENDER THE RECORDS AS TABLE FORM */
    render() {
        const { sectionReload, snackbar } = this.state;
        const columns = ["Name", "Email", "Role", { name: "Action", options: { filter: false, sort: false, } }];
        const options = {
            filterType: 'dropdown',
            responsive: 'stacked',
            selectableRows: false
        };
        return (
            <div className="data-table-wrapper">
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <Fragment>
                        {sectionReload &&
                            <RctSectionLoader />
                        }
                        {/*<PageTitleBar title="User" match={this.props.match} />*/}
                        <RctCollapsibleCard heading="Manage Users" fullBlock>
                            <MUIDataTable
                                title={"Users list"}
                                data=
                                {this.state.createUsersAllData.filter(item => item.status === 1).map(item => {
                                    return [
                                        item.first_name ? item.first_name : '-',
                                        item.email_id ? item.email_id : '-',
                                        item.role ? item.role : '-',
                                        

                                        [
                                            <Link to={`/app/email_client/createuser/${item._id}`} onClick={() => { this.edit_fun(item._id) }} className="editbtn"><button type="button" className="btn-sm btn btn-primary ">Edit</button></Link>,
                                            <div class="divider" style={{ width: '8px', height: 'auto', display: 'inline-block' }} />,
                                            <button type="button" className={item.login_status == 1 ? "btn-sm btn btn-secondary" : "btn-sm btn btn-warning"} onClick={(e) => { this.userSuspendFun(item._id, item.login_status) }}>{item.login_status == 1 ? 'Active' : 'Inactive'}</button>,
                                            <div class="divider" style={{ width: '8px', height: 'auto', display: 'inline-block' }} />,
                                            <button type="button" className="btn-sm btn btn-danger" onClick={(e) => { this.onMoveBinConformBoxFun(item._id) }}>Move To Bin</button>
                                        ]
                                    ]
                                })}
                                columns={columns}
                                options={options}
                            />
                            <DeleteConfirmationDialog
                                ref="moveBinConDialog"
                                title="Are You Sure Want To Move Bin This Record ?"
                                onConfirm={() => this.onMoveBinConformedFun()}
                            />
                            <DeleteConfirmationDialog
                                ref="suspendConDialog"
                                title={this.state.login_status == 1 ? "Are You Sure Want To Inactive This Record?" : "Are You Sure Want To Active This Record?"}
                                onConfirm={() => this.userSuspendConformedFun()}
                            />
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
            </div>
        );
    }
}
export default ManageUsers;

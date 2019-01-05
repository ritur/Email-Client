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


class BinGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createGroupAllData: [],
            groupId: null,
            sectionReload: false,
            snackbar: false,
            successMessage: '',
            status: 1
        };

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
        //             this.props.history.push('/app/topnegotiator/seminar/binCreatedSeminars')
        //         }
        //         else {
        //             console.log('You are not login');
        //             this.props.history.push('/login');
        //         }
        //     });

        axios.get(BaseUrl +'api/groupApi')
            .then(res => {
                this.setState({ createGroupAllData: res.data });
                console.log(this.state.createGroupAllData);
            });
        
        $('.searchDivCls').hide();
        
    }

    /* FUNCTION CALL ON DELETE BUTTON CLICK AND OPEN DIALOG BOX  */
    onRestoreConformBoxFun(id) {
        var groupId = id;
        this.refs.restoreConDialog.open();
        this.setState({ groupId: groupId });
    }

    /* FUNCTION CALL WHEN DELETE CONFIRM (YES) */
    onRestoreConformedFun() {
        this.refs.restoreConDialog.close();
        this.setState({ sectionReload: true });
        var getgroupId = this.state.groupId;

        setTimeout(() => {
            if (getgroupId) {
                let status = this.state.status;
                console.log('status');
                console.log(status);
                axios.put(BaseUrl +'api/groupApi/' + getgroupId, { status }) //API FOR UPDATE
                    .then((result) => {
                        this.componentDidMount();
                    });
                this.setState({
                    snackbar: true,
                    sectionReload: false,
                    successMessage: 'Record Restored Successfully'
                });
            }
        }, 1500);
    }

    /* FUNCTION CALL ON DELETE BUTTON CLICK AND OPEN DIALOG BOX */
    onDeleteConformBoxFun(id) {
        var groupId = id;
        this.refs.deleteConDialog.open();
        this.setState({ groupId: groupId });
        console.log('msg');
        console.log(this.state.groupId);
    }

    /* FUNCTION CALL WHEN DELETE CONFIRM (YES) */
    onDeleteConformedFun() {
        this.refs.deleteConDialog.close();
        this.setState({ sectionReload: true });
        var groupId = this.state.groupId;

        setTimeout(() => {
            axios.delete(BaseUrl +'api/groupApi/' + groupId)
                .then((result) => {
                    this.componentDidMount();
                });
            this.setState({
                snackbar: true,
                sectionReload: false,
                successMessage: 'Record Deleted Successfully'
            });
        }, 1500);
    }

    /* FUNCTION FOR RENDER THE RECORDS AS TABLE FORM */
    render() {
        const { sectionReload, snackbar } = this.state;
        const columns = ["Group Name", "Group Created At",{ name: "Action", options: { filter: false, sort: false, } }];
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
                        {/*<PageTitleBar title="Group" match={this.props.match} />*/}
                        <RctCollapsibleCard heading="Bin Groups" fullBlock>
                            <MUIDataTable
                                title={"Bin group list"}
                                data=
                                {this.state.createGroupAllData.filter(item => item.status === 0).map(item => {
                                    return [
                                        item.email_id ? item.email_id : '-',
                                        item.create_Date ? item.create_Date : '-',
                                        [
                                            <button type="button" className="btn-sm btn btn-secondary" onClick={(e) => { this.onRestoreConformBoxFun(item._id) }}>Restore</button>,
                                            <div class="divider" style={{ width: '8px', height: 'auto', display: 'inline-block' }} />,
                                            <button type="button" className="btn-sm btn btn-danger" onClick={(e) => { this.onDeleteConformBoxFun(item._id) }}>Delete</button>
                                        ]
                                    ]
                                })}
                                columns={columns}
                                options={options}
                            />
                            <DeleteConfirmationDialog
                                ref="restoreConDialog"
                                title="Are You Sure Want To Restore This Record ?"
                                onConfirm={() => this.onRestoreConformedFun()}
                            />
                            <DeleteConfirmationDialog
                                ref="deleteConDialog"
                                title="Are You Sure Want To Delete Permanently This Record ?"
                                onConfirm={() => this.onDeleteConformedFun()}
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
export default BinGroup;

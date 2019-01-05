/**
 * Email Listing
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

// redux action
import { readEmail, onSelectEmail, markAsStarEmail } from 'Actions';

// component
import EmailListItem from './EmailListItem';

//Intl Message
import IntlMessages from 'Util/IntlMessages';
import axios from 'axios';

import io from "socket.io-client";
import { WSAESTALE } from 'constants';
const SOCKET_URL = "http://localhost:3001";
const socket = io(SOCKET_URL);
let BaseUrl = 'http://localhost:3001/';

class EmailListing extends Component {

    constructor(props) {
        super(props);
        this.state = {

            socket: null,
            composedMessage: "",
            Message: '',
            currentAllMails: [],
            username: '',
            checkSeenStatusData: [],
            myid: '',

            selected: [],
            data:[],
            ItemsChecked:false,
            isTopButtonShow:false

        }

        this.archiveFun = this.archiveFun.bind(this);
        this.markReadFun = this.markReadFun.bind(this);
        this.markUnreadFun = this.markUnreadFun.bind(this);
        
        let that = this;
        socket.on('refresh privateMessages', function (data) {
            that.componentDidMount();
            console.log('the socket data is email listig hai', data)
        });
    }
    /* FUNCTION FOR GET DATA FORM DATABASE*/
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
                        console.log('user data isssssssss', result.data.users_details);
                        let myid = result.data.users_details._id;
                        this.getMails(myid)
                        this.setState({ username: result.data.users_details.first_name, myid: myid })

                        let username = result.data.users_details.first_name
                        socket.emit('enter channel', username);
                    }

                    else {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                });
        }
    }
    getMails(myid) {
        axios.get(BaseUrl + 'api/composemail/findMail/' + myid)
            .then(res => {
                this.setState({ currentAllMails: res.data, data: res.data });
                console.log('current mail data is', this.state.currentAllMails);
            });
    }

    readEmail(email, myid) {
        const { match, history } = this.props;
        history.push(`${match.url}/${email._id}/${myid}`);
    }


    /**
     * On Select Email
     */
    onSelectEmail(e, email) {
        e.stopPropagation();
        this.props.onSelectEmail(email);
    }

    /**
     * Handle Mark As Star Email
     */
    handleMarkAsStar(e, email) {
        e.stopPropagation();
        this.props.markAsStarEmail(email);
    }

    /**
     * Function to return task label name
     */
    getTaskLabelNames = (taskLabels) => {
        let elements = [];
        const { labels } = this.props;
        for (const taskLabel of taskLabels) {
            for (const label of labels) {
                if (label.value === taskLabel) {
                    let ele = <span key={label.value}
                        className={classnames('badge badge-pill', { 'badge-success': label.value === 1, 'badge-primary': label.value === 2, 'badge-info': label.value === 3, 'badge-danger': label.value === 4 })}
                    >
                        <IntlMessages id={label.name} />
                    </span>;
                    elements.push(ele);
                }
            }
        }
        return elements;
    }


    toggleRow(event) {
        let checkedArray = this.state.selected;
        let selectedValue = event.target.value;

        if (event.target.checked === true) {
            checkedArray.push(selectedValue);
            this.setState({
                selected: checkedArray
               
            });

        } else {
            let valueIndex = checkedArray.indexOf(selectedValue);
            checkedArray.splice(valueIndex, 1);

            this.setState({
                selected: checkedArray
                
            });

        }

        if(this.state.selected.length > 0){
            this.setState({isTopButtonShow: true})
        }
        else{
           
            this.setState({ isTopButtonShow: false })
        }
    }

    toggleSelectAll(e) {
        const { checked } = e.target;
        let collection = [];

        if (checked) {
            collection = this.getAllItems();
        }
       
        this.setState({
            selected: collection,
            ItemsChecked: checked
           
        });

        if (checked) {
            this.setState({ isTopButtonShow: true })
        }
        else {

            this.setState({ isTopButtonShow: false })
        }
    }

    getAllItems = () => {
        const collection = [];
        this.state.data.forEach(x => {
            if(x.status === 1){
                collection.push(x._id);
            }
        });
        return collection;
    };

    archiveFun(){
        console.log('laaaaaaaaaaaaaaaaaaaaaa', this.state.selected)
        const { selected} = this.state;
        axios.post(BaseUrl + 'api/composemail/archiveMails/', { selected}) //API FOR INSERT
            .then((result) => {
                this.setState({
                    snackbar: true,
                    successMessage: 'Conversation archived.'
                });
                this.componentDidMount();
             });

    }
    
    markReadFun() {
        console.log('laaaaaaaaaaaaaaaaaaaaaa', this.state.selected)
        const { selected, myid } = this.state;
        axios.post(BaseUrl + 'api/composemail/markReadMails/', { selected, myid }) //API FOR INSERT
            .then((result) => {
                this.setState({
                    snackbar: true,
                    successMessage: 'Conversation marked as read'
                });
                this.componentDidMount();
            });
    }

    markUnreadFun() {
        console.log('laaaaaaaaaaaaaaaaaaaaaa', this.state.selected)
        const { selected, myid } = this.state;
        axios.post(BaseUrl + 'api/composemail/markUnreadMails/', { selected, myid }) //API FOR INSERT
            .then((result) => {
                this.setState({
                    snackbar: true,
                    successMessage: 'Conversation marked as unread'
                });
                this.componentDidMount();
            });
    }

    render() {
        const { currentAllMails, myid, username, ItemsChecked, snackbar } = this.state
        const { emails } = this.props;
        return (
            <div>
                <div className="top-head">
                    <div className="d-flex justify-content-start">
                        <Checkbox color="primary"
                            checked={ItemsChecked}
                            onClick={this.toggleSelectAll.bind(this)}
                        />
                        <span className="selectAllCls">Select All</span>
                        <div className="" style={{marginLeft:'243px',paddingTop:'13px'}}>
                            <ul className="maildetail_ul email_detail_header_common_cls">
                                <li onClick={this.markUnreadFun} style={{ cursor: 'pointer'}}>
                                    <i class="fa fa-envelope-o"  style={{ color: '#808080'  }}></i>&nbsp;
                                        Marks as unread
                                </li>
                                <li onClick={this.markReadFun} style={{ cursor: 'pointer' }}>
                                    <i class="fa fa-envelope-o" style={{ color: '#808080' }}></i>&nbsp;
                                        Marks as read
                                </li>
                                <li onClick={this.archiveFun} style={{ cursor: 'pointer'}}>
                                <i class="fa fa-download" style={{ color: '#808080' }}></i>&nbsp;
                                    Archive
                                </li>
                                
                            </ul>
                        </div>
                        {/*<input type="button" value="click" onClick={this.setDemo} />*/}
                        <div className="text-right">
                            <IconButton className="mx-1 btn-sm">
                                <i className="zmdi zmdi-arrow-left"></i>
                            </IconButton>
                            <IconButton className="mx-1 btn-sm">
                                <i className="zmdi zmdi-arrow-right"></i>
                            </IconButton>
                        </div>
                    </div>

                </div>
                <ul className="list-unstyled m-0">
                    {(this.state.currentAllMails && this.state.currentAllMails.length > 0 && this.state.currentAllMails !== null) ? this.state.currentAllMails.map((email, key) => (
                        email.status == 1 &&
                        <EmailListItem
                            email={email}
                            emailsInner={email.emails}
                            emailsTo={email.emails.to}
                            myusername={username}
                            myid={myid}
                            key={key}
                            onSelectEmail={(e) => this.onSelectEmail(e, email)}
                            onReadEmail={() => this.readEmail(email, myid)}
                            getTaskLabelNames={() => this.getTaskLabelNames(email.email_labels)}
                            
                            value={email._id}
                            checked = { this.state.selected.includes(email._id)}
                            onChange={this.toggleRow.bind(this)}
                             
                        />
                        
            
                    ))
                        :
                        <div className="d-flex justify-content-center align-items-center py-50">
                            <h4>No Emails Found In Selected Folder</h4>
                        </div>
                    }
                </ul>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={snackbar}
                    onClose={() => this.setState({ snackbar: false })}
                    autoHideDuration={5000}
                    message={<span id="message-id">{this.state.successMessage}</span>}
                />
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ emailApp }) => {
    return emailApp;
}

export default withRouter(connect(mapStateToProps, {
    readEmail,
    onSelectEmail,
    markAsStarEmail
})(EmailListing));

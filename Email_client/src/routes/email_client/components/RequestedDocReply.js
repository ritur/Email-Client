
/**
 * Compose Email Component
 */
import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input, InputGroupText } from 'reactstrap';
import ReactQuill from 'react-quill';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// actions
import { sendEmail, emailSentSuccessfully } from 'Actions';
import { hideLoadingIndicator, onNavigateToEmailListing, onDeleteEmail } from 'Actions';
// intl message
import IntlMessages from 'Util/IntlMessages';
import axios from 'axios';
import $ from 'jquery';
import io from 'socket.io-client';
import { Typeahead } from 'react-bootstrap-typeahead';
import { colors } from '@material-ui/core';
const SOCKET_URL = "http://localhost:3001";
const socket = io(SOCKET_URL);
let BaseUrl = 'http://localhost:3001/';



class RequestedDocReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
     
	/**
	 * On Back Press Naviagte To Email Listing Page
	 */
    onBackPress() {
        const { history } = this.props;
        this.props.onNavigateToEmailListing();
        history.goBack();
    }
    
    render() {
        const { fromEmailId,makeRequestedDocReplyFormData} = this.props
        const { to, cc, bcc, subject, message, multiple, allUsers } = this.state;
        return (
            <div>
                {console.log('lalaalalalalalaaaaaaaaaaa', makeRequestedDocReplyFormData)}
                <div className="top-head d-flex justify-content-between align-items-center">
                    <IconButton onClick={() => this.onBackPress()}>
                        <ArrowBackIcon />
                    </IconButton>
                    <h2 className="mb-0 text-capitalize w-75 d-flex align-items-center">{makeRequestedDocReplyFormData.subject}</h2>
                    <div className="wself-70 ">
                        {/*{this.getTaskLabelNames(currentEmail.email_labels)}*/}
                        <ul className="maildetail_ul email_detail_header_common_cls">
                            <li id="UncontrolledTooltipExample">
                                <i class="fa fa-flag-o" style={{ color: 'orange' }}></i>&nbsp;
                                    Orange
                                </li>
                            <li>
                                <i class="fa fa-envelope-o" style={{ color: '#808080' }}></i>&nbsp;
                                    Marks as unread
                                </li>
                            <li>
                                <i class="fa fa-download" style={{ color: '#808080' }}></i>&nbsp;
                                    Archive
                                </li>
                            <li>
                                |
                            </li>
                            <li>CC out</li>
                        </ul>
                    </div>
                </div>
                <div className="outside_shadow">
                    <div className="user-detail d-flex justify-content-between align-items-center py-3 px-4" onClick={this.showDiv} style={{ cursor: 'pointer' }}>
                        <div className="media w-80">
                            <Avatar className="mr-20 rounded">{makeRequestedDocReplyFormData.froms.username.charAt(0)}</Avatar>
                            {/*{currentEmail.from.avatar !== '' ?
                                                    <img src={currentEmail.from.avatar} alt="user profile" className="mr-20 rounded img-fluid" width="50" height="50" />
                                                    : <Avatar className="mr-20 rounded">{currentEmail.from.name.charAt(0)}</Avatar>
                                                }*/}
                            <div className="media-body">
                                <h5 className="mb-1">{makeRequestedDocReplyFormData.froms.username}</h5>
                                <p className="mb-0 font-sm">From <span className="text-muted font-xs">&lt;{makeRequestedDocReplyFormData.froms.email_id}&gt;</span></p>
                                <p className="mb-0 font-sm">To: <span className="text-muted font-xs">Me</span></p>
                            </div>
                        </div>
                        <span className="text-muted w-20 text-right font-xs">{makeRequestedDocReplyFormData.emails.create_Date}, {makeRequestedDocReplyFormData.emails.create_Time}</span>
                    </div>
                    <hr />
                    {/*{this.state.show && (*/}
                    <div>
                        <div className="mail-detail mail_details_msg_comman_cls">
                            <div className="mb-20">
                                <p>{makeRequestedDocReplyFormData.emails.docName}</p>
                            </div>
                            <span className="d-block fw-semi-bold font-sm">Regards,</span>
                            <span className="d-block font-xs text-muted">{makeRequestedDocReplyFormData.froms.username}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// map state to props
const mapStateToProps = ({ emailApp }) => {
    return emailApp;
};


export default withRouter(connect(mapStateToProps, {
    hideLoadingIndicator,
    onNavigateToEmailListing,
    onDeleteEmail
})(RequestedDocReply));

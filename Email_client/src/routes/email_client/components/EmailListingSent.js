/**
 * Email Listing
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';

// redux action
import { readEmail, onSelectEmail, markAsStarEmail } from 'Actions';

// component
import EmailListItemSent from './EmailListItemSent';

//Intl Message
import IntlMessages from 'Util/IntlMessages';
import axios from 'axios';
let BaseUrl = 'http://localhost:3001/';

class EmailListingSent extends Component {

    constructor(props) {
        super(props);
        this.state = {

            socket: null,
            composedMessage: "",
            Message: '',
            currentAllSendedMails: [],
            username:'',
            checkSeenStatusData:[]

        }
    }
    /* FUNCTION FOR GET DATA FORM DATABASE*/
    componentDidMount() {
        let token = localStorage.getItem('token');
        
        if (token) {
            axios.get(BaseUrl +'api/usersAuth/checkSession/sessionGotted/' + token)
                .then(result => {
                    if (result.data.failed) {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                    else if (result.data.message) {
                        console.log('user data isssssssss', result.data.users_details);
                        let myid   = result.data.users_details._id;
                        this.getMails(myid)
                        this.setState({ username: result.data.users_details.first_name })
                    }

                    else {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                });
        }
    }
    getMails(myid){
        axios.get(BaseUrl +'api/composemail/sendedMail/' + myid)
        .then(res => {
            this.setState({ currentAllSendedMails: res.data });
            console.log('current mail data is', this.state.currentAllSendedMails);
        });
    }

    readEmail(email) {
        const { match, history } = this.props;
        history.push(`${match.url}/${email._id}`);
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

    render() {
        const { currentAllSendedMails, username } = this.state
        const { emails } = this.props;
        return (
            <div>
                <div className="top-head">
                    <div className="d-flex justify-content-start">
                        <Checkbox color="primary"
                            value="SelectMail"
                        />
                        <span className="selectAllCls">Select All</span>

                    </div>
                </div>
                <ul className="list-unstyled m-0">
                    {(this.state.currentAllSendedMails && this.state.currentAllSendedMails.length > 0 && this.state.currentAllSendedMails !== null) ? this.state.currentAllSendedMails.map((email, key) => (
                        email.status == 1 &&
                        <EmailListItemSent
                            email={email}
                            emailFrom={email.emails.froms}
                            emailTo={email.emails.to.slice(0, 2)}
                            myusername={username}
                            key={key}
                            onSelectEmail={(e) => this.onSelectEmail(e, email)}
                            onReadEmail={() => this.readEmail(email)}
                            getTaskLabelNames={() => this.getTaskLabelNames(email.email_labels)}
                        />
                         
                    ))
                        :
                        <div className="d-flex justify-content-center align-items-center py-50">
                            <h4>No Emails Found In Selected Folder</h4>
                        </div>
                    }
                </ul>
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
})(EmailListingSent));

/**
 * Inbox Emails
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, withRouter, Route } from 'react-router-dom';

// components
import EmailListing from '../components/EmailListing';
import EmailDetail from '../components/EmailDetail';
import $ from 'jquery';
// redux actions
import { getInbox } from 'Actions';
import axios from 'axios';
let BaseUrl = 'http://localhost:3001/';

class Inbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fromsData: { froms: { id: '', username: '', email_id: '' } }
        }    
    }
    /* FUNCTION FOR GET SELECT VALUE BASED ON ID FOR UPDATE QUESTIONS */
    componentDidMount() {
        let token = localStorage.getItem('token');
        let that = this;
        if (token) {
            axios.get(BaseUrl +'api/usersAuth/checkSession/sessionGotted/' + token)
                .then(result => {
                    if (result.data.failed) {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                    else if (result.data.message) {
                        console.log('user data is', result.data.users_details);
                        this.setState({ fromsData: { froms: { id: result.data.users_details._id, username: result.data.users_details.first_name, email_id: result.data.users_details.email_id } } })
                        this.props.history.push('/app/email_client/folder/inbox')
                    }

                    else {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                });
        }
    }
    componentWillMount() {
        this.props.getInbox();
        $('.searchDivCls').show();
    }

    render() {
        const { match } = this.props;
        const { fromsData} = this.state
        return (
                <div>
                    <Switch>
                        <Route exact path={match.url} component={EmailListing} />
                        <Route path={`${match.url}/:id/:myid`}  render={(routeProps) => (<EmailDetail {...routeProps} fromsData={fromsData} />)}  />
                    </Switch>
                </div>
        );
    }
}

export default withRouter(connect(null, {
    getInbox
})(Inbox));

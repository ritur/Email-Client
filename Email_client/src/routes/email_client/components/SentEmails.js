/**
 * Sent Emails
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, withRouter, Route } from 'react-router-dom';

// components
import EmailListingSent from '../components/EmailListingSent';
import EmailDetailSent from '../components/EmailDetailSent';

// redux actions
import { getSentEmails } from 'Actions';
import $ from 'jquery';
class SentEmails extends Component {

    componentWillMount() {
        this.props.getSentEmails();
        $('.searchDivCls').show();
    }

    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route exact path={match.url} component={EmailListingSent} />
                <Route path={`${match.url}/:id`} component={EmailDetailSent} />
            </Switch>
        );
    }
}

export default withRouter(connect(null, {
    getSentEmails
})(SentEmails));

/**
 * Sent Emails
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, withRouter, Route } from 'react-router-dom';

// components
import EmailListingRequestedDoc from '../components/EmailListingRequestedDoc';
import EmailDetailRequestedDoc from '../components/EmailDetailRequestedDoc';

// redux actions
import { getSentEmails } from 'Actions';
import $ from 'jquery';
class RequestedDocHeader extends Component {

    componentWillMount() {
        this.props.getSentEmails();
        $('.searchDivCls').show();
    }

    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route exact path={match.url} component={EmailListingRequestedDoc} />
                <Route path={`${match.url}/:id`} component={EmailDetailRequestedDoc} />
            </Switch>
        );
    }
}

export default withRouter(connect(null, {
    getSentEmails
})(RequestedDocHeader));

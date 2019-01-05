/**
 * Trash Emails
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, withRouter, Route } from 'react-router-dom';

// components
import ArchiveEmailsListing from '../components/ArchiveEmailsListing';
import ArchiveEmailsDetails from '../components/ArchiveEmailsDetails';
import $ from 'jquery';
// redux actions
import { getTrashEmails } from 'Actions';

class ArchiveEmails extends Component {

    componentWillMount() {
        this.props.getTrashEmails();
        $('.searchDivCls').show();
    }

    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route exact path={match.url} component={ArchiveEmailsListing} />
                <Route path={`${match.url}/:id/:myid`} component={ArchiveEmailsDetails} />
            </Switch>
        );
    }
}

export default withRouter(connect(null, {
    getTrashEmails
})(ArchiveEmails));

/**
 * Eamil Search
 */
import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';
import { connect } from 'react-redux';

// actions
import { searchEmail, updateSearchEmail } from 'Actions';

class EmailSearch extends Component {

    /**
     * On Search Email
     */
    onSearchEmail(e) {
        this.props.updateSearchEmail(e.target.value);
        this.props.searchEmail(e.target.value);
    }

    render() {
        const { searchEmailText } = this.props;
        return (
            <FormGroup className="mb-0 Search_div" >
                <Input
                    type="text"
                    name="search"
                    className="searchBox"
                    id="search-todo"
                    placeholder="Search email here"
                    onChange={(e) => this.onSearchEmail(e)}
                    value={searchEmailText}
                />
                <div className="searchicondiv">
                    <i class="fa fa-search" aria-hidden="true"></i>
                </div>
            </FormGroup>
        );
    }
}

// map state to props
const mapStateToProps = ({ emailApp }) => {
    return emailApp;
}

export default connect(mapStateToProps, {
    updateSearchEmail,
    searchEmail
})(EmailSearch);
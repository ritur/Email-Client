
/**
 * Compose Email Component
 */
import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input, InputGroupText } from 'reactstrap';
import ReactQuill from 'react-quill';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// actions
import { sendEmail, emailSentSuccessfully } from 'Actions';

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

// modules
const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean'],
        [{ 'align': [] }]
    ],
};

// formats
const formats = [
    'header',
    'font',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'align'
];

/*************** for type head */



export default class EmailSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            to: [],
            to1: [],
            frndData: [],
            cc: '',
            bcc: '',
            mail_type: '',
            subject: '',
            message: '',
            ccshow: false,
            Bccshow: false,
            froms: [{ id: '', username: '', email_id: '' }],
            multiple: true,
            currentUsersAllData: [],
            currentGroupAllData: [],
            allUsers: []

        }
    }
    /* FUNCTION FOR GET DATA FORM DATABASE*/
    componentDidMount() {
        let token = localStorage.getItem('token');
        let allUsersMerge = [];
        if (token) {
            axios.get(BaseUrl +'api/usersAuth/checkSession/sessionGotted/' + token)
                .then(result => {
                    if (result.data.failed) {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                    else if (result.data.message) {
                        console.log('user data is', result.data.users_details);
                        this.setState({ froms: { id: result.data.users_details._id, username: result.data.users_details.first_name, email_id: result.data.users_details.email_id } })
                        let username = result.data.users_details.first_name
                        socket.emit('enter channel', username);
                        //this.props.history.push('/app/email_client/folder/inbox')
                    }

                    else {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                });
        }
        axios.get(BaseUrl +'api/usersAuth/getSelectedUserFields')
            .then(res => {
                this.setState({ currentUsersAllData: res.data });
            });

        let id = this.props.fromEmailId
        axios.get(BaseUrl +'api/usersAuth/getSelectedUserFields/' + id)
            .then(res => {
                console.log(res.data)
                var arr = [];
                arr.push(res.data);
                console.log('form daaaaaaaata is', arr)
                this.setState({ frndData: arr,to:arr });
            });

        axios.get(BaseUrl +'api/groupApi/getSelectedGroupFields')
            .then(res => {
                this.setState({ currentGroupAllData: res.data });
                this.margeAllRecipient()
            });

        $(document).ready(function () {
            $(document).on('click', '.PowerSelectMultiple__OptionsContainer', function () {
                $('.PowerSelect__Options').hide();
            })
            $(document).on('keypress', '.PowerSelectMultiple__OptionsContainer', function () {
                $('.PowerSelect__Options').show();
            })
            
        })
        console.log('makeReplyFormdata iisssssssssssssssssssssssss',this.props.makeReplyFormdata)
    }
    margeAllRecipient() {
        let arr1 = this.state.currentUsersAllData;
        let arr2 = this.state.currentGroupAllData;
        let arr3 = arr1.concat(arr2);
        console.log('final data is demo function', arr3);
        this.setState({ allUsers: arr3 })
    }
    /**
     * On Send Email
     */

    ccShowFun = () => {
        const { ccshow } = this.state;

        this.setState({ ccshow: !ccshow })
    }

    BccShowFun = () => {
        const { Bccshow } = this.state;

        this.setState({ Bccshow: !Bccshow })
    }

    handleChange = ( selectedOption ) => {
        this.setState({ frndData: selectedOption })
        console.log('this is options', selectedOption)
        const array = selectedOption;
        const array1 = [];
        const array2 = [];
        const array3 = [];

        array.forEach(obj => {
            switch (obj.receive_mail_type) {
                case 'Direct':
                    array1.push(obj);
                    break;
                case 'Group':
                    array2.push(obj);
                    break;
                default:
                    array3.push(obj);
                    break;
            }
        });
        this.setState({ to: array1 })
        this.setState({ to1: array2 })
        console.log('Array 1 is', array1);
        console.log('Array 2 is', array2);



        // var res;
        // selectedOption.forEach((items) => (
        //     res = Object.keys(items).length
        // ))
        // if(res === 4)
        // {
        //     alert('set for users');
        //     let userFilter = selectedOption.filter(person => person.receive_mail_type != 'Group');
        //     console.log('yessssssssss for user ', userFilter)
        //     this.setState({ to: userFilter })

        // }
        // else
        // {
        //     alert('set for group');
        //     let groupUserFilter = selectedOption.filter(person => person.receive_mail_type != 'Direct');
        //     console.log('yessssssssss for group', groupUserFilter)
        //     let groupMembers = [];
        //     groupUserFilter.forEach(element => {
        //         element.groupMembers.forEach(items => {
        //             let obj1 = items;
        //             let obj2 = { seen: 0, receive_mail_type: 'Group' };
        //             let res = { ...obj1, ...obj2 }
        //             groupMembers.push(res)
        //             this.setState({ to1: groupMembers })
        //         });
        //     });   
        // }
    }


    // handleChange1 = (selectedOption1) => {

    //     let groupMembers = [];
    //     selectedOption1.forEach(element => {
    //         element.groupMembers.forEach(items => {
    //             let obj1 = items;
    //             let obj2 = { seen: 0, receive_mail_type: 'Group' };
    //             let res = { ...obj1, ...obj2 }
    //             groupMembers.push(res)
    //             this.setState({ to1: groupMembers })
    //         });
    //     });
    //     console.log(`Option for group selected:`, selectedOption1);

    // }
    /* FUNCTION FOR SUBMIT RECORDS(INSERT & UPDATE) */
    handlePrivateSubmit = (e) => {
        e.preventDefault();

        let groupMembers = [];
        this.state.to1.forEach(element => {
            element.groupMembers.forEach(items => {
                let obj1 = items;
                let obj2 = { seen: 0, receive_mail_type: 'Group' };
                let res = { ...obj1, ...obj2 }
                groupMembers.push(res)
            });
        });
        console.log('the all users arerrrrrrr', this.state.to)
        console.log('the all group arerrrrrrr', groupMembers)

        var array1 = this.state.to;
        var array2 = groupMembers;

        let to = [...new Map([...array1, ...array2].map(o => [o.email_id, o])).values()];

        console.log('final result is', to);

            const {makeReplyFormdata} = this.props;
            let 
                parent_id = this.props.parent_id,
                subject = makeReplyFormdata.subject,
                root_id = makeReplyFormdata.root_mail_id,
                mail_type = makeReplyFormdata.mail_type,
                type = 'Reply';
            const { froms, message } = this.state;

            console.log('the all dataa issssssssssssssssssssssssssss','parent_id:',parent_id,'to:',to, 'froms:',froms,'root_id:', root_id,'type:', type, 'mail_type:',mail_type, 'subject:',subject, 'message:',message)
            axios.put(BaseUrl +'api/composemail/replyApi/' +root_id,{ parent_id,to, froms, type, mail_type, subject, message }) //API FOR INSERT
                .then((result) => {
                    this.setState({
                        snackbar: true,
                        sectionReload: false,
                        successMessage: 'Mail Sended Successfully'
                    });
                    this.props.history.push("/app/email_client/folder/inbox") 
                });
        {/*setTimeout(() => { this.props.history.push("/app/email_client/compose") }, 2500);*/}
        // this.sendPrivateMessage();
    }


    sendPrivateMessage = () => {
        let to = this.state.to;
        let subject = this.state.subject;

        const socketMsg = {
            to: this.state.to,
            from: this.state.username,
            mail_type: this.state.mail_type,
            subject: this.state.subject,
            message: this.state.message
        }
        console.log('compose form data is', socketMsg);
        socket.emit('new privateMessage', socketMsg);
    }

    onSendEmail() {

        const { history } = this.props;
        const { to, subject, message } = this.state;
        if (to !== '' && subject !== '' && message !== '') {
            this.props.sendEmail();
            history.push('/app/mail/folder/sent');
            setTimeout(() => {
                this.props.emailSentSuccessfully();
            }, 2000);
        }
    }

    /**
     * On Change Form Values
     */
    onChangeFormValue(key, value) {
        this.setState({ [key]: value });
    }



    render() {
        const { fromEmailId} = this.props
        const { to, cc, bcc, subject, message, multiple, allUsers } = this.state;
        return (
            <div className="compose-email-container replyContainerCls">
                <InputGroup className="selfinputgroup">
                    <InputGroupAddon addontype="prepend">
                        <InputGroupText>To:</InputGroupText>
                    </InputGroupAddon>
                    {/*<Input
                        name="to"
                        type="email"
                        value={to}
                        onChange={(e) => this.onChangeFormValue('to', e.target.value)}
                    />*/}
                    <Typeahead className="selfinputgroup1"
                        labelKey="email_id"
                        multiple={multiple}
                        options={allUsers}
                        selected={this.state.frndData}
                        onChange={this.handleChange}
                        placeholder=""
                        minLength={0}
                        onKeyDown={this.keyDown}
                    />
                </InputGroup>

                {this.state.ccshow &&
                    <InputGroup className="selfinputgroup">
                        <InputGroupAddon addontype="prepend">
                            <InputGroupText>CC</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            name="cc"
                            type="email"
                            value={cc}
                            onChange={(e) => this.onChangeFormValue('cc', e.target.value)}
                        />
                    </InputGroup>
                }
                {this.state.Bccshow &&
                    <InputGroup className="selfinputgroup">
                        <InputGroupAddon addontype="prepend">
                            <InputGroupText>BCC</InputGroupText>
                        </InputGroupAddon>
                        <Input
                            name="bcc"
                            type="email"
                            value={bcc}
                            onChange={(e) => this.onChangeFormValue('bcc', e.target.value)}
                        />
                    </InputGroup>
                }
                <ReactQuill
                    modules={modules}
                    formats={formats}
                    value={message}
                    onChange={(value) => this.onChangeFormValue('message', value)}
                    style={{ height: 200 }}
                />
                <div className="compose-email-actions p-10">
                    <Button className="btn-primary text-white" onClick={this.handlePrivateSubmit} style={{ borderRadius: 20, marginRight: 20 }}>
                        <Icon className="mr-10">send</Icon>
                        <IntlMessages id="widgets.send" />
                    </Button>

                    {/*<Button className="text-white" onClick={() => this.onSendEmail()} style={{ MarginLeft: 10, backgroundColor: "grey", borderRadius: 20 }}>
                        Send Later
                    </Button>*/}
                    <div style={{ float: 'right' }}>
                        <i class="fa fa-paperclip pl10" style={{ fontSize: 15 }}></i>
                        <Button>
                            B
                     </Button>
                        <i class="fa fa-list" style={{ paddingRight: 10 }}></i>
                        <i class="fa fa-list-ol" style={{ paddingLeft: 10 }}></i>

                        <Button onClick={this.ccShowFun}>
                            Cc
                        </Button>
                        <Button onClick={this.BccShowFun}>
                            Bcc
                        </Button>
                        {/*<IconButton onClick={() => this.closeReplyEmailBox()}>
                            <i className="zmdi zmdi-delete"></i>
                        </IconButton>*/}
                    </div>
                </div>
            </div>
        );
    }
}


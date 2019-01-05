import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import ConfidentialEmail from './confidentialemail';
import { Typeahead } from 'react-bootstrap-typeahead';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
let BaseUrl = 'http://localhost:3001/';
import $ from 'jquery';

export default class EmailSearch extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          modal: false,
          modelOne:false,
          allUsers:[],
          multiple:true,
          isRequestMail:1,
          to:[],
          froms: [{ id:'', username: '', email_id: '' }],
          mail_type:'important',
          documentName:'',
          sectionReload:false,
          snackbar: false,
          successMessage:''
         
        };
    
        this.toggle = this.toggle.bind(this);
        this.toggleOne = this.toggleOne.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }
      componentDidMount(){
        let that = this;
        let token = localStorage.getItem('token');
        if (token) {
            axios.get(BaseUrl + 'api/usersAuth/checkSession/sessionGotted/' + token)
                .then(result => {
                    if (result.data.failed) {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                    else if (result.data.message) {
                        this.setState({ froms: {id: result.data.users_details._id,  username: result.data.users_details.first_name, email_id: result.data.users_details.email_id } })
                    }

                    else {
                        console.log('Error here');
                        this.props.history.push('/login')
                    }
                });
        }
        axios.get(BaseUrl + 'api/usersAuth/getSelectedUserFieldsForRequestDoc') //USE FOR PUT CASE TYPE DROPDOWN 
          .then(res => {
            this.setState({ allUsers: res.data });
            console.log('the users are', this.state.allUsers);
          });

          $(document).ready(function () {
            $(document).on('click','.requestDocCls',function () {
              if (that.state.modal){
                $('.form-control.rbt-input-multi.rbt-input').css({ 'background':'#F0F0F0'});
                
              }
            })
          })
      }
      toggle() {
        this.setState({
          modal: !this.state.modal
        });  
        this.setState({ to:'',documentName:''})
      }
      toggleOne(){
        this.setState({
            modal: !this.state.modelOne
          });  
      }

      handleChangeUsers = (selectedOption) => {
        this.setState({ to: selectedOption });
        console.log('the options are', selectedOption)
      }

  handleChange(event) {
    this.setState({documentName: event.target.value });
  }
  
    /* FUNCTION FOR SET VALIDATION */
    setValidation() {
      let formIsValid = true;

      if (this.state.to.length == 0) {
        formIsValid = false;
        this.setState({ recipientsError: true })
      }
      else {
        this.setState({ recipientsError: false })
      }

      if (!this.state.documentName) {
        formIsValid = false;
        this.setState({ descriptionError: true })
      }
      else {
        this.setState({ descriptionError: false })
      }

      
      return formIsValid;
    }
  /* FUNCTION FOR SUBMIT RECORDS(INSERT & UPDATE) */
  handleSaveData = (e) => {
    e.preventDefault();
    if (this.setValidation()) {
      this.setState({ sectionReload: true });
      setTimeout(() => { 
        const {mail_type, to,froms,documentName ,isRequestMail} = this.state;
       
        let subject = "Document request – " + documentName
        console.log('the doc sssssssssss', isRequestMail,mail_type, subject, to,froms,documentName)
        axios.post(BaseUrl + 'api/composemail', { isRequestMail,mail_type, subject, to,froms,documentName}) //API FOR INSERT
          .then((result) => {
            this.setState({
              snackbar: true,
              sectionReload: false,
              modal:false,
              successMessage: 'Record Inserted Successfully'
            });
          });
        
       }, 1500);
       setTimeout(() => { this.props.history.push("/app/email_client/folder/inbox") }, 2500);
    }
    else {
      this.setState({ formErrorAlert: true })
    }
  }

    render() {
        const { searchEmailText } = this.props;
        const{multiple,sectionReload, snackbar} = this.state;
        return (
              <div>
                {/*<p style={{display:'inline'}}>
                  <i class="fa fa-clock-o" style={{color:'#c3c3c3'}}></i>&nbsp;&nbsp;
                  <span style={{marginRight:10}}>Reminders</span>
                </p>
                <div className="reminderDiv">
                  <div className="reminderDivinner">
                    <p>Shareholders Meeting <br/> <span style={{fontSize:12}}>04:30 PM / Jul 01, 2018</span></p>
                  </div>    
                  <i class="fa fa-check-circle" ></i>
                </div>    

                <div className="reminderDiv">
                  <div className="reminderDivinner">
                    <p>Team Building Meeting <br/> <span style={{fontSize:12}}>12:30 PM / Jul 01, 2018</span></p>
                  </div>    
                  <i class="fa fa-check-circle" ></i>
                </div> */}   
                <div className="reminder_div">
                  <p style={{display:'inline',cursor:'pointer'}} onClick={this.toggle} className="requestDocCls">
                    <i class="fa fa-file-text-o" style={{color:'#c3c3c3'}}></i>&nbsp;&nbsp;
                    <span style={{marginRight:10}}>Request Document</span>
                  </p>
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
                </div>
                {/*<ConfidentialEmail />*/}

            <Modal isOpen={this.state.modal} className={this.props.className} style={{marginTop:150}}>
              <ModalHeader toggle={this.toggle} style={{borderBottom:0}}><p style={{fontSize:20}}>Request Document</p></ModalHeader>
                {sectionReload &&
                        <RctSectionLoader />
                    }
                <ModalBody>
                    <p style={{marginBottom:5}}>Person Name</p>
                    <Typeahead className="txtinputDocument"
                      labelKey="email_id"
                      multiple={multiple}
                      options={this.state.allUsers}
                      onChange={this.handleChangeUsers}
                      selected={this.state.to}
                      placeholder="Select person"
                      minLength={0}
                      onKeyDown={this.keyDown}
                    />
                    {this.state.recipientsError ? <span style={{ color: "red" }}>Select recipient</span> : ''}   
                    
                    <p style={{marginBottom:5,marginTop:'10px'}}>Description</p>
                    <Input type="text" name="documentName" placeholder="Enter description of the document."  className="txtinputDocument" value={this.state.documentName} onChange={this.handleChange} />
                    {this.state.descriptionError ? <span style={{ color: "red" }}>Enter name of the document. </span> : ''}<br/>
                    
                    <p style={{display:'inline',marginTop:20}} >
                      <i class="fa fa-paperclip" style={{color:'#c3c3c3'}}></i>&nbsp;&nbsp;
                      <span>Attachment</span>&nbsp;&nbsp;
                      <i class="fa fa-plus" style={{color:'#70af1a'}}></i>&nbsp;&nbsp;
                      <span style={{textDecoration:'underline'}}>important document doc</span>
                    </p>    
                </ModalBody>
                <ModalFooter style={{justifyContent:'flex-start',borderTop:0}}>
                    <Button color="primary btncreateRequest" onClick={this.handleSaveData}>
                    <i class="fa fa-file-text-o" style={{color:'white'}}></i>&nbsp;&nbsp;
                      Create Request
                    </Button>
                </ModalFooter>
           </Modal>

            {/* confidential email model */}
            {/* <Modal  isOpen={this.state.modelOne} toggle={this.toggleOne} className={this.props.className} style={{marginTop:150}}>
                <ModalHeader  toggle={this.toggleOne} style={{borderBottom:0}}><p style={{fontSize:20}}>Confidential Email</p></ModalHeader>
                <ModalBody>
                   <p style={{marginBottom:5}}>Insert the code</p>
                   <p><input type="text" className="txtinputDocument"  /></p> 
                </ModalBody>
                <ModalFooter style={{justifyContent:'flex-start',borderTop:0}}>
                    <Button color="primary btncreateRequest" >
                     Submit
                    </Button>
                </ModalFooter>
           </Modal> */}
          </div>   
        );
    }
}


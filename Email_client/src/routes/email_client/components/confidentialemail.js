/**
 * Eamil Search
 */
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export default class EmailSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modal: false,
        };
    
        this.toggle = this.toggle.bind(this);
      }
    
      toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }
     

    render() {
        const { searchEmailText } = this.props;
        return (
            <div>
            
               <div className="reminder_div">
                 <p style={{display:'inline',cursor:'pointer'}} onClick={this.toggle}>
                     <i class="fa fa-file-text-o" style={{color:'#c3c3c3'}}></i>&nbsp;&nbsp;
                     <span style={{marginRight:10}}>Confidential Email</span>
                </p>
              </div>


            {/* confidential email model */}
            <Modal  isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} style={{marginTop:150}}>
                <ModalHeader toggle={this.toggle} style={{borderBottom:0}}>
                 <p style={{fontSize:20,display:'inline'}}>
                  <i class="fa fa-shield" style={{color:'#909090',fontSize:25}}></i>&nbsp;&nbsp;
                  Confidential Email
                 </p>
                </ModalHeader>
                <ModalBody>
                   <p style={{marginBottom:5}}>Insert the code</p>
                   <p><input type="text" className="txtinputDocument" style={{border:0,background:'#f2f2f2',paddingLeft:10}}  /></p> 
                </ModalBody>
                <ModalFooter style={{justifyContent:'flex-start',borderTop:0}}>
                    <Button color="primary btncreateRequest" style={{width:'30%'}} >
                     Submit
                    </Button>
                </ModalFooter>
           </Modal>
          </div>   
        );
    }
}


import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, FormText, FormFeedback, Label, Input } from 'reactstrap';
import axios from 'axios';

const api = process.env.REACT_APP_API_DOMAIN;

class ReportBugModal extends React.Component {
  constructor(props){
    super(props);
    this.state = ({ bugDescription: '',
                    replicationSteps: '',
                    email: '',
                    emailValid: null,
                    emailInvalid: null,
                    disabled: true });
  }

  // --------------------------------
  // Update state with input values
  updateDescription = (e) => {
    if (e.target.value===''){
      this.setState({ bugDescription: e.target.value,
                      disabled: true });
    } else {
      this.setState({ bugDescription: e.target.value,
                      disabled: false });
    }
  }
  updateReplication = (e) => {
    this.setState({ replicationSteps: e.target.value} );
  }
  updateEmail = (e) => {
    let email = e.target.value;
    this.setState({ email: email, emailValid: this.validEmail(email), emailInvalid: null });
  }
  // --------------------------------

  // POST bug to server endpoint which will then send an email about the bug
  postBug = () => {
    if (this.state.email !== ''){
      if (this.state.emailValid){
        this.toggle();
      } else {
        this.setState({ emailInvalid: true });
      }
    } else {
      this.toggle();
    }
  }

  toggle = () => {
    this.setState({ bugDescription: '', replicationSteps: '', emailValid: null, disabled: true });
    this.props.toggleBugModal();
  }

  // Get form status, will be disabled if the description field is empty
  isDisabled = () => {
    return this.state.disabled;
  }

  validEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.reportBug} toggle={this.toggle} centered={true}>
          <ModalHeader toggle={this.toggle}>Report an Issue</ModalHeader>
          <ModalBody>
            Enter the details about the bug you've found below
          </ModalBody>
          <Form style={{marginLeft: '10px', marginRight: '10px'}}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input valid={this.state.emailValid} invalid={this.state.emailInvalid} placeholder="Email Address" onChange={this.updateEmail}/>
              <FormFeedback>{this.state.emailInvalid ? 'Please enter a valid email address' : ''}</FormFeedback>
              <FormText>Just in case we need more info about the issue</FormText>
            </FormGroup>
            <hr className="my-2" />
            <FormGroup>
              <Label for="bugDescription">Description<span style={{color:'red'}}> *</span></Label>
              <Input type="textarea" style={{height: '80px'}} placeholder="Please describe the issue" onChange={this.updateDescription}/>
            </FormGroup>
            <FormGroup>
              <Label for="replicationSteps">Steps to replicate the issue</Label>
              <Input type="textarea" style={{height: '100px'}} placeholder="What can we do find this bug?" onChange={this.updateReplication}/>
            </FormGroup>
          </Form>
          <ModalFooter>
            <Button color="primary" onClick={this.postBug} disabled={this.isDisabled()}>Report</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ReportBugModal;
// React imports
import { useState } from 'react'
// Bootstrap imports
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
// CSS imports
import appStyles from '../../App.module.css'
import btnStyles from '../../styles/Button.module.css'
// Component imports
import { axiosRes } from '../../api/axiosDefaults';
import AlertMessage from '../../components/AlertMessage';
import Modal from 'react-bootstrap/Modal';
import ModalFooter from "react-bootstrap/ModalFooter";

const AdoptionmessageCreateForm = (props) => {

  const {sendToProfile, profileId, mobile, owner, showModal, handleClose} = props

  const [name, setName] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [adoptionmessage, setMessage] = useState(""); 
  const [errors, setErrors] = useState({});

  // Variables to display success alert when message is sent successfully
  const [variant, setVariant] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target; 
    switch (name) {
        case 'name':
            setName(value); 
            break;
        case 'phone': 
            setPhone(value); 
            break; 
        case 'email': 
            setEmail(value); 
            break; 
        case 'adoptionmessage':
            setMessage(value); 
            break; 
        default: 
        // Execute code here, if none of the above cases are met
            break;   
    }
};

  const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();

      formData.append("profile", profileId);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("adoptionmessage", adoptionmessage);
      try {
        await axiosRes.post('/adoptionrequest/', formData);
        setName("")
        setPhone("")
        setEmail("")
        setMessage("")
        setShowAlert(true)
        setVariant("success")
        setAlertMessage("Your request has been sent successfully")

      } catch (err) {
        // console.log(err)
        if (err.response?.status !== 401) {
          setErrors(err.response?.data);
        }
      }
  };



  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send an adoption request to {owner}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container
          className={`${appStyles.Content} mb-3 text-center ${
            mobile && "d-lg-none"
          }`}
        >
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Send an Adoption request to {sendToProfile}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={handleChange}
              />
              <Form.Control
                type="number"
                placeholder="Phone"
                name="phone"
                value={phone}
                onChange={handleChange}
              />
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter your contact details here:"
                name="adoptionmessage"
                value={adoptionmessage}
                onChange={handleChange}
              />
            </Form.Group>
            {errors?.adoptionmessage?.map((adoptionmessage, idx) => (
              <Alert variant="warning" key={idx}>
                {adoptionmessage}
              </Alert>
            ))}

            
            
          </Form>
          <AlertMessage showAlert={showAlert} setShowAlert variant={variant} alertMessage={alertMessage}/>

        </Container>
        <ModalFooter>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Form}`} 
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className={`${btnStyles.Button} ${btnStyles.Form}`}
                type="submit"
                onClick={handleSubmit}
              >
                Send
              </Button>
        </ModalFooter>
        
        
      </Modal.Body>
    </Modal>
  )
}

export default AdoptionmessageCreateForm
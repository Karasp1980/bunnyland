import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import btnStyles from "../../styles/Button.module.css";
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import appStyles from '../../App.module.css'
import Alert from 'react-bootstrap/Alert';
import AlertMessage from '../../components/AlertMessage';



const Adoptionpost = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    adoptioncomments_count,
    adoptionlikes_count,
    adoptionlike_id,
    title,
    content,
    image,
    updated_at,
    adoptionpostPage,
    setPosts,
    breed,
    location,
    sex,
    age,
    sendToProfile, 
    
    mobile,
    
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const profileId=currentUser?.profile_id
  

  const handleEdit = () => {
    history.push(`/adoptionposts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/adoption/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.adoption("/adoptionlikes/", { adoption: id });
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((adoption) => {
          return adoption.id === id
            ? { ...adoption, adoptionlikes_count: adoption.adoptionlikes_count + 1, adoptionlike_id: data.id }
            : adoption;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/adoptionlikes/${adoptionlike_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((adoption) => {
          return adoption.id === id
            ? { ...adoption, adoptionlikes_count: adoption.adoptionlikes_count - 1, adoptionlike_id: null }
            : adoption;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  }

  const handleShowModal = () => {
    setShowModal(true);
  }

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
  
  const handleSubmit = async (adoption) => {
      adoption.preventDefault();
      const formData = new FormData();

     
      formData.append("profile", parseInt(profileId));
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
        console.log(err)
        if (err.response?.status !== 401) {
          setErrors(err.response?.data);
          console.log(err.response?.data)
        }
      }
  };

  return (
    <div>
    <Card className={styles.Adoptionpost}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && adoptionpostPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/adoptionposts/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : adoptionlike_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {adoptionlikes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {adoptioncomments_count}
        </div>

        <div className="d-flex justify-content-between">
          <div>
            <span>Breed: </span>
            <span>{breed}</span>
          </div>
          <div>
            <span>Location: </span>
            <span>{location}</span>
          </div>
          <div>
            <span>Sex: </span>
            <span>{sex}</span>
          </div>
          <div>
            <span>Age:</span>
            <span>{age}</span>
          </div>
        </div>
        <br></br>
        {currentUser && (
        <div>
          <button className={`${btnStyles.Button} ${btnStyles.Black}`} onClick={handleShowModal}>Adoption Request</button>
        </div>)}
      </Card.Body>
    </Card>
    
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
              <Form.Label>Your contact details:{sendToProfile}</Form.Label>
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
                placeholder="Write a message here:"
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

          </Form>
          <AlertMessage showAlert={showAlert} setShowAlert variant={variant} alertMessage={alertMessage}/>

        </Container>
        
        
      </Modal.Body>
    </Modal>
    </div>
  );
}

export default Adoptionpost;  
import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function AdoptionpostEditForm() {
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    breed: "",
    location: "",
    sex: "",
    content: "",
    image: "",
  });
  const { title, breed, location, sex, age, content, image } = postData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/adoption/${id}/`);
        const { title, breed, location, sex, age, content, image, is_owner } = data;

        is_owner ? setPostData({ title, breed, location, sex, age, content, image }) : history.push("/");
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [history, id]);

  const handleChange = (adoption) => {
    setPostData({
      ...postData,
      [adoption.target.name]: adoption.target.value,
    });
  };

  const handleChangeImage = (adoption) => {
    if (adoption.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(adoption.target.files[0]),
      });
    }
  };

  const handleSubmit = async (adoption) => {
    adoption.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("breed", breed);
    formData.append("location", location);
    formData.append("sex", sex);
    formData.append("age", age);
    formData.append("content", content);

    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/adoption/${id}/`, formData);
      history.push(`/adoptionposts/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Breed:</Form.Label>
        <Form.Control
          type="text"
          name="breed"
          value={breed}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.breed?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
            
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={location}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.location?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}


      <Form.Group>
        <Form.Label>Sex:</Form.Label>
        <select
          as="select"
          type="text"
          name="sex" 
          value={sex} 
          onChange={handleChange}
        >
          <option value="male_neutered">Male, neutered</option>
          <option value="male_unneutered">Male, unnetered</option>
          <option value="female_spayed">Female, spayed</option>
          <option value="female_unspayed">Female, unspayed</option>
        </select>
      </Form.Group>
      {errors?.sex?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
            
      <Form.Group>
        <Form.Label>Age</Form.Label>
        <Form.Control
          type="text"
          name="age"
          value={age}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.age?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              <figure>
                <Image className={appStyles.Image} src={image} rounded />
              </figure>
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default AdoptionpostEditForm;
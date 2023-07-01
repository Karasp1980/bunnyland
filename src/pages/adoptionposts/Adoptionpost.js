import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

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
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/adoption/${id}/edit`);
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

  return (
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
      </Card.Body>
    </Card>
  );
};

export default Adoptionpost;  
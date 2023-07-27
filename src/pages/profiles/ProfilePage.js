import React, { useRef, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";


import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import MessageCreateForm from "../messages/MessageCreateForm";
import Message from "../messages/Message";
import Adoptionrequest from "../adoptionrequest/Adoptionrequest";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePosts, setProfilePosts] = useState({ results: [] });
  const elementRef = useRef(null)

  const currentUser = useCurrentUser();
  const { id } = useParams();

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;
  const [profileMessages, setProfileMessages] = useState({results: []});
  const [isMounted, setIsMounted] = useState(false);

  const [profileAdoptionrequest, setProfileAdoptionrequest] = useState({ results: []});


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profilePosts },{ data: profileMessages }, { data: profileAdoptionrequest },] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/posts/?owner__profile=${id}`),
            axiosReq.get(`/messaging/?profile=${id}`),
            axiosReq.get(`/adoptionrequest/?adoption__owner__profile=${id}`),
          ]);
          
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfilePosts(profilePosts);
        setProfileMessages(profileMessages);
        setProfileAdoptionrequest(profileAdoptionrequest);
        setHasLoaded(true);
        setIsMounted(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData, isMounted]);

  const mainProfile = (
    <>
      {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row noGutters className="px-3 text-center" ref={elementRef}>
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col xs={3} className="my-2">
              <div>{profile?.posts_count}</div>
              <div>posts</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.followers_count}</div>
              <div>followers</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.following_count}</div>
              <div>following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ))}
        </Col>
        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  const mainProfilePosts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s posts</p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <Post key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted yet.`}
        />
      )}
    </>
  );

  const mainProfileMessages = (
    <>
      <Container className={`${appStyles.Content} ${styles.Messages}`}>
        <h3 className="text-center">Messages</h3>
        {profileMessages.results.length ? (
          <InfiniteScroll
          children={
            profileMessages.results.map((message) => (
              <Message key={message.id}{...message} />
            ))}
          dataLength={profileMessages.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileMessages.next}
          next={() => fetchMoreData(profileMessages, setProfileMessages)}
          />
        ) : (
          <Asset message={`no messages yet...`} />
        )}
      </Container>
    </>
  );

  const mainProfileAdoptionrequest = (
    <>
      <Container className={`${appStyles.Content} ${styles.AdoptionRequests}`}>
        <h3 className="text-center">Adoption Requests</h3>
        
        {profileAdoptionrequest.results.length ? (
          <InfiniteScroll 
          children={
            profileAdoptionrequest.results.map((adoptionRequest) => (
              <Adoptionrequest 
              key={adoptionRequest.id}
              name={adoptionRequest.name} 
              phone={adoptionRequest.phone} 
              email={adoptionRequest.email} 
              adoptionMessage={adoptionRequest.adoptionMessage} 
              {...adoptionRequest} 
              />
            ))
          } 
          dataLength={profileAdoptionrequest.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileAdoptionrequest.next}
          next={() => fetchMoreData(profileAdoptionrequest, setProfileAdoptionrequest)}
          />
        ) : (
          <Asset message={`no adoption requests yet...`} />
        )}
      </Container>
    </>
  );
  

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
      
        {currentUser && !is_owner && (
          <MessageCreateForm mobile sendToProfile={profile?.owner} />
        )}
        {currentUser &&
          is_owner &&
          (hasLoaded ? (
            <Container className="d-lg-none mb-3">
              {mainProfileMessages}
              {mainProfileAdoptionrequest}
            </Container>
          ) : (
            <Asset spinner />
          ))}

        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfilePosts}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
          {currentUser && !is_owner && (
            <MessageCreateForm
              sendToProfile={profile?.owner}
              profileId={profile?.id}
            />
          )}

        {currentUser &&
            is_owner &&
            (hasLoaded ? (
              <Container className="d-none d-lg-block">
                {mainProfileMessages}
                {mainProfileAdoptionrequest}
              </Container>
            ) : (
              <Asset spinner />
            ))}
      </Col>
      
    </Row>
  );
}     

export default ProfilePage;


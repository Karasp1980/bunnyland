import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Adoptionpost from "./Adoptionpost";
import Adoptioncomment from "../adoptioncomments/Adoptioncomment";

import AdoptioncommentCreateForm from "../adoptioncomments/AdoptioncommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";

function AdoptionpostPage() {
  const { id } = useParams();
  const [adoption, setPost] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [adoptioncomments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: adoption }, { data: adoptioncomments }] = await Promise.all([
          axiosReq.get(`/adoption/${id}`),
          axiosReq.get(`/adoptioncomments/?adoption=${id}`),
        ]);
        setPost({ results: [adoption] });
        setComments(adoptioncomments);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
       
        <Adoptionpost {...adoption.results[0]} setPosts={setPost} adoptionpostPage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <AdoptioncommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              adoption={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : adoptioncomments.results.length ? (
            "Comments"
          ) : null}
          {adoptioncomments.results.length ? (
            <InfiniteScroll
              children={adoptioncomments.results.map((adoptioncomment) => (
                <Adoptioncomment
                  key={adoptioncomment.id}
                  {...adoptioncomment}
                  setPost={setPost}
                  setComments={setComments}
                />
              ))}
              dataLength={adoptioncomments.results.length}
              loader={<Asset spinner />}
              hasMore={!!adoptioncomments.next}
              next={() => fetchMoreData(adoptioncomments, setComments)}
            />
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles 
      </Col>
    </Row>
  );
}

export default AdoptionpostPage;
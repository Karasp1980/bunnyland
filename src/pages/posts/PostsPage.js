import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Post from "./Post";
import Adoptionpost from "../adoptionposts/Adoptionpost";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function PostsPage({ message, filter = "", filterAdoption = "" }) {
  const [posts, setPosts] = useState({ results: [] });
  const [adoptionPosts, setAdoptionPosts]= useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasLoadedAdoption, setHasLoadedAdoption] = useState(false);
  const { pathname } = useLocation();

 
  const currentUser = useCurrentUser();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}search=${search}&category=${category}`);
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAdoptionPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/adoption/?${filterAdoption}search=${search}`);
        setAdoptionPosts(data);
        setHasLoadedAdoption(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    setHasLoadedAdoption(false);
    const timer = setTimeout(() => {
      fetchPosts();
      fetchAdoptionPosts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, filterAdoption, search, pathname, currentUser, category]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        
        <Container>
            <i className={`fas fa-search ${styles.SearchIcon}`} />
            <Form
              className={styles.SearchBar}
              onSubmit={(event) => event.preventDefault()}
            >
              <Form.Control
                size="sm"
                type="text"
                className="mr-sm-2"
                placeholder="Search posts by title, profile, date or keywords"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Form.Control
                size="sm"
                // className="mr-sm-2"
                as="select"
                placeholder="Choose..."
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option key="blankChoice" hidden value>
                  {" "}
                  Category{" "}
                </option>
                <option value="tip">Tip</option>
                <option value="help_needed">Help needed</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form>
          </Container>

        {hasLoaded ? (
          <>
            {posts.results.length ? (
              <InfiniteScroll
                children={posts.results.map((post) => (
                  <Post key={post.id} {...post} setPosts={setPosts} />
                ))}
                dataLength={posts.results.length}
                loader={<Asset spinner />}
                hasMore={!!posts.next}
                next={() => fetchMoreData(posts, setPosts)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
        {hasLoadedAdoption ? (
          <>
            {adoptionPosts.results.length ? (
              <InfiniteScroll
                children={adoptionPosts.results.map((post) => (
                  <Adoptionpost key={post.id} {...post} setAdoptionposts={setAdoptionPosts} />
                ))}
                dataLength={adoptionPosts.results.length}
                loader={<Asset spinner />}
                hasMore={!!adoptionPosts.next}
                next={() => fetchMoreData(adoptionPosts, setAdoptionPosts)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostsPage;
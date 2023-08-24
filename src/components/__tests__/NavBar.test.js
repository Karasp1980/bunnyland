import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import NavBar from '../NavBar'
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";

test('renders NavBar Home Link', () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );
    // screen.debug();
    const homeLink = screen.getByRole("link", { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
});

test('renders link to the Adoption page for a logged in user', async () => {
    render(
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );
    
    const adopt = await screen.findByText('Adopt');
    expect(adopt).toBeInTheDocument()
});

test("renders NavBar", () => {
    render(
      <Router>
        <NavBar />
      </Router>
    );
  
    // screen.debug();
    const signInLink = screen.getByRole("link", { name: "Sign in" });
    expect(signInLink).toBeInTheDocument();
  });

  test('renders link to the Feed page for a logged in user', async () => {
    render(
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );
    
    const feed = await screen.findByText('Feed');
    expect(feed).toBeInTheDocument()
});

test('renders link to the Liked page for a logged in user', async () => {
    render(
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>
        </Router>
    );
    
    const liked = await screen.findByText('Liked');
    expect(liked).toBeInTheDocument()
});



  
  
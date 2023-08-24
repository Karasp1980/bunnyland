import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';


test('displays the "Not Found" message', () => {
  render(<NotFound />, { wrapper: MemoryRouter });

  const message = screen.getByText(/Sorry, the page you're looking for doesn't exist/i);
  expect(message).toBeInTheDocument();
});

test('renders the "No Results" image', () => {
  render(<NotFound />, { wrapper: MemoryRouter });

  const image = screen.getByAltText(/Sorry, the page you're looking for doesn't exist/i);
  expect(image).toBeInTheDocument();
});

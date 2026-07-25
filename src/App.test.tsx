import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio and its primary sections', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Laçin Temel/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /^Deneyim$/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /^Projelerim/i })).toBeInTheDocument();
});

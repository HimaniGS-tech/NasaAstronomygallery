// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders NASA Astronomy Gallery title', () => {
  render(<App />);
  const titleElement = screen.getByText(/nasa astronomy gallery/i); // Check for the title
  expect(titleElement).toBeInTheDocument();
});
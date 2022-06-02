import { render, screen } from '@testing-library/react';
import Main from './Main';
import React from "react";

test('renders site title', () => {
  render(<Main />);
  const title = screen.getByText(/OpenAEDMap/);
  expect(title).toBeInTheDocument();
});

import Greeting from '../greeting.js';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('renders the correct greeting based on name prop', () => {
  render(<Greeting name="jaurooo" />);
  const greetingText = screen.getByTestId('greeting');
  expect(greetingText).toHaveTextContent('Wassap ma men jaurooo!');
});

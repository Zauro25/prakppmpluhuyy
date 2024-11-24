import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertUhuyy from '../alertuhuyy.js';

test('calls alert when button is clicked', () => {
  window.alert = jest.fn();
  render(<AlertUhuyy />);
  const button = screen.getByText('Click Me');

  fireEvent.click(button);
  expect(window.alert).toHaveBeenCalledWith('Button clicked!');
});

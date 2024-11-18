import React from 'react';
import { render, screen } from '@testing-library/react';
import TextEditor from '../components/TextEditor';

test('renders text editor', () => {
  render(<TextEditor />);
  const textArea = screen.getByPlaceholderText(/write your notes here/i);
  expect(textArea).toBeInTheDocument();
});

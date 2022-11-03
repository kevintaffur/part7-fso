import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBlogForm from './NewBlogForm';

test('event handler receives the right details when a new blog post is created', () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<NewBlogForm createBlog={createBlog} />);

  const title = screen.getByPlaceholderText('Title');
  const author = screen.getByPlaceholderText('Author');
  const url = screen.getByPlaceholderText('Url');
  const button = screen.getByText('create');

  user.type(title, 'This is a test title');
  user.type(author, 'This is a test author');
  user.type(url, 'This is a test url');
  user.click(button);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('This is a test title');
  expect(createBlog.mock.calls[0][0].author).toBe('This is a test author');
  expect(createBlog.mock.calls[0][0].url).toBe('This is a test url');
});
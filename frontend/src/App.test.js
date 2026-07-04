import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('shows a list of blogs and opens a selected post', async () => {
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: '1',
          title: 'First post',
          content: 'Hello world',
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '1',
        title: 'First post',
        content: 'Hello world',
        created_at: '2024-01-01T00:00:00Z',
      }),
    });

  render(<App />);

  expect(screen.getByText(/loading blogs/i)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /first post/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /view first post/i }));

  expect(await screen.findByText(/hello world/i)).toBeInTheDocument();
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ReservationPage from '../ReservationPage';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <MemoryRouter>{children}</MemoryRouter>
  </HelmetProvider>
);

const renderPage = () => render(<ReservationPage />, { wrapper: Wrapper });

describe('ReservationPage — form validation', () => {
  it('renders the reservation form', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /reserve your table/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('shows error when name is too short', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/name \*/i), 'A');
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('shows error when phone is invalid', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/phone \*/i), 'abc');
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 10 digits|invalid phone/i)).toBeInTheDocument();
    });
  });

  it('shows error when email is invalid', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/email$/i), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('shows error when no time is selected', async () => {
    renderPage();
    await userEvent.type(screen.getByLabelText(/name \*/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/phone \*/i), '+91 9876543210');
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));
    await waitFor(() => {
      expect(screen.getByText(/select a time/i)).toBeInTheDocument();
    });
  });

  it('calls onSuccess with valid data', async () => {
    const onSuccess = vi.fn().mockResolvedValue(undefined);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0]!;

    render(<ReservationPage onSuccess={onSuccess} />, { wrapper: Wrapper });

    await userEvent.type(screen.getByLabelText(/name \*/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/phone \*/i), '+91 9876543210');
    await userEvent.type(screen.getByLabelText(/date/i), tomorrowStr);
    await userEvent.selectOptions(screen.getByLabelText(/time \*/i), '19:00');

    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Alice', time: '19:00' })
    );
  });

  it('disables submit button while submitting', async () => {
    const onSuccess = vi.fn(() => new Promise<void>((r) => setTimeout(r, 500)));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    render(<ReservationPage onSuccess={onSuccess} />, { wrapper: Wrapper });

    await userEvent.type(screen.getByLabelText(/name \*/i), 'Alice');
    await userEvent.type(screen.getByLabelText(/phone \*/i), '+91 9876543210');
    await userEvent.type(screen.getByLabelText(/date/i), tomorrow.toISOString().split('T')[0]!);
    await userEvent.selectOptions(screen.getByLabelText(/time \*/i), '19:00');

    await userEvent.click(screen.getByRole('button', { name: /confirm/i }));

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });
});

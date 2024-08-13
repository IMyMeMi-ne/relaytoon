import { render, screen, fireEvent } from '@testing-library/react';
import CreateRoom from './CreateRoom';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import { usePostToon } from '@/src/hooks/usePostToon';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/src/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/src/hooks/usePostToon', () => ({
  usePostToon: jest.fn(),
}));

describe('CreateRoom Component', () => {
  const mockRouterPush = jest.fn();
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    (useAuthStore as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });
    (usePostToon as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    render(<CreateRoom />);
    expect(screen.getByText('드로잉 주제')).toBeInTheDocument();
  });

  it('should allow the user to input a subject', () => {
    render(<CreateRoom />);
    const input = screen.getByPlaceholderText(
      '멤버들과 그릴 그림 주제를 입력해주세요!',
    );
    fireEvent.change(input, { target: { value: '테스트 주제' } });
    expect(input).toHaveValue('테스트 주제');
  });

  it('should update the member option when a member is selected', () => {
    render(<CreateRoom />);
    const memberRadio = screen.getByLabelText('1명');
    fireEvent.click(memberRadio);
    expect(memberRadio).toBeChecked();
  });

  it('should update the time option when a time is selected', () => {
    render(<CreateRoom />);
    const timeRadio = screen.getByLabelText('12초');
    fireEvent.click(timeRadio);
    expect(timeRadio).toBeChecked();
  });

  it('should call the submit function and redirect on successful submission', async () => {
    mockMutateAsync.mockResolvedValueOnce({ id: '123' });
    render(<CreateRoom />);
    const submitButton = screen.getByText('시작하기');
    fireEvent.click(submitButton);
    expect(mockMutateAsync).toHaveBeenCalled();
    expect(mockRouterPush).toHaveBeenCalledWith('/drawing/123?count=1');
  });

  it('should redirect to login if not logged in', () => {
    (useAuthStore as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });
    render(<CreateRoom />);
    expect(mockRouterPush).toHaveBeenCalledWith('/login');
  });
});

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
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isLoggedIn: true,
    });
    (usePostToon as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컴포넌트 렌더링 테스트', () => {
    render(<CreateRoom />);
    expect(screen.getByText('드로잉 주제')).toBeInTheDocument();
  });

  it('사용자 주제 입력 테스트', () => {
    render(<CreateRoom />);
    const input = screen.getByPlaceholderText(
      '멤버들과 그릴 그림 주제를 입력해주세요!',
    );
    fireEvent.change(input, { target: { value: '테스트 주제' } });
    expect(input).toHaveValue('테스트 주제');
  });

  it('멤버 선택 시 멤버 옵션 업데이트 테스트', () => {
    render(<CreateRoom />);
    const memberRadio = screen.getByLabelText('1명');
    fireEvent.click(memberRadio);
    expect(memberRadio).toBeChecked();
  });

  it('시간 선택 시 시간 옵션 업데이트 테스트', () => {
    render(<CreateRoom />);
    const timeRadio = screen.getByLabelText('12초');
    fireEvent.click(timeRadio);
    expect(timeRadio).toBeChecked();
  });

  it('방 생성 클릭 시 성공적으로 제출 후 리디렉션 테스트', async () => {
    mockMutateAsync.mockResolvedValueOnce({ id: '123' });
    render(<CreateRoom />);
    const submitButton = screen.getByText('시작하기');
    fireEvent.click(submitButton);
    expect(mockMutateAsync).toHaveBeenCalled();
    expect(mockRouterPush).toHaveBeenCalledWith('/drawing/123?count=1');
  });

  it('로그인이 안되어 있을 시 로그인 페이지 리디렉션 테스트', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isLoggedIn: false,
    });
    render(<CreateRoom />);
    expect(mockRouterPush).toHaveBeenCalledWith('/login');
  });
});

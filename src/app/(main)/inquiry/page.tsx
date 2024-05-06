'use client';
import LargeBtn from '@/src/components/LargeBtn';
import BackHeader from '@/src/components/header/BackHeader';
import { usePostInquiry } from '@/src/hooks/usePostInquiry';
import { PostInquiry } from '@/src/types/CreateInquiry';
import { ChangeEvent, useState } from 'react';

export default function Inquiry() {
  const [isActive, setIsActive] = useState(true);
  const [content, setInquiry] = useState<string>('');
  const postInquiry = usePostInquiry();
  const handleSubmit = async () => {
    try {
      const data: PostInquiry = {
        content,
      };
      const result = await postInquiry.mutateAsync(data);
      console.log(result);
      window.location.href = `/`;
    } catch (error) {
      console.log(error);
    }
  };

  const onInquiryChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInquiry(e.target.value);
  };
  return (
    <div>
      <BackHeader text="건의하기" />
      <div className="*:custom-pretendard-font relative flex h-screen flex-col items-center bg-[#F7F7F7] px-[20px]">
        <div className="flex h-[48px] items-center justify-center bg-[#F7F7F7]"></div>

        <div className="mt-[35px] flex h-[90px] flex-col gap-[16px]">
          <div className="flex flex-col gap-[16px]">
            <label className="text-[16px] font-bold" htmlFor="title">
              제목
            </label>
            <div className="flex h-[50px] w-[350px] items-center rounded-[8px]  bg-white p-4 text-[16px] font-semibold">
              건의하기
            </div>
            <label className="text-[16px] font-bold" htmlFor="content">
              건의내용
            </label>
            <textarea
              name="content"
              value={content}
              onChange={onInquiryChange}
              placeholder="릴레이툰 팀에게 건의할 사항을 입력해주세요"
              className="h-[230px] w-[349px] rounded-[12px] p-4 scrollbar-hide placeholder:text-[15px] placeholder:font-medium focus:ring-1 focus:ring-black"
            />
            <div className="mt-[150px]">
              <LargeBtn
                text="등록하기"
                active={content.length ? isActive : !isActive}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
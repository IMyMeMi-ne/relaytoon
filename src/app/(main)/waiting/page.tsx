'use client';

import LargeBtn from '@/src/components/LargeBtn';
import MyPageSideBar from '@/src/components/MypageSidebar';
import MenuHeader from '@/src/components/header/MenuHeader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WaitingPage() {
  const router = useRouter();
  const onClick = () => {
    router.refresh();
  };

  const [isOpen, setIsOpen] = useState(false);
  const onClickMenu = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <MenuHeader isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="custom-waguri-font mt-32 flex justify-center text-2xl">
        현재 누가 그리고 있어요!
      </div>
      <div className="mt-[39px] flex flex-row justify-center">
        <Image
          src="/svg/gray-person.svg"
          alt="gray-person"
          width={43.14}
          height={52}
        />
        <Image
          src="/svg/gray-person.svg"
          alt="gray-person"
          width={43.14}
          height={52}
          className="ml-6"
        />
        <Image
          src="/svg/green-person.svg"
          alt="green-person"
          width={53.62}
          height={84}
          className="ml-6"
        />
      </div>
      <div className="mt-[39px] flex flex-col text-center text-lg font-bold">
        <span className="text-[#666666]">앞선 주자가</span>
        <br />
        <span className="-mt-4 font-bold">그림을 완성할 때까지</span>
        <br />
        <span className="-mt-4 text-[#666666]">조금만 기다려주세요!</span>
      </div>
      <Image
        src="/svg/under-arrow.svg"
        alt="under-arrow"
        width={29}
        height={38}
        className="mx-auto mt-[89px]"
      />
      <div className="mb-[108px] mt-[13px] flex justify-center px-5 py-2">
        <LargeBtn text="새로 고침" onClick={onClick} active={true} />
      </div>
      {isOpen && (
        <div
          className="fixed top-0 z-10 h-[100vh] w-[390px] bg-gray-400 transition-all duration-200 ease-in-out"
          style={{ backgroundColor: 'rgba(23, 23, 23, 0.5)' }}
          onClick={onClickMenu}
        >
          <MyPageSideBar setIsOpen={setIsOpen} isOpen={isOpen} />
        </div>
      )}
    </div>
  );
}

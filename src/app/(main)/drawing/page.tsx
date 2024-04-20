'use client';
import DrawingOrder from '@/src/components/DrawingOrder';
import OnlyLogoHeader from '@/src/components/header/OnlyLogoHeader';
import HeaderFinishedButton from '@/src/components/header/_component/HeaderFinishedButton';
import dynamic from 'next/dynamic';

const FabricCanvasWithNoSSR = dynamic(
  () => import('@/src/components/FabricCanvas'),
  {
    ssr: false,
  },
);
export default function DrawingPage() {
  return (
    <div>
      <div className="flex flex-row justify-between">
        <OnlyLogoHeader />
        <HeaderFinishedButton time={12} isComplete={false} />
      </div>
      <div className="flex flex-row px-5 py-3">
        <div className="text-xl font-bold">그림 주제</div>
        <DrawingOrder
          width={127}
          height={33}
          positionStyle={{ top: '0px', left: '150px', position: 'relative' }}
        />
      </div>
      <div className="ml-auto mr-auto flex w-[350px] rounded-lg bg-white px-5 py-3 text-base">
        가나다라마바사아자차카타파하 가나다라마바사아
      </div>
      <div className="ml-auto mr-auto mt-3 w-[350px]">
        <FabricCanvasWithNoSSR />
      </div>
    </div>
  );
}
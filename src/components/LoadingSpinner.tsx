import Image from 'next/image';

export default function LoadingSpinner() {
  return (
    <div className="flex h-[754px] w-full">
      <Image
        src="/svg/loading.svg"
        alt="loading"
        width={82}
        height={79}
        className="animate-spin-2s ml-auto mr-auto flex h-full items-center"
      />
    </div>
  );
}

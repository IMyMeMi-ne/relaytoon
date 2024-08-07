'use client';
import BackHeader from '@/src/components/header/BackHeader';
import { useGetMyCreatedToon } from '@/src/hooks/useGetMyCreatedToon';
import { useGetMyParticipatedToon } from '@/src/hooks/useGetMyParticipatedToon';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDeleteToon } from '@/src/hooks/useDeleteToon';
import { Toon } from '@/src/types/Toon';
import FilterDropdown from './FilterDropdown';
import { useAuthStore } from '@/src/store/authStore';

export default function MyGallery() {
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialTab =
    (searchParams.get('tab') as 'create' | 'participate') || 'create';
  const initialFilter = searchParams.get('filter') === 'true';
  const [tab, setTab] = useState<'create' | 'participate'>(initialTab);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [filterType, setFilterType] = useState(initialFilter);
  const [totalPages, setTotalPages] = useState(1);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const maxButtons = 5;

  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn]);

  const calculatePageRange = () => {
    console.log('calstart');
    const currentSet = Math.ceil(pageNumber / maxButtons);
    const startPage = (currentSet - 1) * maxButtons + 1;
    const endPage = Math.min(currentSet * maxButtons, totalPages);
    return { startPage, endPage };
  };

  const { startPage, endPage } = useMemo(
    () => calculatePageRange(),
    [pageNumber, totalPages],
  );

  const { data: myCreatedToon, refetch: refetchCreated } = useGetMyCreatedToon(
    pageNumber,
    filterType,
  );

  const { data: myParticipatedToon, refetch: refetchParticipated } =
    useGetMyParticipatedToon(pageNumber, filterType);

  const handleTabChange = (newTab: 'create' | 'participate') => {
    if (newTab !== tab) {
      setTab(newTab);
      setPageNumber(1);
      router.push(`?tab=${newTab}&page=1&filter=false`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== pageNumber && newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
      router.push(`?tab=${tab}&page=${newPage}&filter=${filterType}`);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPageSet = () => {
    handlePageChange(pageNumber + 1);
  };

  const handlePrevPageSet = () => {
    handlePageChange(pageNumber - 1);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    const tab = (params.get('tab') as 'create' | 'participate') || 'create';
    const filter = params.get('filter') === 'true';
    setTab(tab);
    setPageNumber(page);
    setFilterType(filter);
  }, [searchParams]);

  useEffect(() => {
    if (pageNumber === 1) {
      const newTotalPages =
        (tab === 'create'
          ? myCreatedToon?.totalPage
          : myParticipatedToon?.totalPage) || 1;
      setTotalPages(newTotalPages);
    }
  }, [tab, myCreatedToon, myParticipatedToon, pageNumber]);

  useEffect(() => {
    if (tab === 'create') {
      refetchCreated();
    } else {
      refetchParticipated();
    }
  }, [pageNumber, tab, filterType]);

  const createdToons = myCreatedToon?.toons || [];
  const participatedToons = myParticipatedToon?.toons || [];
  const { mutate: deleteToon } = useDeleteToon();
  const [isDelete, setIsDelete] = useState(false);
  const [selectedToons, setSelectedToons] = useState<string[]>([]);
  const onClickIsDelete = () => {
    setIsDelete((prev) => !prev);
    setSelectedToons([]);
  };

  const selectAll = () => {
    const all = document.getElementById('all') as HTMLInputElement;
    const toons = document.querySelectorAll(
      'input[name=toon]',
    ) as NodeListOf<HTMLInputElement>;

    if (all.checked) {
      const allToonIds = createdToons.map((toon: Toon) => toon.id);
      setSelectedToons(allToonIds);
      toons.forEach((toon) => (toon.checked = true));
    } else {
      setSelectedToons([]);
      toons.forEach((toon) => (toon.checked = false));
    }
  };

  const onCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSelectedToons((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((id) => id !== value),
    );
  };
  const onDeleteClick = () => {
    if (selectedToons.length !== 0) {
      if (confirm('정말 삭제하시겠습니까?')) {
        deleteToon(selectedToons, {
          onSuccess: () => {
            refetchCreated();
            setSelectedToons([]);
            setIsDelete(false);
          },
        });
      } else {
        return;
      }
    } else {
      alert('삭제할 그림을 선택하세요');
    }
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    setPageNumber(1);
    router.push(`?tab=${tab}&page=1&filter=${value}`);
  };

  return (
    <div className="min-h-[754px]">
      <div className="flex">
        <BackHeader text="그림갤러리" />
      </div>
      <div className="relative mt-[64px] flex items-center justify-center text-base font-bold">
        <div
          onClick={() => handleTabChange('create')}
          className={`relative mx-[60px] mb-1 cursor-pointer ${
            tab === 'create' ? 'text-[#595959]' : 'text-[#9E9E9E]'
          }`}
        >
          만든 그림
          {tab === 'create' && (
            <span
              className="absolute -bottom-1 left-1/2 block h-[3px] bg-black"
              style={{ width: 78, transform: 'translateX(-50%)' }}
            ></span>
          )}
        </div>
        <div
          onClick={() => handleTabChange('participate')}
          className={`relative mx-[60px] mb-1 cursor-pointer ${
            tab === 'participate' ? 'text-[#595959]' : 'text-[#9E9E9E]'
          }`}
        >
          참여 그림
          {tab === 'participate' && (
            <span
              className="absolute -bottom-1 left-1/2 block h-[3px] bg-black"
              style={{ width: 78, transform: 'translateX(-50%)' }}
            ></span>
          )}
        </div>
      </div>
      <hr className="border-1 border-solid border-[#C7C7C7]" />
      {tab === 'create' ? (
        <>
          <div className="mt-[29px] flex justify-between px-5 font-bold">
            <div className="flex items-center">
              <span>총 {createdToons.length}장</span>
              {isDelete && (
                <div className="flex items-center gap-2">
                  <input
                    id="all"
                    type="checkbox"
                    className="ml-3 size-5 accent-[#E0FF68]"
                    onClick={selectAll}
                  />
                  <div className="cursor-pointer" onClick={onDeleteClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              {isDelete ? (
                <div className="flex w-[150px] justify-end gap-3">
                  <div className="cursor-pointer" onClick={onClickIsDelete}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <span className="cursor-pointer" onClick={onClickIsDelete}>
                  Edit
                </span>
              )}
              <div className="ml-2">
                <FilterDropdown
                  selectedFilter={filterType}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {createdToons.map((toon: Toon, index: number) => {
              const date = new Date(toon.createdAt + '');
              const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

              return (
                <div key={index}>
                  {toon.image ? (
                    <Link href={`/item/${toon.id}`} key={index}>
                      <img
                        src={toon.image}
                        alt={toon.title}
                        width={350}
                        className="mt-5 cursor-pointer rounded-xl"
                        style={{ height: 204 }}
                      />
                    </Link>
                  ) : (
                    <Link href={`/item/${toon.id}`} key={index}>
                      <div className="mt-5 h-[204px] w-[350px] cursor-pointer rounded-xl bg-white"></div>
                    </Link>
                  )}
                  <div className="align-center relative mt-4 flex flex-row justify-between">
                    <div className="text-base font-semibold">{toon.title}</div>
                    <div className="text-base font-semibold text-[#9E9E9E]">
                      {formattedDate}
                    </div>
                    {isDelete && (
                      <div className="absolute top-[-220px]">
                        <div
                          className="z-10 h-[204px] w-[350px] overflow-hidden rounded-xl"
                          style={{ backgroundColor: 'rgba(23, 23, 23, 0.5)' }}
                        />
                        <input
                          name="toon"
                          type="checkbox"
                          value={toon.id}
                          onChange={onCheckboxClick}
                          className="z-60 absolute left-[46%] top-[41%] size-[40px] rounded-xl accent-[#E0FF68] opacity-50"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="mt-[29px] flex justify-between px-5 font-bold">
            <div className="flex items-center">
              총 {participatedToons?.length}장
              {isDelete && (
                <div className="flex items-center gap-2">
                  <input
                    id="all"
                    type="checkbox"
                    className="ml-3 size-5 accent-[#E0FF68]"
                    onClick={selectAll}
                  />
                  <div className="cursor-pointer" onClick={onDeleteClick}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="flex w-full items-center justify-end">
                {isDelete ? (
                  <div className="cursor-pointer" onClick={onClickIsDelete}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </div>
                ) : (
                  <span className="cursor-pointer" onClick={onClickIsDelete}>
                    Edit
                  </span>
                )}
                <div className="ml-2">
                  <FilterDropdown
                    selectedFilter={filterType}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {participatedToons.map((toon: Toon, index: number) => {
              const date = new Date(toon.createdAt + '');
              const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

              return (
                <Link href={`/item/${toon.id}`} key={index}>
                  <div key={index}>
                    {toon.image ? (
                      <img
                        src={toon.image}
                        alt={toon.title}
                        width={350}
                        className="mt-5 rounded-xl"
                        style={{ height: 204 }}
                      />
                    ) : (
                      <Link href={`/item/${toon.id}`} key={index}>
                        <div className="mt-5 h-[204px] w-[350px] rounded-xl bg-white"></div>
                      </Link>
                    )}
                    <div className="align-center mt-4 flex flex-row justify-between">
                      <div className="text-base font-semibold">
                        {toon.title}
                      </div>
                      <div className="text-base font-semibold text-[#9E9E9E]">
                        {formattedDate}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
      <div className="mt-5 flex justify-center">
        {pageNumber !== 1 ? (
          <button onClick={handlePrevPageSet} className="mx-1 p-2 text-lg">
            {'<'}
          </button>
        ) : (
          <button
            onClick={handlePrevPageSet}
            className="mx-1 p-2 text-lg text-neutral-400"
            disabled
          >
            {'<'}
          </button>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
          <button
            key={startPage + i}
            onClick={() => handlePageChange(startPage + i)}
            className={`mx-1 p-2 text-lg ${
              pageNumber === startPage + i ? 'font-bold' : 'font-normal'
            }`}
          >
            {startPage + i}
          </button>
        ))}

        {pageNumber !== totalPages ? (
          <button onClick={handleNextPageSet} className="mx-1 p-2 text-lg">
            {'>'}
          </button>
        ) : (
          <button
            onClick={handleNextPageSet}
            className="mx-1 p-2 text-lg text-neutral-400"
            disabled
          >
            {'>'}
          </button>
        )}
      </div>
    </div>
  );
}

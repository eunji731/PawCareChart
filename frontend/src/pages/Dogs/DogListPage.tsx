import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Button } from '../../components/common/Button';
import { DogCard } from './components/DogCard';
import type { Dog } from '../../types/dog';

export const DogListPage = () => {
  const navigate = useNavigate();

  // DDL dogs 테이블 명세 기준 더미 데이터
  const dummyDogs: Dog[] = [
    {
      id: 1,
      user_id: 1,
      name: '초코',
      breed: '토이푸들',
      birth_date: '2020-05-15',
      weight: 4.5,
      profile_image_url: '',
      created_at: '',
      updated_at: ''
    },
    {
      id: 2,
      user_id: 1,
      name: '뭉치',
      breed: '비숑 프리제',
      birth_date: '2022-11-20',
      weight: 6.2,
      profile_image_url: '',
      created_at: '',
      updated_at: ''
    }
  ];

  return (
    <PageLayout
      title="반려견 목록"
      description="함께하는 소중한 가족들을 관리합니다."
    >
      <div className="flex justify-end mb-8">
        <Button
          onClick={() => navigate('/dogs/new')}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-amber-100"
          size="lg"
        >
          <span className="text-lg mr-1">+</span> 새 반려견 등록
        </Button>
      </div>

      {dummyDogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dummyDogs.map(dog => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-orange-100">
          <div className="text-6xl mb-4">🐕</div>
          <h3 className="text-xl font-black text-stone-800 mb-2">등록된 반려견이 없어요</h3>
          <p className="text-stone-400 font-bold mb-8">첫 번째 반려견을 등록하고 케어를 시작해보세요!</p>
          <Button onClick={() => navigate('/dogs/new')} variant="outline">
            지금 등록하기
          </Button>
        </div>
      )}
    </PageLayout>
  );
};

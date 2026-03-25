import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/common/Button';
import { DogCard } from '@/pages/Dogs/List/components/DogCard';
import { useDogList } from '@/pages/Dogs/List/hooks/useDogList';

const DogListPage = () => {
  const navigate = useNavigate();
  const { dogs, isLoading, error } = useDogList();

  return (
    <PageLayout title="반려견 목록" description="함께하는 소중한 가족들을 관리합니다.">
      <div className="flex justify-end mb-8">
        <Button onClick={() => navigate('/dogs/new')} size="lg">
          <span className="text-lg mr-1">+</span> 새 반려견 등록
        </Button>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <p className="text-stone-400 font-black animate-pulse text-[15px]">데이터를 불러오는 중입니다... 🐾</p>
        </div>
      ) : error ? (
        <div className="py-24 text-center bg-red-50 rounded-3xl border border-red-100">
          <p className="text-red-500 font-black text-[15px]">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">다시 시도</Button>
        </div>
      ) : dogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dogs.map(dog => <DogCard key={dog.id} dog={dog} />)}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-orange-100">
          <div className="text-6xl mb-4">🐕</div>
          <h3 className="text-xl font-black text-stone-800 mb-2">등록된 반려견이 없어요</h3>
          <Button onClick={() => navigate('/dogs/new')} variant="outline" className="mt-4">지금 등록하기</Button>
        </div>
      )}
    </PageLayout>
  );
};

export default DogListPage;

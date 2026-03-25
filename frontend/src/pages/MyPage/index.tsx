import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Section } from '@/components/common/Section';
import { LabelValue } from '@/components/common/LabelValue';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useAuth } from '@/context/AuthContext';
import { DogSummaryCard } from '@/pages/MyPage/components/DogSummaryCard';
import type { Dog } from '@/types/dog';
import { dogApi } from '@/api/dogApi';

export const MyPage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoadingDogs, setIsLoadingDogs] = useState(true);

  // 실데이터 연동: 로그인한 유저의 반려견 목록 가져오기
  useEffect(() => {
    const fetchMyDogs = async () => {
      try {
        setIsLoadingDogs(true);
        const data = await dogApi.getDogs();
        setDogs(data || []);
      } catch (err) {
        console.error('마이페이지 반려견 로드 실패:', err);
        setDogs([]);
      } finally {
        setIsLoadingDogs(false);
      }
    };
    fetchMyDogs();
  }, []);

  const handleSaveProfile = () => {
    // TODO: 유저 이름 수정 API 연동 시 구현
    setIsEditing(false);
  };

  return (
    <PageLayout
      title="마이페이지"
      description="내 정보와 반려견 목록을 관리합니다."
    >
      <div className="space-y-8">

        {/* 1. 기본 정보 섹션 */}
        <Section
          title="기본 정보"
          rightElement={
            <Button
              variant={isEditing ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? '취소' : '수정하기'}
            </Button>
          }
        >
          <dl className="divide-y divide-orange-50">
            <LabelValue label="이메일" value={user?.email} />

            <LabelValue label="이름">
              {isEditing ? (
                <div className="flex gap-2 w-full max-w-md">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                  />
                  <Button onClick={handleSaveProfile} className="flex-shrink-0" size="md">저장</Button>
                </div>
              ) : (
                <span className="text-[16px] font-black text-stone-800">{user?.name}</span>
              )}
            </LabelValue>

            <LabelValue label="권한">
              <Badge color="amber">
                {user?.role_code || '일반 사용자'}
              </Badge>
            </LabelValue>
          </dl>
        </Section>

        {/* 2. 내 반려견 요약 */}
        <Section
          title="내 반려견"
          description="현재 등록된 소중한 가족입니다."
          rightElement={<Button variant="outline" size="sm" onClick={() => window.location.href = '/dogs/new'}>+ 추가</Button>}
        >
          {isLoadingDogs ? (
            <div className="py-10 text-center font-bold text-stone-300 animate-pulse text-sm">정보를 불러오고 있습니다...</div>
          ) : dogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dogs.map(dog => (
                <DogSummaryCard key={dog.id} dog={dog} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-orange-100 rounded-2xl bg-orange-50/30">
              <p className="text-stone-400 font-extrabold text-[13px]">등록된 반려견이 없어요 🐾</p>
            </div>
          )}
        </Section>

        {/* 3. 계정 설정 */}
        <Section title="계정 설정">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-orange-100 text-stone-500 hover:text-stone-800">비밀번호 변경</Button>
            <Button
              variant="outline"
              className="border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
              onClick={logout}
            >
              로그아웃
            </Button>
          </div>
        </Section>

      </div>
    </PageLayout>
  );
};

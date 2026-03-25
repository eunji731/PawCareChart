import { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Section } from '../../components/common/Section';
import { LabelValue } from '../../components/common/LabelValue';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { DogSummaryCard } from './components/DogSummaryCard';

export const MyPage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  // DDL 기반 목업 데이터 (추후 API 연동)
  const myDogs = [
    { id: 1, name: '초코', breed: '푸들', weight: 4.5 },
  ];

  const handleSaveProfile = () => {
    // TODO: API 연동 (Update user name)
    setIsEditing(false);
  };

  return (
    <PageLayout 
      title="마이페이지" 
      description="내 정보와 반려견 목록을 관리합니다."
    >
      <div className="space-y-8">
        
        {/* 1. 기본 정보 섹션 (DDL: email, name, role_code) */}
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

        {/* 2. 내 반려견 요약 (DDL: dogs 테이블 연관) */}
        <Section 
          title="내 반려견" 
          description="현재 등록된 소중한 가족입니다."
          rightElement={<Button variant="outline" size="sm" onClick={() => window.location.href='/dogs/new'}>+ 추가</Button>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myDogs.map(dog => (
              <DogSummaryCard key={dog.id} dog={dog} />
            ))}
            {myDogs.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-orange-100 rounded-2xl bg-orange-50/30">
                <p className="text-stone-400 font-extrabold text-[13px]">등록된 반려견이 없어요 🐾</p>
              </div>
            )}
          </div>
        </Section>

        {/* 3. 보안 및 기타 */}
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

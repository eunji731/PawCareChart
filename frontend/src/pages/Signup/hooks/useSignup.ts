import { useState } from 'react';
import { apiClient } from '@/lib/apiClient';

export const useSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('이메일, 비밀번호, 보호자 이름을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Spring Boot 회원가입 API 연동 (Custom API)
      await apiClient.post('/auth/signup', {
        email,
        password,
        name
      });
      
      alert('멍케어차트 가입을 환영합니다! 🎉 (로그인 창으로 넘어갑니다.)');
      // 추후 로그인 화면으로 이동하는 로직(Navigate, 훅 등) 추가 가능
      window.location.href = '/login';
    } catch (err: any) {
      console.error('회원가입 에러:', err);
      // 백엔드 API에서 던져주는 메시지가 있으면 매핑하고 없으면 기본 메시지
      const errorMessage = err.response?.data?.message || '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    name, setName,
    error, loading,
    handleSignup
  };
};

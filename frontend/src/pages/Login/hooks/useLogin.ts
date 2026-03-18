import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // TODO: 나중에 전역 상태(User) 업데이트나 페이지 이동(React Router) 처리가 들어갈 자리입니다.
      alert('로그인에 성공했습니다! (페이지 이동 예정)');
      
    } catch (err: any) {
      console.error('로그인 에러:', err);
      setError(err.message || '로그인을 실패했습니다. 이메일이나 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  };
};

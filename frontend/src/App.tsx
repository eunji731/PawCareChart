import { useEffect, useState } from 'react';
import { apiClient } from './lib/apiClient'; // 앞서 만든 axios 인스턴스

function App() {
  const [backendMessage, setBackendMessage] = useState<string>('');

  useEffect(() => {
    // 스프링 부트의 /api/hello 주소로 GET 요청을 보냅니다.
    apiClient.get('/hello')
      .then((response) => {
        // 성공적으로 데이터를 받아오면 상태에 저장합니다.
        setBackendMessage(response.data);
      })
      .catch((error) => {
        console.error('스프링 연결 실패:', error);
        setBackendMessage('스프링 부트와 연결되지 않았습니다. 서버가 켜져 있는지 확인하세요.');
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🐾 Paw Care Chart</h1>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e0f7fa', borderRadius: '8px' }}>
        <h2>🔌 서버 통신 테스트</h2>
        <p>
          <strong>백엔드 응답:</strong> {backendMessage || '데이터를 불러오는 중...'}
        </p>
      </div>
    </div>
  );
}

export default App;
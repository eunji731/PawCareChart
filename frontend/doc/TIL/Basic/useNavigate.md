# useNavigate

## useNavigate란?
- React Router가 제공하는 페이지 이동 함수를 꺼내오는 훅(React 방식의 페이지 이동 함수)
- 리액트 라우터에서 페이지를 이동할 때 쓰는 훅
- useNavigate는 함수를 반환하고, 그 함수를 호출하면 페이지가 이동
- React 앱은 보통 SPA 구조 -> SPA는 페이지 띄운 후 필요 화면만 바꿔 끼움
    - 새 html 받거나 전체 새로고침, 페이지 전체 갈아엎기 안함
- 라우터가 주소만 바꾸고 그 주소에 맞는 컴포넌트 렌더링 -> 이동을 코드로 시키는게 useNavigate()
```typescript
import { useNavigate } from 'react-router-dom';

// 이 컴포넌트 안에서 주소 이동을 시킬 수 있는 함수 하나를 가져오겠다
const navigate = useNavigate();
// 홈으로 이동
navigate('/');
```

## navigate('/경로')
- 브라우저 전체를 새로 띄우는 방식보다는, 현재 SPA 안에서 주소와 화면을 바꾸는 이동 방식

## a href, window.location.href 와 차이
- a href, window.location.href 는 페이지 전체를 새로고침(브라우저 기본 링크 이동)
- useNavigate는 페이지 전체를 새로고침하지 않고 화면만 바꿈(SPA 방식)
- `navigate('/login')` -> 브라우저 전체를 새로 띄우는 게 아니라, 라우터야 주소 바뀐 걸 기준으로 현재 앱 안에서 화면만 바꿔줘

## 사용방법
```typescript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return <button onClick={goHome}>홈으로</button>;
};
```
- useNavigate() 호출 -> navigate 함수 받음 -> 원하는 순간 navigate('/원하는주소')

## why 훅?
- useNavigate는 함수처럼 보이지만 훅
- React Router가 현재 라우터 문맥 안에서 이 컴포넌트가 이동할 수 있도록 정보를 주는 방식이기 때문
- 라우터 안에 있는 컴포넌트에서 꺼내 쓰는 도구

## 사용위치
- 컴포넌트 안, 커스텀 훅 안
- (로그인 성공 후 홈 이동, 회원가입 후 로그인 화면 이동, 저장 후 상세 페이지 이동, 권한 없으면 접근 불가 페이지 이동)

## navigate('/path')
- 내부적으로 브라우저 주소(history) 를 조작 -> 주소창도 바꿈
- navigate('/login'); -> 주소창이 /login으로 바뀜 -> 경로에 맞는 컴포넌트가 렌더링
- 단순히 화면만 바꾸는 게 아니라 라우터 상태와 주소를 함께 바꾸는 것

## 응용
```typescript
// 뒤로 가기
navigate(-1);

// 앞으로 가기
navigate(1);

// 특정 경로로 이동
navigate('/path');

// replace: 히스토리 스택에 남기지 않고 덮어쓰기
navigate('/path', { replace: true });
```

## Route path vs navigate() / useNavigate vs Link
- Route path : 주소 등록 (주소와 화면 컴포넌트를 연결하는 규칙표)
- navigate() / useNavigate : 코드 이동 (등록된 규칙표 보고 실제로 이동시키는 함수)
- Link to : 클릭 이동
- path 등록 없이 navigate만 하면 안됨
- 라우터에 주소 등록(Route path, element) -> 어디선가 이동 발생(navigate) -> React Router가 현재 주소 보고 맞는 화면 렌더링




## 
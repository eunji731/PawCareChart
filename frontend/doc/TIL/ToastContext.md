# ToastContext(useContext, useCallback, useMemo)

## createContext
### context
- 여러 컴포넌트가 같이 봐야 하는 값을 넣어두는 공용 게시판(중간 전달 없이 필요한 놈이 바로 꺼내 보게 하는 것)
    - props 방식 : A -> B -> C -> D(중간을 거쳐야하는 방식)
    - context 방식 : A -> D(중간을 거치지 않는 방식)

    - context : 공용 게시판
    - createContext : 그 공용 게시판을 만드는 행위
    - provider : 그 게시판에 글을 쓰는 행위
    - useContext : 그 게시판에 적힌 걸 읽어오는 것

### 사용이유
- 리액트는 부모가 자식에게 props로 값을 내려주는 방식
- 아주 깊은 하위 컴포넌트가 해당 정보를 필요로 할 경우 여러 컴포넌트가 내려가면서 계속 props를 전달해야함
- 이를 `props drilling`이라고 부름
- props drilling을 해결하기 위해 `createContext`를 사용
- 위쪽에서 한 번 제공하고, 아래쪽 어디서든 꺼내 사용 가능하도록

### 기본구조
- 1. context 생성 -> 2. provider 감싸기 -> 3. useContext로 사용

```typescript
// 1. context 생성 - 게시판 만든다(게시판 틀만 만든 상태)
import { createContext } from 'react';
const MyContext = createContext(null);

// 2. provider 감싸기 - 게시판에 내용 적는다(이 게시판에는 현재 user가 홍길동이라고 적어둠)
<MyContext.Provider value={{ user: '홍길동' }}>
  <자식들 />
</MyContext.Provider>

// 3. useContext로 사용 - 필요한 곳에서 읽는다(이 게시판에 적힌 값을 읽어옴)
import { useContext } from 'react';
const value = useContext(MyContext);
```
### 예시
```typescript
// 토스트 공용 게시판에 등록된 showToast 함수를 꺼내온다
const { showToast } = useToast();
```

### context 표 정리
| 용어 | 의미 | 비유 |
|---|---|---|
| context | 여러 컴포넌트가 함께 쓰는 공용 값 공간 | 공용 게시판 |
| createContext | context를 만드는 함수 | 게시판 설치 |
| Provider | context에 실제 값을 넣어주는 역할 | 게시판에 공지 붙이기 |
| useContext | context 안의 값을 꺼내오는 것 | 게시판 내용 읽기 |
| state | 실제로 바뀌는 데이터 | 게시판에 적힌 실제 내용 |

### props 방식 vs context 방식
- `props 방식`
    - 부모가 자식에게 값을 계속 넘겨주는 방식
    - 중간 컴포넌트는 필요도 없는 값을 전달만 하게 되니 번거로움
    - 사람마다 손으로 전달
-`context 방식`
    - 공용 공간에 값을 넣어두고 필요한 컴포넌트가 직접 꺼내 쓰는 방식
    - 부모가 중간중간 계속 넘기지 않아도 되고, 필요한 컴포넌트가 바로 가져다 쓸 수 있음
    - 공용 게시판에 붙여두고 필요한 사람이 직접 확인

| 구분 | props | context |
|---|---|---|
| 전달 방식 | 부모가 자식에게 직접 전달 | 공용 공간에 넣고 필요한 곳에서 꺼냄 |
| 중간 컴포넌트 역할 | 값을 계속 받아서 전달해야 함 | 굳이 전달하지 않아도 됨 |
| 사용하기 좋은 경우 | 1~2단계 정도의 단순 전달 | 여러 컴포넌트가 공통으로 써야 하는 값 |
| 장점 | 구조가 단순하면 이해하기 쉬움 | 깊은 구조에서도 편하게 공유 가능 |
| 단점 | 깊어질수록 번거롭고 복잡함 | 남발하면 오히려 구조가 헷갈릴 수 있음 |
| 대표 예시 | 버튼 텍스트, 한 단계 아래로 넘길 값 | 로그인 정보, 토스트, 테마, 언어 설정 |
---

## useContext
- context에 들어있는 값을 꺼내 쓰는 도구
- createContext로 만든 공용 공간 안에 들어있는 값을 가져오는 것
- `createContext` = 공용 공간 만들기(게시판 설치) / `Provider` = 값 넣기(게시판에 공지 붙이기) / `useContext` = 값 꺼내기(게시판 내용 읽기)
- `useContext` = 게시판에 뭐 적혀 있나 확인하는 행동

---
## useCallback
- 함수를 기억해두는 훅
- 이 함수, 조건이 안 바뀌면 새로 만들지 말고 전에 만든 거 계속 쓰도록 하는 것

### 사용목적
- 리액트 컴포넌트는 state가 바뀌면 다시 실행
- state가 바뀌어서 컴포넌트가 다시 실행될 때마다 함수도 새로 만들어짐 -> 보통은 큰 문제 아님
- 즉 리렌더링 때마다 같은 모양의 함수가 다시 만들어져도, 리액트 입장에서는 새 함수로 인식
- 문제 되는 경우 : 
    - 자식 컴포넌트에 함수를 props로 넘길 때
    - useEffect 의존성 배열에 함수가 들어갈 때
    - 리렌더링 최적화가 필요한 경우

### 기본 문법
```typescript
// 기본 문법
const memoizedFn = useCallback(() => {
  // 실행할 내용
}, [의존성]);

// 예시 -> 처음 만든 handleClick 함수를 계속 재사용하겠다
// []가 비어 있으니 바뀔 조건이 없어서, 리렌더링돼도 같은 함수를 유지
const handleClick = useCallback(() => {
  console.log('클릭');
}, []);
```

### 기존 함수 형태 vs useCallback
```typescript
// 기존 함수 형태
// doSomething이 렌더링마다 새로 만들어져서 의존성 배열 [doSomething]이 계속 바뀌게 됨
// useEffect도 계속 다시 실행될 수 있음
function Example() {
  const doSomething = () => {
    console.log('실행');
  };

  useEffect(() => {
    doSomething();
  }, [doSomething]);
}


// useCallback 사용
// doSomething이 고정되니 useEffect도 쓸데없이 반복 실행되지 않음
function Example() {
  const doSomething = useCallback(() => {
    console.log('실행');
  }, []);

  useEffect(() => {
    doSomething();
  }, [doSomething]);
}
```

### 의존성 배열의 중요성
```typescript
// count가 바뀌지 않으면 같은 함수 쓰고, count가 바뀌면 새 함수 만들겠다
// 함수 안에서 쓰는 값은 의존성 배열에 넣어야 한다
// 아닐 경우 예전 count 값을 계속 잡고 있을 수 있는 stale closure 문제가 발생
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```
- `[]` : 의존성 배열
- `[count]` : count가 바뀌면 새 함수를 만들겠다
- `[]` : count가 바뀌지 않으면 같은 함수를 쓰겠다

### 사용하기 좋은 경우 vs 나쁜 경우
- 좋은 경우
    - 자식에게 함수 props를 넘기는데 최적화가 필요할 때
    - useEffect 의존성에 함수가 들어갈 때
    - React.memo와 함께 렌더링 줄이고 싶을 때
- 나쁜 경우
    - 그냥 버튼 클릭 함수 하나 정도
    - 최적화 이슈가 없는 단순 컴포넌트
    - 남발하면 오히려 코드가 더 복잡해지는 경우
=> `useCallback`은 성능 최적화용 성격이 강하다


### useCallback vs useMemo
- useCallback : 함수를 기억
- useMemo : 값을 계산한 결과를 기억
---

## useMemo
- 값을 기억해두는 훅
- 이 계산 결과, 조건 안 바뀌면 다시 계산하지 말고 전에 계산한 값 사용
- 계산에 쓰는 값은 의존성 배열에 넣어야 함

### 필요성
- 리액트 컴포넌트는 상태가 바뀌면 다시 실행 -> 컴포넌트 안의 계산도 다시 -> 렌더링될 때마다 계속 실행되면 비효율적

### 기본문법
```typescript
// 기본 문법
const memoizedValue = useMemo(() => {
  return 계산결과;
}, [의존성]);

// 예시 -> count가 바뀌면 다시 계산, count가 안 바뀌면 예전 결과 재사용
const doubled = useMemo(() => {
  return count * 2;
}, [count]);

// 예시 -> list가 바뀌면 다시 계산, list가 안 바뀌면 예전 결과 재사용
const filteredList = useMemo(() => {
  return list.filter(item => item.active);
}, [list]);

```

### useMemo vs 변수
```typescript
// 변수 -> 렌더링될 때마다 새로 계산
const doubled = count * 2;

// useMemo -> count가 안 바뀌면 예전 결과 재사용
const doubled = useMemo(() => {
  return count * 2;
}, [count]);
```

### useEffect에서의 useMemo
```typescript
// useMemo 없이
// -> options가 렌더링마다 새 객체가 되니 useEffect가 계속 다시 실행
const options = { page: 1, limit: 10 };
useEffect(() => {
  fetchData(options);
}, [options]);

// useMemo 사용
// -> options가 고정되니 불필요한 effect 재실행을 줄일 수 있음
const options = useMemo(() => {
  return { page: 1, limit: 10 };
}, []);

useEffect(() => {
  fetchData(options);
}, [options]);
```

--- 
## React Hook 정리 - useContext, useCallback, useMemo
| 항목 | useContext | useCallback | useMemo |
|---|---|---|---|
| 한 줄 설명 | Context에 저장된 값을 꺼내서 사용하는 훅 | 함수를 기억해서 재사용하는 훅 | 계산 결과값을 기억해서 재사용하는 훅 |
| 무엇을 기억/사용하나 | Context 값 | 함수 | 값 |
| 주 목적 | 여러 컴포넌트가 공통 값 공유 | 함수가 렌더링마다 새로 생성되는 것 방지 | 불필요한 재계산 방지 |
| 대표 사용 상황 | 로그인 정보, 토스트, 테마 공유 | 자식 컴포넌트에 함수 props 전달, useEffect 의존성 함수 | 무거운 계산, 배열/객체 참조 유지 |
| 기본 형태 | `const value = useContext(MyContext)` | `const fn = useCallback(() => {}, [deps])` | `const value = useMemo(() => 계산식, [deps])` |
| 의존성 배열 필요 여부 | 없음 | 있음 | 있음 |
| 렌더링과의 관계 | Provider에 넣은 값을 가져옴 | 의존성이 안 바뀌면 같은 함수 유지 | 의존성이 안 바뀌면 같은 계산 결과 유지 |
| 초보 기준 핵심 | 공용 값 꺼내기 | 함수 재사용 | 값 재사용 |
| 주의할 점 | Provider 안에서 사용해야 함 | 무조건 쓰지 말고 필요한 곳만 써야 함 | 단순 계산에는 굳이 안 써도 됨 |




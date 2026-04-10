# useState
- 컴포넌트 안에서 화면에 영향을 주는 값을 저장하고, 그 값을 바꿀 수 있게 해주는 리액트 기능
- 화면에 영향을 주는 값 저장소
- 리액트에게 “이 값은 화면 갱신과 연결된 값이다”라고 알려주는 장치
    - 그냥 변수 아님
    - 화면과 연결된 변수
    - 이 값을 바꾸면 리액트가 화면을 다시 계산

## 문법
```typescript
import { useState } from 'react';

// [현재 상태 값, 상태를 바꾸는 함수] = useState(초기값);
const [count, setCount] = useState(0);
```
- `useState(0)` : useState(0)
- `count` : 현재 상태 값
- `setCount` : 상태를 바꾸는 함수
=> 초기값이 0인 상태 하나를 만들고, 현재 값은 count로 읽고, 값 변경은 setCount로 하겠다.
- 배열처럼 받는 이유 : useState가 내부적으로 두 개를 묶어서 돌려주기 때문
```typescript
// [현재값, 값을바꾸는함수]
const [count, setCount] = [0, 어떤변경함수];
```
- 상태값과 상태변경함수를 한 쌍으로 받는 문법

## 상태 변경시 리렌더링
1. 리액트가 새로운 상태값을 저장
2. 해당 컴포넌트를 다시 실행
3. 새 상태 기준으로 JSX 다시 계산
4. DOM에 필요한 부분 반영

## useState 사용 예시
```typescript
// 입력값
const [title, setTitle] = useState('');
// 목록 데이터
const [records, setRecords] = useState([]);
// 로딩 여부
const [loading, setLoading] = useState(false);
// 에러 여부
const [error, setError] = useState('');
// 모달 열림 여부
const [isOpen, setIsOpen] = useState(false);
// 선택된 탭
const [tab, setTab] = useState('all');
```
=> 화면이 바뀌는 거의 모든 원인은 state

### useState 사용 예시(폼)
```typescript
// 제목 입력창
const [title, setTitle] = useState('');

<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

1. 현재 title 값이 input에 표시됨
2. 사용자가 입력함
3. onChange 실행
4. setTitle(입력값) 호출
5. state 변경
6. 컴포넌트 다시 실행
7. 바뀐 title 값이 input에 다시 반영

=> 입력창도 결국 state 중심으로 움직임

### useState 사용 예시(목록조회)
```typescript
// 선언
const [records, setRecords] = useState([]);

// API 호출 후
setRecords(data);
```

1. 처음에는 빈 배열
2. API 응답 오면 데이터 저장
3. state 변경
4. 화면에 목록 표시

=> 조회 결과를 화면에 뿌리는 것도 결국 state로 하는 것.

### useState 규칙
#### 규칙 1: 상태는 직접 바꾸지 않는다(변경 함수를 통해 바꾸기)
#### 규칙 2: 상태 변경 함수로 바꿔야 화면이 갱신된다
    - 그냥 변수처럼 바꾸면 리액트가 모름
    - 반드시 setCount(새값) 호출해야 함

### 배열/객체 state 조심!
```typescript
const [records, setRecords] = useState([]);

setRecords([...records, newRecord])
```
- records.push(...) 같은 식은 금지
- 보통은 새 배열을 만들어서 넣기

### useState! 흑!
- useState는 리액트의 Hook 중 하나
- `Hook` = 함수형 컴포넌트 안에서 리액트 기능을 쓰게 해주는 특별한 함수
- useState → 상태 쓰기 / useEffect → 특정 시점에 동작 실행 / useContext → 전역 상태 읽기 / useMemo → 계산 결과 재사용 / useRef → 화면 요소 직접 제어
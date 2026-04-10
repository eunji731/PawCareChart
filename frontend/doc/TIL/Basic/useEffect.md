# useEffect


## useEffect vs useState
- useState : 화면에 영향을 주는 값 저장
- useEffect : 컴포넌트가 렌더링된 뒤 특정 작업을 실행하는 기능

## 1. useEffect란?
- 컴포넌트가 화면에 그려진 후(마운트) 또는 상태가 변경되었을 때 **특정 동작(Side Effect)**을 실행하게 해주는 리액트 Hook
- 렌더링 외의 작업을 처리하는 곳
- 부수작업(Side Effect) 처리하는 도구
- Side Effect = 화면 밖의 일
    - API 호출(처음 페이지 열릴 때 API조회)
    - 타이머 설정(타이머 시작/해제)
    - 외부 라이브러리 연동
    - localStorage 저장/읽기
    - 특정 값 바뀌면 다시 조회
    - 이벤트 리스너 등록/해제

## 기본 문법
```typescript
useEffect(() => {
  // 실행할 작업
}, []);
```
- 의존성 배열
- 언제 다시 실행할지 기준이 되는 값 목록

## 자주쓰는 3가지 패턴 ⭐의존성 배열⭐
### 패턴 1. 처음 한 번만 실행
```typescript
useEffect(() => {
  loadData();
}, []);
```
- => 컴포넌트가 처음 화면에 나타난 뒤 한 번 실행
(목록 첫 조회, 상세 첫 조회, 초기설정)

### 패턴 2. 특정 값이 바뀔 때 실행
```typescript
useEffect(() => {
  loadData();
}, [dogId]);
```
- => 처음에도 실행하고, dogId가 바뀔 때마다 다시 실행
(선택한 강아지가 바뀌면 목록 재조회, 검색어가 바뀌면 다시 필터링, 페이지 번호가 바뀌면 재조회)
- => 의존성 배열 안 값이 바뀌면 effect가 다시 돈다

### 패턴 3. 매 렌더링마다 실행
```typescript
useEffect(() => {
  console.log('렌더링됨!');
});
```
- => 의존성 배열을 안쓰면 컴포넌트가 화면에 그려질 때마다 실행(렌더링 때마다 실행)

## 필요성
- 렌더링 뒤에 해야 할 작업은 useEffect 안에 넣기
- 컴포넌트 안에 바로 쓰면 안좋음 -> 헨더힝 흐름이 꼬이거나 재실행마다 호출 가능성 존재
```typescript
useEffect(() => {
  fetchRecords().then(data => setRecords(data));
}, []);
```
- -> 데이터 조회시점 제어 가능

## useState와 useEffect 연결
```typescript
const [records, setRecords] = useState([]);

useEffect(() => {
  fetchRecords().then(data => setRecords(data));
}, []);
```
1. 처음 렌더링
2. useEffect 실행
3. API 호출
4. 응답 도착
5. setRecords(data)
6. 상태 변경
7. 컴포넌트 다시 렌더링
8. 목록 표시
- `useState` = 저장
- `useEffect` = 언제 불러올지/언제 실행할지

## 렌더링 후 실행?
- 리액트 흐름 : 컴포넌트 실행 -> JSX 계산 -> 화면 반영 -> useEffect 실행
- `useEffect` : 컴포넌트 함수 본문이 먼저 돌고, 화면이 반영된 뒤에 실행되는 작업(API 요청, 브라우저 작업, 구독 등록)

## cleanup
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('실행');
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```
- effect 실행 시 타이머 시작
- 컴포넌트가 사라지거나 effect가 다시 돌기 전에 타이머 정리

## useEffect 패턴(목록 페이지) : 페이지 진입 시 목록 조회
```typescript
useEffect(() => {
  loadRecords();
}, []);
```

## useEffect 패턴(상세 페이지) : 상세 페이지에서 URL의 id가 바뀌면 다시 조회
```typescript
useEffect(() => {
  loadDetail(id);
}, [id]);
```

## useEffect 패턴(필터/검색 연동) : 검색어나 강아지 선택이 바뀌면 재조회
```typescript
useEffect(() => {
  searchRecords(keyword, dogId);
}, [keyword, dogId]);
```

## useState vs useEffect
| 구분 | useState | useEffect |
|---|---|---|
| 역할 | 화면에 영향을 주는 값 저장 | 특정 시점에 작업 실행 |
| 주 용도 | 입력값, 목록 데이터, 로딩 상태 | API 호출, 타이머, 이벤트 등록 |
| 화면 변화와 관계 | 값이 바뀌면 렌더링 유발 | 내부에서 상태를 바꾸면 렌더링 유발 가능 |
| 핵심 질문 | 무엇을 저장할까? | 언제 실행할까? |
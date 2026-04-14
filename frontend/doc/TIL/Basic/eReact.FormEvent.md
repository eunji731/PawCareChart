# e: React.FormEvent
- 폼 이벤트 객체의 타입

## 각 단어 의미 파악
- `e` = 이벤트 객체 변수 이름
- `React.FormEvent` = 그 이벤트 객체의 타입
- 폼에서 발생한 submit 이벤트 정보를 담고 있는 객체를 e로 받겠다

## e
- 이벤트 관련 정보 묶음
- 사용자가 폼에서 어떤 동작을 하면 브라우저는 이벤트 객체를 만들어서 넘겨줌
- 이벤트 객체 안에는 여러 정보(이벤트 종류, 발생요소, 동작 방지여부, 현재 타겟 등)

## 왜 폼 submit에서 이걸?
- HTML form은 원래 submit되면 브라우저가 기본 동작함
    - 페이지 새로고침
    - action으로 전송
    - 입력값 서버로 전송
- 리액트는 페이지 새로고침 없이 화면만 바꾸는 SPA 방식 -> 기본 동작 막아야함
    - e를 받는 가장 큰 이유는 폼 기본 제출 막기
    - e.preventDefault()로 기본 동작 막고 리액트 방식으로 처리
    - e.preventDefault()를 쓰려면 이벤트 객체를 받아야함 -> React.FormEvent로 타입 지정

## React.FormEvent
- 이건 TypeScript 타입
- TypeScript에서는 e가 무슨 타입인지 명시해주는 게 좋음
- 이 e는 React의 form 관련 이벤트 객체다
- 타입 작성 이유 : TypeScript가 e 안에 어떤 속성과 메서드가 있는지 알게 하려고
- React.FormEvent 작성시
    - e.preventDefault() 가능
    - e.currentTarget 있음
    - form 이벤트 관련 객체임
    - 자동완성도 좋아지고, 잘못 쓴 코드도 잡아줌

## React.FormEvent -> Form이벤트?
- 이 핸들러가 연결되는 자리가 form의 onSubmit이기 때문
- 폼에서 발생한 제출 이벤트 -> 폼 제출 이벤트는 React.FormEvent 타입

## 실제 흐름
```typescript
<form onSubmit={handleLogin}>
```
- 사용자가 엔터 치거나 submit 버튼 누름
- → form submit 이벤트 발생
- → React가 이벤트 객체 만들어서 handleLogin에 넘김
- → e로 받음
- → e.preventDefault() 호출
- → 기본 제출 막고 직접 로그인 처리
- => e는 그 과정에서 전달되는 이벤트 정보

## preventDefault() 왜 e 안에?
- 이벤트 객체는 “이 이벤트를 제어할 수 있는 기능”도 같이 갖고 있음
- 이 이벤트의 기본 동작을 하지 마라 -> preventDefault()
- 이 이벤트가 어디서 발생했는지 -> e.target
- 이 이벤트가 어떤 타입인지 -> e.type

## React.FormEvent vs React.FormEvent<HTMLFormElement>
- React.FormEvent : 폼 관련 이벤트 객체라는 뜻
- React.FormEvent<HTMLFormElement> : 이 이벤트는 HTML form 요소에서 발생한 FormEvent(뒤에 <HTMLFormElement>가 붙으면 더 정밀한 타입)

## 프로젝트 속 코드
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
```
- 폼 제출 이벤트 객체를 e로 받고, 브라우저 기본 제출 동작은 막은 뒤, 내가 직접 로그인 로직을 처리하겠다
- e: React.FormEvent는 폼 제출 시 전달되는 이벤트 객체의 타입을 지정한 것이고, 주로 preventDefault()로 기본 제출 동작을 막기 위해 사용

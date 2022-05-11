# React Master Class

### 노마드코더 강의 내용 정리 및 복습을 위한 README 입니다.

<br>
<br>
<br>
<br>

### 220429

<br>
react-hook-form에 대해 배움.

```
$ npm install react-hook-form
```

기본적인 형태로는 아래와 같이 사용한다.

```
import {useForm} from "react-hook-form";


function ToDoList() {
    const {register, handleSubmit} = useForm<IForm>();
    onst onValid = (data: any) => {
        console.log(data)
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onValid)}>
                <input {...register("toDo")} />
            </form>
        </div>
    )
}

// useForm을 install 한후 register를 input에 넣어준다.
// ...은 스프레드(spread) 연산자로 ES6부터 지원이 가능하며, 객체를 개별요소로 분리해준다.
// handleSubmit은 form 태그에 넣어 form 안에 있는 input 값을 가져온다.
```

사용하기 쉽고 유효성 검사를 통해 성능이 뛰어난 확장 가능한 form이다.
<br>
input을 필수로 받아야할 때 사용하는 required를 html에서 넣게되면
<br>
사용자가 개발자 도구를 열어 required를 제거한 후 사용할 수 도 있기 때문에
<br>
register 함수에 넣어주는 것이 좋다.
<br>

<br>
<br>
required를 넣는 동시에 Validation와 Error 메세지 또한 넣어 줄 수 있다.
<br>
아래는 useForm을 활용한 회원가입 화면을 간단하게 구현했다.

```
interface IForm {
    email: string,
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    password1: string,
    extraError?: string,
}

function ToDoList() {

    // defaultValues: {email :} 을 하여, input 초기값에 네이버 이메일을 넣어준다.
    const {register, handleSubmit, formState:{errors}, setError} = useForm<IForm>({defaultValues: {email: "@naver.com"}});

    // 만약 Password와 Password1(비밀번호 재확인)이 다르면 에러 메세지가 나오도록 함.
    const onValid = (data: IForm) => {
        if(data.password !== data.password1){
            setError("password1", { message: "Password are not the same" });
        }
        // 서버통신에 문제 발생 시 에러 메세지 표시
        // setError("extraError", {message: "Server offline."})
    };
    return (
        <div>
            <form onSubmit={handleSubmit(onValid)}>
                <input {...register("email", {required: "Email Required", pattern: {value: /^[A-Za-z0-9._%+-]+@naver.com$/, message: "Only naver.com emails allowed"}})} placeholder="Email" />
                <span>
                    // formState: { errors } 를 가져와 사용함.
                    {errors?.email?.message}
                </span>
                <input {...register("firstName", {required: "Write here !", validate: (value)=> value.includes("nico") ? "no nicos allowed" : true })} placeholder="First Name" />
                <span>
                    {errors?.firstName?.message}
                </span>
                <input {...register("lastName", {required: "Write here !"})} placeholder="Last Name" />
                <span>
                    {errors?.lastName?.message}
                </span>
                <input {...register("userName", {required: "Write here !", minLength: {value: 5, message: "To Shorts"}})} placeholder="User Name" />
                <span>
                    {errors?.userName?.message}
                </span>
                <input {...register("password", {required: "Write here !", minLength: 5})} placeholder="Password" />
                <span>
                    {errors?.password?.message}
                </span>
                <input {...register("password1", {required: "Write here !", minLength: 5})} placeholder="Password1" />
                <span>
                    {errors?.password1?.message}
                </span>
                <button>Add</button>
            </form>
        </div>
    )
}

// pattern - value의 식은 정규표현식으로 네이버 이메일만 가능하도록 만들었다.
```

<br>
<br>
<br>
<br>

### 220430

<br>
기본적인 Form 만들기를 마치고 나서 본적격인 To Do List를 만든다.
<br>

```
import { useForm } from "react-hook-form";
import { atom, useRecoilState } from "recoil";

interface IForm {
  toDo: string;
}

// category는 string이 아닌 "TO_DO" 혹은 "DOING" 혹은 "DONE" 만 가능하도록 함.
interface IToDo {
  text: string;
  id: number;
  category: "TO_DO" | "DOING" | "DONE";
}

// atom을 만들어 주고 toDo는 배열로 들어오기 때문에 <IToDo[]>로 넣어준다.
// default 초기값 또한 빈 배열로 설정한다.
const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
});

function ToDoList() {
  // Recoil를 CoinTracker에서도 사용했는데
  // useRecoilState는 읽고 변경까지 가능하기 때문에
  // 배열을 만들어 [읽기, 변경하여 사용하기]로 쓰였다.
  const [toDos, setToDos] = useRecoilState(toDoState);

  // useForm을 사용하여 register과 handleSubmit, setValue를 사용한다.
  // useForm은 form과 form 안에 input을 사용하기 적합하다.
  const { register, handleSubmit, setValue } = useForm<IForm>();

  // handleValid는 toDo를 받아와 setToDos로 바꿔주는데
  // 이때 setToDos는 기존 toDo들(oldToDos)은 뒤쪽 배열로 넣어준다.
  // 이는 새로운 toDo가 들어오면 기존 toDos들은 없애지 않기 위해서이다.
  const handleValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [

        // Category를 만들어 TODO와 DOING, DONE을 구별한다.
        // 각 ToDo의 ID도 만들어준다. ID는 ToDo가 생성된 시간으로 함.
      { text: toDo, id: Date.now(), category: "TO_DO" },
      ...oldToDos,
    ]);

    // setValue에 "" 빈 문자열로 리렌더링해준다.
    setValue("toDo", "");
  };
  return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <form onSubmit={handleSubmit(handleValid)}>
        <input
          {...register("toDo", {
            required: "Please write a To Do",
          })}
          placeholder="Write a to do"
        />
        <button>Add</button>
      </form>
      <ul>
        {toDos.map((toDo) => (
          <li key={toDo.id}>{toDo.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
```

위의 코드를 한 tsx파일에 넣어놓기엔 가독성도 좋지 않고 코드 유지보수에 적합하지 않다.
<br>
리팩토링 작업으로 코드의 목적에 맞게 나누어준다.
<br>
<br>
<br>

- ToDoList.tsx - 리스트를 관리한다.
  <br>
- ToDo.tsx - 투두를 관리한다.
  <br>
- atoms.tsx - 아톰을 관리한다.
  <br>
  <br>
  <br>
  이후 ToDo.tsx에서 ToDo를 생성하고 버튼을 사용하여 ToDo를 Doing과 한다.

```
import React from "react";
import { useSetRecoilState } from "recoil";
import { IToDo, toDoState } from "../atoms";

function ToDo({ text, category, id }: IToDo) {
  const setToDos = useSetRecoilState(toDoState);

  // onClick로 ToDo를 Doing || Done 로 변환시키기 위해 사용한다.
  // ButtonElement를 받아와 name을 가져오도록 한다.
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;

    // setToDos에 함수를 넣고 변수 targetIndex와 newToDo를 만든다.
    // targetIndex는 클릭 시 toDo.id === id 라면 findIndex로 몇번째 인덱스인지 가져온다.
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id);

      // newToDo는 버튼 클릭 시 새로운 category로 바뀐 ToDo를 말한다.
      // Category가 "TO_DO" | "DOING" | "DONE"로 되어있는데 이를 any로 바꾸어 에러를 막아준다.
      const newToDo = { text, id, category: name as any };

      // 이후 배열 안에 slice를 사용해서 배열의 처음부터 ~ targetIndex 사이의 값을 가져오고
      // newToDo를 그 사이에 넣고 targetIndex부터 나머지 ToDo까지 가져온다.
      return [
        ...oldToDos.slice(0, targetIndex),
        newToDo,
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };
  return (
    <li>
      <span>{text}</span>

      // 카테고리가 DOING이 아니라면 버튼을 생성하도록함
      {category !== "DOING" && (
        <button name="DOING" onClick={onClick}>
          Doing
        </button>
      )}
      {category !== "TO_DO" && (
        <button name="TO_DO" onClick={onClick}>
          To Do
        </button>
      )}
      {category !== "DONE" && (
        <button name="DONE" onClick={onClick}>
          Done
        </button>
      )}
    </li>
  );
}

export default ToDo;
```

<br>
<br>
<br>
<br>

### 220501

<br>
selector는 파생된 state의 일부를 나타낸다.
<br>
selector는 기존 state를 이용하여 새로운 state를 만들어서 반환할 수 있다.
<br>
기존의 state는 이용만 할 뿐 변형시키지는 못한다. (읽기만 가능).
<br>
파생된 state는 다른 데이터에 의존하는 동적인 데이터를 만들 수 있기 때문에 강력한 개념이다.

```
export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {

    // toDoState를 가져옴
    const toDos = get(toDoState);
    // categoryState를 가져옴
    const category = get(categoryState);
    // toDOs에서 filter함수를 사용하여 toDo의 카테고리와 category의 state가 일치하면 true를 반환하도록 함
    return toDos.filter((toDo) => toDo.category === category);
  },
});
```

<br>
<br>

Enum는 열거형이라는 뜻으로 TypeScript가 제공하는 기능 중 하나이다.
<br>
이름이 있는 상수들의 집합을 정의 할 수 있는데 열거형을 사용하면 의도를 문서화 하거나
<br>
구분되는 사례 집합을 더 쉽게 만들 수 있다.
<br>
또한 숫자 열거형과 문자 열거형을 제공한다.

```
// 아래와 같이 사용하면 TO_DO는 1로 DOING은 2로 DONE은 3으로 반환된다.
export enum Categories {
  "TO_DO",
  "DOING",
  "DONE",
}

// 아래와 같이 사용하면 TO_DO는 TO_DO로 DOING은 DOING으로 DONE은 DONE으로 반환된다.
export enum Categories {
  "TO_DO" = "TO_DO",
  "DOING" = "DOING",
  "DONE" = "DONE",
}
```

<br>
<br>
<br>
<br>

### 220503

<br>
React 강의 중 과제를 주어서 해결함.
<br>

과제 내용

- Delete 버튼을 이용하여 toDo 배열에서 삭제를 하시오.
- localStorage에 toDo 배열을 저장하시오.
  <br>

첫번째 Delete 버튼은 간단하게 해결했다.
<br>
먼저 ToDo.tsx 에 Delete 버튼을 추가한다.

```
      // 기존 Doing, Done 버튼과 같이 만듬
      {category !== Categories.DELETE && (
        <button name={Categories.DELETE + ""} onClick={onDelete}>
          DELETE
        </button>
      )}
```

이후 atom.tsx 에 Categories에 DELETE를 추가해준다.

```
export enum Categories {
  "TO_DO" = "TO_DO",
  "DOING" = "DOING",
  "DONE" = "DONE",
  "DELETE" = "DELETE", // DELETE 추가
}
```

Delete 버튼에 onClick은 toDo를 추가하는게 아닌 지우는 목적이므로
<br>
onClick 함수가 아닌 onDelelte 함수로 받음.

```
const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
  setToDos((oldToDos: any) => {
  const targetIndex = oldToDos.findIndex((toDo: any) => toDo.id === id);
  return [
    ...oldToDos.slice(0, targetIndex),
    ...oldToDos.slice(targetIndex + 1),
    ];
  });
};
```

기존 onClick과 유사하지만 return에서 차이가 남.
<br>
먼저 Delete가 클릭 되면 클릭 된 targetIndex를 받고
<br>
slice함수를 통해 oldToDos 배열에서 targerIndex의 앞 요소와 뒤 요소만 가져온다.
<br>
한마디로 targetIndex의 요소를 제외한 나머지를 가져온다는 것이다.

<br>
<br>
두번째로는 localStorage에 저장하는 것인데
<br>
recoil에서 recoil-persist에 storage 기능을 사용했다.
<br>
<br>
* https://www.npmjs.com/package/recoil-persist 👈 라이브러리 주소

```
$ npm install recoil-persist
```

recoil-persist를 설치 한 후 atom.tsx에 추가해준다.
<br>
라이브러리 주소에 예제 코드를 보고 따라치면 된다.

```
const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: localStorage,
});

export const toDoState = atom({
  key: "toDo",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
```

이후 localStorage에 ToDo 배열이 저장되는 걸 확인 할 수 있다.

- 첫번째 문제점은 recoil-persist가 recoil의 0.6.1 버전까지만 호환이 가능하다.
  <br>
  문제 해결은 간단하게 recoil를 다운그레이드하여 해결했다.
  <br>
  <br>
- 두번째 문제점은 recoil을 다운그레이드하니 index.tsx에 RecoilRoot가 오류가 났다.
  <br>
  구글에 검색해보니 RecoilRoot 오류는 recoil의 0.7.x 버전 이상에서만 사용가능하다고 한다.
  <br>
  옳바른 방법은 아니긴 하지만 다시 recoil의 버전을 업그레이드 한 후 실행한 결과.
  <br>
  recoil-persist과 RecoilRoot가 정상 작동했다.

<br>
<br>
<br>
<br>

### 220504

<br>
selector에 대한 복습 및 get과 set을 통한 minute과 hour 변환
<br>
<br>

```
// APP.tsx

import React from "react";
import { useRecoilState } from "recoil";
import { hourSelector, minuteState } from "./atoms";

function App() {
  // atom.tsx에서 minuteState와 hourSelector를 가져온다.

  // minuteState는 minute의 state를 위해 가져온다.
  // hourSelector은 변환 된 hour 값 혹은 단순 hour의 state를 위해 가져온다.
  const [minutes, setMinutes] = useRecoilState(minuteState);
  const [hours, setHours] = useRecoilState(hourSelector);

  // onMinuteChange는 minute의 value값을 가져온다.
  const onMinutesChange = (event: React.FormEvent<HTMLInputElement>) => {
    setMinutes(+event.currentTarget.value);
  };
  // onHoursChange는 hour의 value 값을 가져온다.
  const onHoursChange = (event: React.FormEvent<HTMLInputElement>) => {
    setHours(+event.currentTarget.value);
  };
  return (
    <div>
      <input
        value={minutes}
        onChange={onMinutesChange}
        type="number"
        placeholder="Minutes"
      />
      <input
        onChange={onHoursChange}
        value={hours}
        type="number"
        placeholder="Hours"
      />
    </div>
  );
}

export default App;
```

<br>

```
// atom.tsx

import { atom, selector } from "recoil";

// state를 위한 atom 생성
export const minuteState = atom({
  key: "minutes",
  default: 0,
});

export const hourSelector = selector<number>({
  key: "hours",
  // get은 다른 atom이나 selector를 찾을 수 있다.
  get: ({ get }) => {
    const minutes = get(minuteState);
    return minutes / 60;
  },
  // set은 쓰기를 가능하게 해준다.
  set: ({ set }, newValue) => {

    // newValue에 시간을 받아 * 60 을 해여 분으로 반환한다.
    const minutes = Number(newValue) * 60;

    // set(RecoilState , newValue)의 형태로 반환한다.
    // 즉 minuteState에 minutes(시간 * 60)를 반환한다는 의미이다.
    set(minuteState, minutes);
  },
});
```

<br>
<br>
이후 React-Beautiful-DnD에 대해 배웠는데
<br>
트렐로처럼 드래그를 통한 애니메이션 효과를 내기 위한 react 라이브러리다.
<br>
<br>
https://react-beautiful-dnd.netlify.app/iframe.html?id=board--simple 👈 체험 해보는 주소

```
$ npm i react-beautiful-dnd
$ npm i --save-dev @types/react-beautiful-dnd
```

설치 이후 강의 내용대로 일단 따라쳤다.
<br>
혹시 몰라 해당 라이브러리의 샘플 코드 주소도 알아봤다.
<br>
https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/about/installation.md 👈 깃헙 주소
<br>

https://codesandbox.io/s/k260nyxq9v 👈 예시 코드 주소

DragDropContext 태그 안에 Droppable(부모요소 느낌)를 만든 후
<br>
Droppable안에 Draggable(자식요소 느낌)을 만들어 사용한다.
<br>
똑같이 draggableId를 필요로 하며, Draggable는 index도 넣어준다.
<br>
이후 magic에 우클릭 -> Go to Type Definition을 들어가서
<br>
droppableProps과 dragHandleProps를 파악한다.
<br>
이후 ref={}에 magic.innerRef까지 넣어주면 준비 끝.
<br>
<br>
<br>
(오늘 강의는 일단 그대로 따라치기만 했다 ... 이해하기 어려움...)

```
function App() {
  const onDragEnd = () => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Droppable droppableId="one">
          {(magic) => (
            <ul ref={magic.innerRef} {...magic.droppableProps}>
              <Draggable draggableId="first" index={0}>
                {(magic) => (
                  <li ref={magic.innerRef} {...magic.draggableProps}>
                    <span {...magic.dragHandleProps}>❤</span>
                    One
                  </li>
                )}
              </Draggable>
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
```

<br>
<br>
<br>
<br>

### 220505

<br>
오늘은 지난번에 배운 react-beautiful-dnd의 스타일링으로 시작했다.
<br>
간단하게 스타일링한 후 Droppable의 Type을 보면 placeholder라는 게 있는데
<br>
이를 사용하여 Draggable을 이동할 때 Drappable의 height 변화를 없앨 수 있다.

```
<Droppable droppableId="one">

              // magic 우클릭 후 Go To Type Definition에 들어가면 Type을 확인 할 수 있다.
              {(magic) => (
                <Board ref={magic.innerRef} {...magic.droppableProps}>
                  {toDos.map((toDo, index) => (
                    <DragabbleCard key={toDo} index={index} toDo={toDo} />
                  ))}
                  {magic.placeholder}
                </Board>
              )}
            </Droppable>
```

<br>
그 다음으로 Draggable List 들을 사용자가 원하는 곳에 배치 할 수 있도록 해야한다.
<br>
먼저 useRecoilState를 사용하여 변화된 List들을 렌더링하고
<br>
atom.tsx에 toDoState로 atom을 만들어 기본 값을 준다.

```
// atom.tsx

export const toDoState = atom({
  key: "toDos",
  default: ["a", "b", "c", "d", "e", "f"],
});

```

그 다음 onDragEnd에 draggableId와 destination, source 이 세개의 props를 가져온다.
<br>
draggableId는 내가 이동 시킨 요소 (a를 이동시켰으면 a가 출력됌)
destination은 이동 후에, source는 이동 전에 위치(index) 값을 가져오기 위해 사용된다.
<br>
<br>
따라서 splice함수를 이용해 이동하고 나서의 배열을 다시 만들어준다.
<br>

```
 const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {

    // destination이 undefined type 되어 에러가 발생함.
    // 그래서 !destination 일 때 리턴하도록 함.
    if (!destination) return;
    setToDos((oldToDos) => {
      const toDosCopy = [...oldToDos];

      // 이동 전 index에서 첫번째 요소를 삭제. (즉 이동 전 index를 삭제)
      toDosCopy.splice(source.index, 1);

      // 이동 후 index에서 삭제 없이 draggableId를 추가.
      toDosCopy.splice(destination?.index, 0, draggableId);
      return toDosCopy;
    });
```

여기서 splice는 새로운 배열을 복제하는게 아닌 기존의 배열을 완전히 바꾼다.
<br>
예를 들면

```
const x = "hello";
x.toUpperCase(); // Hello

// 이후 변수 x를 console.log 하면 "hello"가 나온다.

// 하지만 splice는

const x = ['a', 'b', 'c'];
x.splice(0, 1);

// 이후 변수 x를 console.log 하면 ['b', 'c']가 나온다.
```

<br>
<br>
다음으로 Draggable를 이동 시킬 때 Draggable의 배열 안 모든 요소가 렌더링 되어버린다.
<br>
이를 해결하기 위해 React.memo를 사용한다.
<br>
React.memo는 컴포넌트의 props가 바뀌지 않았다면, 리렌더링을 방지하여 컴포넌트의 리렌더링 성능을 최적화 해준다.
<br>

```

// toDo와 index를 props에 추가한다.
function DraggableCard({ toDo, index }: IDraggableCardProps) {
  return (
    <Draggable key={toDo} draggableId={toDo} index={index}>
      {(magic) => (
        <Card
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDo}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
```

위와 같이 사용하여 불필요한 리렌더링을 방지했다.

<br>
<br>
<br>
<br>

### 220506

이번엔 Board의 개수를 늘려 사용하는 걸 배웠다.
<br>
아직 하나의 Drappable에서 Draggable들을 이동 시켰는데
<br>
이젠 여러개의 Drappable을 만들 예정이다.
<br>
먼저 atoms.tsx 파일에 default에 객체를 만들어 안에 여러 개의 요소를 넣는다.

<br>

```
// atoms.tsx

import { atom, selector } from "recoil";

// default를 직접 추가할 수 있으므로 아래와 같이 interface를 추가한다.
interface IToDoState {
  [key: string]: string[];
}

export const toDoState = atom<IToDoState>({
  key: "toDos",
  // 여러개의 보드를 만듬
  default: {
    "To Do": ["a", "b"],
    Doing: ["c", "d", "e"],
    Done: ["f"],
  },
});
```

<br>
이후 Board.tsx 파일을 따로 만든 후 Object.keys()함수를 사용해 Object의 key만 받아와 board를 생성하도록 한다.

```
...
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
        // Object.keys를 사용해 toDoState의 default Object중 이름(keys)만 가져온다.
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
```

<br>
이젠 각 Board들의 value값을 다른 Board들로 이동 시키도록 하는데
<br>
그전에 같은 Board 안에 Draggable들을 이동 시키도록 한다.

<br>

```
const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {

    // destination, draggableId, source 을 받아온다.
    const { destination, draggableId, source } = info;
    if (!destination) return;

    // 만약 현재 Board와 이동 후 Board의 droppableId가 같다면
    // (같은 Board 안에서의 이동)
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {

        // allBoard 객체 안에서 key의 value값을 얻기 위해 key의 이름을 넣는다.
        // 이때 key의 이름인 source.droppableId 즉 이동 전 보드의 이름을 넣음.
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,

          // 복사된 boardCopy가 source.droppableId라고 말함.
          [source.droppableId]: boardCopy,
        };
      });
    }
```

<br>
위 코드를 작성 할 때 처음 본 자바스크립트 문법이 있는데
<br>
바로 Object의 key를 변수에 할 당하여 사용 할 때 []를 사용한다는 것이다.
<br>
<br>
이제 다른 Board로 Draggable을 이동 시킬 차례인데
<br>

```
...

// 만일 현재 이동한 보드의 droppableId와 이동 전 보드의 droppableId가 다를 경우
if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];

        // 이동 전 보드에 source.index 자리에 요소 1개를 삭제
        sourceBoard.splice(source.index, 1);

        // 이동 후 보드에 destination.index 자리에 draggableId 추가
        destinationBoard.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,
          // source.droppableId의 key를 sourceBoard로
          // destination.droppableId의 key를 destinationBoard로 반환.
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }

...
```

<br>
같은 Board에서 이동 시키는것과 크게 다르지 않고
<br>
이동 후의 변수인 destinationBoard를 만들어 사용하면 된다.
<br>
<br>
마지막으로 Snapshot을 배웠는데 (info로 이름을 바꿔 사용) 
<br>
이는 Draggable이 Board에서 다른 Board로 넘어갈 때 색상을 바꿔 넘겨주는 타이밍을 알려 줄 수 있다.
<br>

```
...

const Area = styled.div<IAreaProps>`

  // isDraggingOver === true 면 pink , isDraggingFromThis === true 면 red
  background-color: ${(props) =>
    props.isDraggingOver ? "pink" : props.isDraggingFromThis ? "red" : "blue"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  border-radius: 5px;
`;

// isDraggingFromThis와 isDraggingOver는 boolean타입이다.
interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

function Board({ toDos, boardId }: IBoardProps) {
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area

            // isDraggingOver는 현재 선택한 Draggable이 특정 Drappable 위에 드래깅 되고 있는지 확인.
            isDraggingOver={info.isDraggingOver}

            // 현재 Drappable에서 Draggable 벗어나 드래깅되고 있는지 확인.
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard key={toDo} index={index} toDo={toDo} />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}
```

<br>
<br>
<br>
<br>

### 220509

isDragging으로 Draggable의 드래그 중이거나 드롭 애니메이션인 경우 true반환을 하여 배경색이 바뀌도록 했다.
<br>

```
...

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  // isDragging이 true일 때와 false일 때 backgroundColor와 boxShadow를 변경함.
  background-color: ${(props) => (props.isDragging ? "#74b9ff" : "#f8f5ef")};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 5)" : "none"};
`;

<Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          // isDragging을 사용하여 true와 false를 반환하도록함.
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>

...
```

<br>
이후 useRef를 사용해보았다.
<br>
useRef는 ref를 사용해 DOM을 선택해 직접 접근하기 위해서 사용한다.
<br>
useRef는 .current로 current element를 가져와 사용하게 된다.
<br>
한마디로 Reference와 HTML요소를 가져와 그것을 변형 시켜준다.
<br>

```
...

// <HTMLInputElement>로 Input에 접근
const inputRef = useRef<HTMLInputElement>(null);
  const onClick = () => {
    // inputRef.current. 으로 DOM 조작
    inputRef.current?.focus();
    setTimeout(() => {
      inputRef.current?.blur();
    }, 5000);
  };

return (
  ...
  <input ref={inputRef} placeholder="grab me" />
  <button onClick={onClick}>click me</button>
  ...
)

...
```

<br>
useRef는 알아만두고 본격적으로 To Do를 만들기 위해 Form을 만든다.
<br>
Form은 회원가입 예제를 만들 때 사용해본 기억이 있는데, 그만큼 중요한거 같다.
<br>

```
...

// useSetRecoilState와 atom.tsx 파일에 toDoState를 import 해온다.
const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = (data) => {
    // console.log(data)를 찍어보면 input에 적은 내용이 console.log 창에 보인다.
    console.log(data)
    setValue("toDo", "");
  };

...

      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>

...

```

<br>
이후 처음에 테스트를 위해 만들었던 atoms.tsx 파일에 toDoState를 빈 배열로  변경해준다.

```
export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});
```

<br>
이렇게 변경되면 전체적인 type을 모두 바꿔줘야한다.
<br>
이제 input에서 받은 배열은 배열 안 객체로 받게 되기 때문에 기존 toDo에서
<br>
toDoId와 toDoText를 나누어 사용한다.
<br>

```
// 이전의 테스트를 위한 배열
"To Do" : ["a", "b", "c"]

// input에 입력받은 배열
[{text: "hello", id: 1},{text: "goodbye", id: 2}]
```

<br>
이후 
boardCopy.splice(destination?.index, 0, droppableId); 코드에서 에러가 발생하게 되는데
<br>
이는 toDo로 이루어진 배열 안에 string을 넣으려고 했기 때문이다.
<br>
이를 해결하기 위해 taskObj라는 변수를 생성해 boardCopy 배열의 source.index를 가져온다
<br>
같은 Board에서의 이동할 때와 다른 Board로 이동할 때 모두 변경해준다.

```

  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    // 같은 Board로 이동할 때
    if (destination.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];

        // boardCopy 배열의 source.index를 가져온다.
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    // 다른 Board로 이동할 때
    if (destination.droppableId !== source.droppableId) {
      setToDos((allBoard) => {
        const sourceBoard = [...allBoard[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoard[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoard,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

```

<br>

마지막으로 Task를 추가하기 위해 Board.tsx을 수정해준다.

```
// useSetRecoilState로 toDoState를 import한다.
const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {

    // id는 만들어진 시간으로 text는 toDo로 만든다.
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    // 이전 Board들을 가져온 후
    setToDos((allBoards) => {
      return {
        ...allBoards,
        // 객체가 key : value의 형태이기 때문에 아래와 같이 쓴다.
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");

```

<br>
<br>
<br>
<br>

### 220510

<br>
부가적으로 두 가지를 추가해봤다.
<br>
첫번째는 localStorage 저장이고, 두번째는 Draggable 삭제 기능이다.
<br>
<br>

처음 localStorage 저장은 저번에도 한번 다뤘던 적이 있는데 recoil-persist를 사용하는 방법니다.
<br>
atom.tsx 파일에 recoil-persist에서 제공하는 예시를 보고 따라서 입력했다.

```
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

...

// 기본 storage는 localStorage로 되어 있다.
const { persistAtom } = recoilPersist({
  key: "toDos",
});

export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});

```

두번째는 Draggable 삭제인데 Board가 아닌 곳으로 ToDo를 끌어당기면 삭제하도록 만들었다.
<br>
간단하게 ToDo를 끌어다 바깥 영역으로 잡아 당겨 destination.droppableId를 확인해보니 undefined가 나오는걸 console.log로 확인했다.
<br>
이후 if문을 활용하여 ToDo가 undefined 영역으로 갈때 해당 ToDo를 splice로 제거하면 끝이다.

```
if (destination?.droppableId === undefined) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        sourceBoard.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        };
      });
    }
```

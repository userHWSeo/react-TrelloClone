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

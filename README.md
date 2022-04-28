# React Master Class

### 노마드코더 강의 내용 정리 및 복습을 위한 README 입니다.

<br>
<br>
<br>
<br>

### 220428

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

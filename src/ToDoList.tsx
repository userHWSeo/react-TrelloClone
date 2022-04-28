import { useState } from "react";
import {useForm} from "react-hook-form";

/* function ToDoList() {
  const [toDo, setToDo] = useState("");
  const [toDoError, setToDoError] = useState("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setToDoError("");
    setToDo(value);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(toDo);
    if (toDo.length < 10) {
      return setToDoError("To do should be longer");
    }
    console.log("submit");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={toDo} placeholder="Write a to do" />
        <button>Add</button>
        {toDoError !== "" ? toDoError : null}
      </form>
    </div>
  );
} */

interface IForm {
    email: string,
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    password1: string,
}

function ToDoList() {
    const {register, handleSubmit, formState:{errors}} = useForm<IForm>({defaultValues: {email: "@naver.com"}});
    const onValid = (data: any) => {
        console.log(data);
    };
    return (
        <div>
            <form onSubmit={handleSubmit(onValid)}>
                <input {...register("email", {required: "Email Required", pattern: {value: /^[A-Za-z0-9._%+-]+@naver.com$/, message: "Only naver.com emails allowed"}})} placeholder="Email" />
                <span>
                    {errors?.emails?.message}
                </span>
                <input {...register("firstName", {required: "Write here !", })} placeholder="First Name" />
                <span>
                    {errors?.firstname?.message}
                </span>
                <input {...register("lastName", {required: "Write here !"})} placeholder="Last Name" />
                <span>
                    {errors?.lastName?.message}
                </span>
                <input {...register("userName", {required: "Write here !", minLength: {value: 5, message: "To Shorts"}})} placeholder="User Name" />
                <span>
                    {errors?.username?.message}
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

export default ToDoList;
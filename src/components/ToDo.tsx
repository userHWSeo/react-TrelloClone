import { useSetRecoilState } from "recoil";
import { IToDo, toDoState, Categories } from "../atoms";

function ToDo({ text, category, id }: IToDo) {
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    setToDos((oldToDos: any) => {
      const targetIndex = oldToDos.findIndex((toDo: any) => toDo.id === id);
      const newToDo = { text, id, category: name as any };
      return [
        ...oldToDos.slice(0, targetIndex),
        newToDo,
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };
  const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    setToDos((oldToDos: any) => {
      const targetIndex = oldToDos.findIndex((toDo: any) => toDo.id === id);
      return [
        ...oldToDos.slice(0, targetIndex),
        ...oldToDos.slice(targetIndex + 1),
      ];
    });
  };
  return (
    <li>
      <span>{text}</span>
      {category !== Categories.DOING && (
        <button name={Categories.DOING + ""} onClick={onClick}>
          Doing
        </button>
      )}
      {category !== Categories.TO_DO && (
        <button name={Categories.TO_DO + ""} onClick={onClick}>
          To Do
        </button>
      )}
      {category !== Categories.DONE && (
        <button name={Categories.DONE + ""} onClick={onClick}>
          Done
        </button>
      )}
      {category !== Categories.DELETE && (
        <button name={Categories.DELETE + ""} onClick={onDelete}>
          DELETE
        </button>
      )}
    </li>
  );
}

export default ToDo;

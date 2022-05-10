import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

interface IToDoState {
  [key: string]: ITodo[];
}

export interface ITodo {
  id: number;
  text: string;
}

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

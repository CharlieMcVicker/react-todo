import firebase from "firebase";
import React, { ReactElement } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { WithId, TodoData } from "./types";
import { TodoCreator } from "./TodoCreator";
import { TodoList } from "./TodoList";
import { scroller } from "react-scroll";

const StyledLoading = styled.p`
  text-align: center;
`;

function TodosLoading() {
  return <StyledLoading>Loading your todos...</StyledLoading>;
}

const TodoListWrapper = styled.div`
  padding: 10px;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

const StyledTodosView = styled.main`
  display: grid;
  width: 100%;
  grid-template-rows: auto 1fr auto;
  min-height: 100%;
  max-height: 100%;
`;

export function TodosView(): ReactElement {
  const [user] = useAuthState(firebase.auth());
  const path = `users/${user.uid}/todos`;
  const todosCollection = firebase
    .firestore()
    .collection(path) as firebase.firestore.CollectionReference<TodoData>;
  const [todos, loading] = useCollectionData<WithId<TodoData>>(
    todosCollection.orderBy("dueDate", "desc"),
    {
      idField: "id",
    }
  );

  function scroll() {
    scroller.scrollTo("today", {
      containerId: "todo-list-wrapper",
      duration: 100,

      smooth: true,
      offset: -10,
    });
  }

  return (
    <StyledTodosView>
      <h1 onClick={scroll}>Your Todos</h1>
      <TodoListWrapper id="todo-list-wrapper">
        {(loading || !todos) && <TodosLoading />}
        {todos && <TodoList collection={todosCollection} todos={todos} />}
      </TodoListWrapper>
      <TodoCreator collection={todosCollection} />
    </StyledTodosView>
  );
}

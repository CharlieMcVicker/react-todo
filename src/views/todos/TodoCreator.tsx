import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import styled, { css } from "styled-components";
import firebase from "firebase";
import { TodoData } from "./types";

const StyledTodoCreator = styled.form`
  max-width: 900px;
  margin: auto;
  text-align: center;
  display: flex;
  input,
  button {
    height: 40px;
    border: none;
    outline: none;
    font-size: 18px;
    flex: 1;
  }
  button {
    flex: 0 auto;
    padding: 0 10px;
  }
`;

const TodoCreatorWrapper = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  padding: 10px;
`;

export function TodoCreator({
  collection,
}: {
  collection: firebase.firestore.CollectionReference<TodoData>;
}) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function createTodo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inputRef.current) inputRef.current.value = "";
    collection.add({
      dueDate: firebase.firestore.Timestamp.now(),
      title,
      details: "",
      complete: false,
    });
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  return (
    <TodoCreatorWrapper>
      <StyledTodoCreator onSubmit={createTodo}>
        <input
          type="text"
          placeholder="A short description or title..."
          onChange={onChange}
          ref={inputRef}
        />
        <button>Create new todo for today</button>
      </StyledTodoCreator>
    </TodoCreatorWrapper>
  );
}

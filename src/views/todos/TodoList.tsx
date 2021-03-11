import firebase from "firebase";
import React, { ReactElement, ReactNode } from "react";
import styled, { css } from "styled-components";
import { WithId, TodoData } from "./types";
import Scroll, { ScrollElement } from "react-scroll";

const MILLIS_IN_DAY = 86400000;
const trunc_day = (millis: number) => millis - (millis % MILLIS_IN_DAY);

const COLORS = {
  complete: "#81C784",
  overdue: "#ef5350",
  doneInPast: "#BDBDBD",
  dueSoon: "#FFCA28",
};

const TodoCard = styled.div<{ background?: string }>`
  padding: 5px;
  width: 100%;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "controls"
    "content";
  ${(p) =>
    p.background
      ? css`
          background-color: ${p.background};
        `
      : ""}
`;

const TodoCardContent = styled.div`
  grid-area: content;
`;

const TodoCardControls = styled.div`
  grid-area: controls;
`;

const TodoControl = styled.button`
  width: auto;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 5px;
  outline: none;
  margin: 10px 5px;
  font-size: 24px;
  width: 45px;
  height: 45px;
`;

function Todo({
  data,
  moveUp,
  moveDown,
  toggleComplete,
  del,
}: {
  data: WithId<TodoData>;
  moveUp: () => void;
  moveDown: () => void;
  toggleComplete: () => void;
  del: () => void;
}) {
  const past = trunc_day(data.dueDate.toMillis()) < trunc_day(Date.now());
  const today = trunc_day(data.dueDate.toMillis()) == trunc_day(Date.now());
  let background = undefined;
  if (past) {
    if (data.complete) {
      background = COLORS.doneInPast;
    } else {
      background = COLORS.overdue;
    }
  } else {
    if (data.complete) {
      background = COLORS.complete;
    } else if (today) {
      background = COLORS.dueSoon;
    }
  }
  return (
    <TodoCard background={background}>
      <TodoCardControls>
        <TodoControl onClick={moveUp}>⬆️</TodoControl>
        <TodoControl onClick={moveDown}>⬇️</TodoControl>
        <TodoControl onClick={toggleComplete}>
          {data.complete ? "✅" : "☑️"}
        </TodoControl>
        <TodoControl onClick={del}>🗑</TodoControl>
      </TodoCardControls>
      <TodoCardContent>
        <h3>
          {data.title} -{" "}
          {data.dueDate && data.dueDate.toDate().toLocaleDateString()}
        </h3>
        <p>{data.details}</p>
      </TodoCardContent>
    </TodoCard>
  );
}

export function TodoList({
  collection,
  todos,
}: {
  collection: firebase.firestore.CollectionReference;
  todos: WithId<TodoData>[];
}) {
  const today = new Date(trunc_day(Date.now())).toISOString();
  const days: string[] = [];
  const bins: { [day: string]: WithId<TodoData>[] } = {};
  todos.forEach((todo, i) => {
    // truncate to day
    const day = new Date(trunc_day(todo.dueDate.toMillis())).toISOString();
    if (day in bins) {
      bins[day].unshift(todo);
    } else {
      bins[day] = [todo];
      days.push(day);
    }
  });

  function moveUp(bin: WithId<TodoData>[], idx: number) {
    return () => {
      let newDueDate;
      const todo = bin[idx];
      if (bin[idx - 1]) {
        console.log("found somebody above us");
        const millis = bin[idx - 1].dueDate.toMillis();
        newDueDate = firebase.firestore.Timestamp.fromMillis(millis - 1);
      } else {
        newDueDate = firebase.firestore.Timestamp.fromMillis(
          todo.dueDate.toMillis() - MILLIS_IN_DAY
        );
      }
      console.log(
        "up",
        todo.dueDate.toMillis() - MILLIS_IN_DAY - newDueDate.toMillis()
      );
      collection.doc(todo.id).update({
        dueDate: newDueDate,
      });
    };
  }
  function moveDown(bin: WithId<TodoData>[], idx: number) {
    return () => {
      let newDueDate;
      const todo = bin[idx];
      if (bin[idx + 1]) {
        const millis = bin[idx + 1].dueDate.toMillis();
        newDueDate = firebase.firestore.Timestamp.fromMillis(millis + 1);
      } else {
        newDueDate = firebase.firestore.Timestamp.fromMillis(
          todo.dueDate.toMillis() + MILLIS_IN_DAY
        );
      }
      console.log("down", todo.dueDate, newDueDate);
      collection.doc(todo.id).update({
        dueDate: newDueDate,
      });
    };
  }

  function toggleComplete(todo: WithId<TodoData>) {
    return () =>
      collection.doc(todo.id).update({
        complete: !todo.complete,
      });
  }

  function del(todo: WithId<TodoData>) {
    return () => {
      collection.doc(todo.id).delete();
    };
  }

  return (
    <>
      {days.sort().map((day, i) => (
        <DayWrapper key={i}>
          <DayHeading today={today === day}>
            {bins[day][0].dueDate.toDate().toDateString()}
          </DayHeading>
          <DayTodosWrapper>
            {bins[day].map((todo, i, arr) => (
              <Todo
                key={i}
                data={todo}
                del={del(todo)}
                moveUp={moveUp(arr, i)}
                moveDown={moveDown(arr, i)}
                toggleComplete={toggleComplete(todo)}
              />
            ))}
          </DayTodosWrapper>
        </DayWrapper>
      ))}
    </>
  );
}

function DayHeading({
  today,
  children,
}: {
  today: boolean;
  children: ReactNode;
}): ReactElement {
  if (today) {
    const Cmp = ScrollElement(StyledHeading);
    return (
      <Cmp today={today} name="today">
        {children} - Today
      </Cmp>
    );
  } else {
    return <StyledHeading today={today}>{children}</StyledHeading>;
  }
}

const StyledHeading = styled.h2<{ today: boolean }>`
  ${(p) =>
    p.today &&
    css`
      color: blue;
    `}
`;

const DayWrapper = styled.div`
  max-width: 900px;
  margin: auto;
`;

const DayTodosWrapper = styled.div`
  max-width: 600px;
  margin: auto;
`;

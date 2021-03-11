import styled from "styled-components";
import React from "react";
import { OverdueTodoList } from "./OverdueTodoList";

export function OverdueView() {
  return (
    <StyledOverdueView>
      <h1>Overdue stuff</h1>
      <OverdueTodoList />
    </StyledOverdueView>
  );
}

const StyledOverdueView = styled.main`
  display: grid;
  width: 100%;
  grid-template-rows: auto 1fr auto;
  min-height: 100%;
  max-height: 100%;
`;

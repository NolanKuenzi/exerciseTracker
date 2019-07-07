import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ExerciseLog from '../containers/exerciseLog';
import { StoreProvider } from '../store';

afterEach(cleanup);

const RenderComponent = () => {
  return render(
    <StoreProvider>
      <ExerciseLog />
    </StoreProvider>,
  );
};

describe('<ExerciseLog /> component', () => {
  test('It contains the GET route information, several input boxes, and a button', () => {
    const { getByTestId } = RenderComponent();
    const eLogTest = getByTestId('eLogTest');
    expect(eLogTest.textContent).toContain('GET /api/exercise/log?{userId}[&from][&to][&limit]');
    expect(eLogTest.textContent).toContain('Submit');
  });
});

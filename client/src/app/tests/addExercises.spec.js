import React from 'react';
import { render, cleanup } from '@testing-library/react';
import AddExercises from '../containers/addExercises';
import { StoreProvider } from '../store';

afterEach(cleanup);

const RenderComponent = () => {
  return render(
    <StoreProvider>
      <AddExercises />
    </StoreProvider>,
  );
};

describe('<AddExercises  /> component', () => {
  test('It contains a POST route, several input boxes, and a button', () => {
    const { getByTestId } = RenderComponent();
    const addExercisesTest = getByTestId('addExercisesTest');
    expect(addExercisesTest.textContent).toContain('POST /api/exercise/add');
    expect(addExercisesTest.textContent).toContain('Submit');
  });
});

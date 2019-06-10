import React from 'react';
import { render, cleanup } from 'react-testing-library';
import AddExercises from './addExercises';

afterEach(cleanup);

const RenderComponet = () => {
  return render(<AddExercises />);
};

describe('<AddExercises component', () => {
  test('It contains a POST route, several input boxes, and a button', () => {
    const { getByTestId } = RenderComponet();
    const addExercisesTest = getByTestId('addExercisesTest');
    const innerSpanTest = getByTestId('innerSpanTest');
    const userIdInput = getByTestId('userIdInput');
    const descriptionInput = getByTestId('descriptionInput');
    const durationInput = getByTestId('durationInput');
    const dataInput = getByTestId('dataInput');
    expect(addExercisesTest.textContent).toContain('POST /api/exercise/add');
    expect(innerSpanTest.textContent).toContain('POST /api/exercise/add');
    expect(userIdInput.textContent).toContain('');
    expect(descriptionInput.textContent).toContain('');
    expect(durationInput.textContent).toContain('');
    expect(dataInput.textContent).toContain('');
    expect(addExercisesTest.textContent).toContain('Submit');
  });
});

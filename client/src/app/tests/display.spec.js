/* Integration Testing */
import React from 'react';
import { render, cleanup, fireEvent, wait } from '@testing-library/react';
import regeneratorRuntime, { async } from 'regenerator-runtime';
import ExerciseTracker from '../components/exerciseTracker';
import { StoreProvider } from '../store';

afterEach(cleanup);
jest.mock('axios');

const RenderComponent = () => {
  return render(
    <StoreProvider>
      <ExerciseTracker />
    </StoreProvider>,
  );
};

describe('<ExerciseTracker /> component', () => {
  test("The <Display /> component displays data from the <NewUser /> component's axios.post response", async () => {
    const { container } = RenderComponent();
    const newUserSubmit = container.querySelector('[id="newUserSubmit"]');
    fireEvent.click(newUserSubmit);
    const displayDiv = container.querySelector('[id="displayDiv"]');
    await wait(() => {
      expect(displayDiv.textContent).toContain('90dG8Oo48');
      expect(displayDiv.textContent).toContain('Kyle');
    });
  });
  test("The <Display /> component displays data from the <AddExercises /> component's axios.post response", async () => {
    const { container } = RenderComponent();
    const addExercisesSubmit = container.querySelector('[id="addExercisesSubmit"]');
    fireEvent.click(addExercisesSubmit);
    const displayDiv = container.querySelector('[id="displayDiv"]');
    await wait(() => {
      expect(displayDiv.textContent).toContain('90dG8Oo48');
      expect(displayDiv.textContent).toContain('Kyle');
      expect(displayDiv.textContent).toContain('running');
      expect(displayDiv.textContent).toContain('45');
      expect(displayDiv.textContent).toContain('2019-06-25');
    });
  });
  test("The <Display /> component displays data from the <ExerciseLog /> component's axios.get response", async () => {
    const { container } = RenderComponent();
    const eLogBtn = container.querySelector('[id="eLogBtn"]');
    fireEvent.click(eLogBtn);
    const displayDiv = container.querySelector('[id="displayDiv"]');
    await wait(() => {
      expect(displayDiv.textContent).toContain('Kyle');
      expect(displayDiv.textContent).toContain('jump rope');
      expect(displayDiv.textContent).toContain('35');
      expect(displayDiv.textContent).toContain('2019-06-26');
      expect(displayDiv.textContent).toContain('pushups');
      expect(displayDiv.textContent).toContain('30');
      expect(displayDiv.textContent).toContain('2019-06-27');
    });
  });
  test("The <Display /> component displays updated data from the <ExerciseLog /> component's axios.delete response", async () => {
    const { container } = RenderComponent();
    const eLogBtn = container.querySelector('[id="eLogBtn"]');
    fireEvent.click(eLogBtn);
    const displayDiv = container.querySelector('[id="displayDiv"]');
    await wait(async () => {
      expect(displayDiv.textContent).toContain('Kyle');
      expect(displayDiv.textContent).toContain('jump rope');
      expect(displayDiv.textContent).toContain('35');
      expect(displayDiv.textContent).toContain('2019-06-26');
      expect(displayDiv.textContent).toContain('pushups');
      expect(displayDiv.textContent).toContain('30');
      expect(displayDiv.textContent).toContain('2019-06-27');
      const getDelBtn = container.querySelector('[id="m0dekgo33"]');
      fireEvent.click(getDelBtn);
      await wait(async () => {
        expect(displayDiv.textContent).toContain('Kyle');
        expect(displayDiv.textContent).not.toContain('jump rope');
        expect(displayDiv.textContent).not.toContain('35');
        expect(displayDiv.textContent).not.toContain('2019-06-26');
        expect(displayDiv.textContent).toContain('pushups');
        expect(displayDiv.textContent).toContain('30');
        expect(displayDiv.textContent).toContain('2019-06-27');
      });
    });
  });
});

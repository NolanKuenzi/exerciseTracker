import React from 'react';
import { render, cleanup } from 'react-testing-library';
import NewUser from './newUser';

afterEach(cleanup);

const RenderComponent = () => {
  return render(<NewUser />);
};

describe('New User Component', () => {
  test('It contains a POST route, input box, and a button', () => {
    const { getByTestId } = RenderComponent();
    const userContainerTest = getByTestId('userContainerTest');
    const userNameInput = getByTestId('userNameInputTest');
    expect(userContainerTest.textContent).toContain('POST /api/exercise/new-user');
    expect(userNameInput.textContent).toBe('');
    expect(userContainerTest.textContent).toContain('Submit');
  });
});

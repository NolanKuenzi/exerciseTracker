import React from 'react';
import { render, cleanup } from '@testing-library/react';
import NewUser from '../containers/newUser';
import { StoreProvider } from '../store';

afterEach(cleanup);

const RenderComponent = () => {
  return render(
    <StoreProvider>
      <NewUser />
    </StoreProvider>,
  );
};

describe('<NewUser /> Component', () => {
  test('It contains a POST route, input box, and a button', () => {
    const { getByTestId } = RenderComponent();
    const userContainerTest = getByTestId('userContainerTest');
    expect(userContainerTest.textContent).toContain('POST /api/exercise/new-user');
    expect(userContainerTest.textContent).toContain('Submit');
  });
});

import * as React from 'react';
import { Main } from './Main';
import { mount } from 'enzyme';

describe('<Main />', () => {
  it('renders and matches snappy', () => {
    const props = {
      dictionary: {
        selectedLanguage: 'ru' as 'ru',
        dictionary: null
      },
      getDictionary: (value: 'ru') => jest.fn().mockImplementation()
    };
    const wrapper = mount(<Main {...props} />);
    expect(wrapper.find('.main')).toMatchSnapshot();
  });
});

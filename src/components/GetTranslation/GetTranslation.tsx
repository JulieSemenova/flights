import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState, IDictionary } from '../../types';

interface OwnProps {
  dictionary: IDictionary.State['dictionary'];
}

interface IProps extends OwnProps {
  word: string;
}

const GetTranslation: React.StatelessComponent<IProps> = ({
  dictionary,
  word
}: IProps) => (
  <span style={{ textTransform: 'capitalize' }}>
    {dictionary && dictionary[word] ? dictionary[word] : word}
  </span>
);

export default connect((state: ReduxState) => ({
  dictionary: state.dictionary.dictionary
}))(GetTranslation);

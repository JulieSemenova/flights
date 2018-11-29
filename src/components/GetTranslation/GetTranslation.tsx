import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState, ILanguage } from '../../types';

interface OwnProps {
  dictionary: ILanguage.State['dictionary'];
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
  dictionary: state.language.dictionary
}))(GetTranslation);

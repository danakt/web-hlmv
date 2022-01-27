import * as React from 'react';
import { INITIAL_UI_BACKGROUND } from '../const/constants';

const LOCAL_STORAGE_KEY = '__hlmv_background_color';

type Data = {
  backgroundColor: string;
};

type Actions = {
  setBackgroundColor: (color: string) => void;
};

type Props = {
  children: (data: Data, actions: Actions) => React.ReactNode;
};

/**
 * Background color container
 */
export const BackgroundContainer = (props: Props) => {
  const [color, setColor] = React.useState(() => localStorage.getItem(LOCAL_STORAGE_KEY) || INITIAL_UI_BACKGROUND);

  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, color);
  }, [color]);

  return (
    <React.Fragment>{props.children({ backgroundColor: color }, { setBackgroundColor: setColor })}</React.Fragment>
  );
};

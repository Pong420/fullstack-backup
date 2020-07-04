import { Intent, ITagProps } from '@blueprintjs/core';
import { ReactNode } from 'react';

const INTENTS = [
  Intent.NONE,
  Intent.PRIMARY,
  Intent.SUCCESS,
  Intent.DANGER,
  Intent.WARNING
];

export const getTagProps: (node: ReactNode, index: number) => ITagProps = (
  _,
  index
) => ({
  icon: 'tag',
  minimal: true,
  intent: INTENTS[index % INTENTS.length]
});

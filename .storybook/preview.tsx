import type { Preview } from '@storybook/react';
import Providers from '../app/providers';

const preview: Preview = {
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
};

export default preview;

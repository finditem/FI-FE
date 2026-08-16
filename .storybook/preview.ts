import type { Preview } from "@storybook/nextjs";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import "../src/app/globals.css";
import koMessages from "../src/messages/ko.json";

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        NextIntlClientProvider,
        { locale: "ko", messages: koMessages },
        React.createElement(Story)
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;

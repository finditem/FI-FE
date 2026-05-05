import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { Suspense, useEffect } from "react";
import { ToastProvider } from "@/providers/ToastProviders";
import { usePermissionStore } from "@/store";
import BottomSheet from "./BottomSheet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const ResetPermissionFlag = () => {
  useEffect(() => {
    return () => {
      usePermissionStore.setState({ isFirstSignUp: false });
    };
  }, []);
  return null;
};

const FirstSignUpDecorator = (Story: ComponentType) => {
  usePermissionStore.setState({ isFirstSignUp: true });
  return (
    <>
      <ResetPermissionFlag />
      <Story />
    </>
  );
};

const meta: Meta<typeof BottomSheet> = {
  title: "페이지/메인 페이지/BottomSheet",
  component: BottomSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        searchParams: {},
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="relative h-[100dvh] w-full max-w-[768px] bg-neutral-100">
            <Suspense fallback={<div className="p-4 text-body2-medium">로딩…</div>}>
              <Story />
            </Suspense>
          </div>
        </ToastProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

export const Default: Story = {};

export const FirstSignUpFlow: Story = {
  decorators: [FirstSignUpDecorator],
};

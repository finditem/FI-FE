import type { Meta, StoryObj } from "@storybook/nextjs";
import PermissionSheet, { LocationPermissionBottomSheet } from "./PermissionBottomSheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/ToastProviders";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof PermissionSheet> = {
  title: "페이지/메인 페이지/PermissionBottomSheet",
  component: PermissionSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof PermissionSheet>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="w-[390px]">
            <PermissionSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    );
  },
};

export const LocationPermission: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="w-[390px]">
            <LocationPermissionBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </div>
        </ToastProvider>
      </QueryClientProvider>
    );
  },
};

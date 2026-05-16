import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import ManualList from "./ManualList";

jest.mock("next/link", () => {
  return ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

window.scrollTo = jest.fn();

jest.mock("@/components/common", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
  Button: ({ children }: any) => <button type="button">{children}</button>,
}));

jest.mock("@/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

jest.mock("../../_constants/MANUAL_CONSTANT", () => ({
  MANUAL_DATA: {
    lost: [
      {
        title: "신용카드를 분실하셨나요?",
        content: "카드사에 분실신고가 필요해요.",
      },
      {
        title: "경찰청 신고 내역을 확인했나요?",
        content: "lost112에서 확인해 보세요.",
        href: "https://www.lost112.go.kr/",
        btnText: "경찰청 바로가기",
      },
    ],
  },
}));

describe("ManualList", () => {
  const setup = async (initialOpenIndex: number | null = null) => {
    const user = userEvent.setup();

    const Wrapper = () => {
      const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);

      return (
        <ManualList openIndex={openIndex} setOpenIndex={setOpenIndex} selected={"lost" as any} />
      );
    };

    render(<Wrapper />);
    return { user };
  };

  test("초기에는 모든 아이템 패널이 닫혀 있다", async () => {
    await setup(null);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });

  test("아이템 클릭 시 해당 패널이 열리고, 다시 클릭하면 닫힌다", async () => {
    const { user } = await setup(null);

    const firstToggle = screen.getByRole("button", {
      name: /신용카드를 분실하셨나요?/,
    });

    await user.click(firstToggle);
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText("카드사에 분실신고가 필요해요.")).toBeInTheDocument();

    await user.click(firstToggle);
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
  });

  test("다른 아이템을 클릭하면 기존 패널이 닫히고 새 패널이 열린다(단일 오픈)", async () => {
    const { user } = await setup(null);

    const firstToggle = screen.getByRole("button", {
      name: /신용카드를 분실하셨나요?/,
    });
    const secondToggle = screen.getByRole("button", {
      name: /경찰청 신고 내역을 확인했나요?/,
    });

    await user.click(firstToggle);
    expect(await screen.findByText("카드사에 분실신고가 필요해요.")).toBeInTheDocument();

    await user.click(secondToggle);
    expect(await screen.findByText("lost112에서 확인해 보세요.")).toBeInTheDocument();

    expect(firstToggle).toHaveAttribute("aria-expanded", "false");
    expect(secondToggle).toHaveAttribute("aria-expanded", "true");
  });

  test("href/btnText가 있는 아이템은 패널 오픈 시 링크가 렌더링된다", async () => {
    const { user } = await setup(null);

    const secondToggle = screen.getByRole("button", {
      name: /경찰청 신고 내역을 확인했나요?/,
    });
    await user.click(secondToggle);

    const link = await screen.findByRole("link", {
      name: /경찰청 바로가기/,
    });

    expect(link).toHaveAttribute("href", "https://www.lost112.go.kr/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  test("initialOpenIndex가 주어지면 해당 아이템이 열린 상태로 렌더링된다", async () => {
    await setup(0);

    expect(await screen.findByText("카드사에 분실신고가 필요해요.")).toBeInTheDocument();

    const firstToggle = screen.getByRole("button", {
      name: /신용카드를 분실하셨나요?/,
    });
    expect(firstToggle).toHaveAttribute("aria-expanded", "true");
  });
});

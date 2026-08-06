import { ManualItemType, ManualKey } from "../_types/ManualType";

export const MANUAL_LIST = [
  {
    label: "분실",
    key: "LOST",
  },
  {
    label: "발견",
    key: "FOUND",
  },
  {
    label: "도난",
    key: "STOLEN",
  },
] as const;

type Manual = Record<ManualKey, ManualItemType[]>;

export const MANUAL_DATA: Manual = {
  LOST: [
    {
      title: "경찰청 신고 내역을 확인했나요?",
      content: (
        <>
          경찰청 유실물 종합 포털(https://www.lost112.go.kr/)을 통해 경찰청에서 보관 중인 유실물을
          확인해 보세요.
        </>
      ),
      href: "https://www.lost112.go.kr/",
      btnText: "경찰청 바로가기",
    },
    {
      title: "분실 게시글을 써보셨나요?",
      content: (
        <>'찾아줘'에 분실 게시물을 작성하면 물건을 습득한 분이 게시글을 통해 연락할 수 있어요.</>
      ),
      href: "https://www.finditem.kr/write/post?type=lost",
      btnText: "분실 게시글 쓰러가기",
    },
    {
      title: "경찰청 습득물 목록을 확인했나요?",
      content: (
        <>
          경찰청 유실물 종합 포털(https://www.lost112.go.kr/)을 통해 경찰청에서 보관 중인 유실물을
          확인해 보세요.
        </>
      ),
      href: "https://www.lost112.go.kr/",
      btnText: "경찰청 바로가기",
    },
    {
      title: "신용카드를 분실하셨나요?",
      content: (
        <>
          신용카드는 분실 시에는 해당 카드사에 분실신고를 해야해요. <br /> 여러장의 신용카드를 분실
          했을 경우, 신용카드 분실 일괄신고 서비스를 이용해 분실할 신용카드사 중 한 곳의 고객센터에
          신고하여 타사 카드까지 분실 등록이 가능해요. <br />
          <br /> 법인카드는 개인 명의로 발급되어 있다 해도 일괄 신고를 할 수 없어 별도로 분실신고를
          해야 해요.
        </>
      ),
    },
    {
      title: "신분증을 분실하셨나요?",
      content: (
        <>
          주민등록증의 경우 가까운 주민센터 직접 방문하거나, 민원24(www.minwon.go.kr)에 접속해
          온라인으로 분실 신고를 할 수 있어요. <br />
          <br /> 운전 면허증 분실 시에는 가까운 경찰서나 운전면허시험장에 방문해 분실 신고와 재발급
          신청을 할 수 있어요.
        </>
      ),
      href: "https://plus.gov.kr",
      btnText: "민원 24 바로가기",
    },
    {
      title: "핸드폰을 분실하셨나요?",
      content: (
        <>
          핸드폰 분실 시 통신사 고객센터(114)나 직영대리점, 통신사 홈페이지를 통해 분실신고와
          발신정지를 해야 해요. <br />
          <br /> 또한 핸드폰 찾기 콜센터(https://www.handphone.or.kr)에서 핸드폰 습득물을 조회할 수
          있어요.
        </>
      ),
      href: "https://www.handphone.or.kr",
      btnText: "핸드폰 습득물 보러가기",
    },
  ],
  FOUND: [
    {
      title: "경찰청 신고 내역을 확인했나요?",
      content: (
        <>
          경찰청 유실물 종합 포털(https://www.lost112.go.kr)에서 분실 신고가 접수된 유실물 목록을
          확인해 보세요.
        </>
      ),
      href: "https://www.lost112.go.kr",
      btnText: "경찰청 바로가기",
    },
    {
      title: "발견 게시글을 써보셨나요?",
      content: (
        <>
          ‘찾아줘'에 발견 게시물을 작성하면 물건을 분실한 분이 게시글을 통해 연락할 수 있어 분실물을
          찾는 데에 도움이 돼요.
        </>
      ),
      href: "https://www.finditem.kr/write/post?type=find",
      btnText: "발견 게시물 쓰러가기",
    },
    {
      title: "습득물 신고를 하셨나요?",
      content: (
        <>
          물건을 습득한 경우 경찰청 유실물 종합 포털(https://www.lost112.go.kr)이나 가까운 경찰서에
          방문하여 습득 신고를 할 수 있어요.
        </>
      ),
      href: "https://www.lost112.go.kr",
      btnText: "습득 신고 하러가기",
    },
  ],
  STOLEN: [
    {
      title: "경찰청 습득물 목록을 확인했나요?",
      content: (
        <>
          먼저 경찰청 유실물 종합 포털(https://www.lost112.go.kr)을 통해 경찰청에서 보관 중인
          유실물을 확인해 보세요.
        </>
      ),
      href: "https://www.lost112.go.kr",
      btnText: "경찰청 바로가기",
    },
    {
      title: "CCTV를 확인하고 싶으신가요?",
      content: (
        <>
          가까운 경찰서에 방문하여 분실 신고를 한 뒤, 분실 해당 장소 관리 주체에 직접 CCTV 열람
          요청을 해야 해요. <br />
          <br />
          공공 장소의 CCTV 열람이 필요한 경우 정보 공개 포털(https://www.open.go.kr)을 통해 정보
          공개 청구를 하여 CCTV 열람을 요청할 수 있어요.
        </>
      ),
      href: "https://www.open.go.kr",
      btnText: "정보 공개 포털 보러가기",
    },
  ],
} as const;

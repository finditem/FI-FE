#!/usr/bin/env bash
#
# 턴이 끝날 때, 이번 턴에서 드러난 작업 방식을 CLAUDE.local.md에 반영할 필요가 있는지
# Claude가 한 번 더 점검하게 하는 Stop 훅이다.
#
# 이 스크립트는 저장소에 공유되지만 기본으로 동작하지는 않는다. 쓰려는 사람이 각자
# .claude/settings.local.json(개인 파일, 커밋되지 않음)에 아래처럼 등록해야 한다.
#
#   {
#     "hooks": {
#       "Stop": [
#         {
#           "hooks": [
#             {
#               "type": "command",
#               "command": "\"$CLAUDE_PROJECT_DIR/.claude/hooks/check-claude-local.sh\"",
#               "timeout": 15
#             }
#           ]
#         }
#       ]
#     }
#   }
#
# 프로젝트 루트에 CLAUDE.local.md가 없으면 아무것도 하지 않고 종료하므로, 등록해두고
# 파일을 만들지 않은 사람에게는 영향이 없다.
#
# stop_hook_active가 true면 이미 이 훅 때문에 이어서 동작 중이므로 무한 루프를 막기 위해 종료한다.
set -uo pipefail

input=$(cat)
active=$(printf '%s' "$input" | jq -r '.stop_hook_active // false' 2>/dev/null) || exit 0
[ "$active" = "true" ] && exit 0

root=$(cd "$(dirname "$0")/../.." && pwd)
[ -f "$root/CLAUDE.local.md" ] || exit 0

jq -cn --arg path "$root/CLAUDE.local.md" '{
  decision: "block",
  reason: (
    "세션 마무리 점검입니다. 이번 턴에서 새로 드러난 작업 방식(사용자가 준 지시나 교정, 반복해서 확인된 컨벤션, 검증 절차, 자주 쓰는 명령, 이어받아야 할 진행 상황)이 " + $path + "에 아직 없다면 그 파일을 지금 갱신하십시오. "
    + "새로 기록할 내용이 없으면 파일을 열거나 수정하지 말고 한 문장으로만 답한 뒤 종료하십시오. "
    + "코드 변경, 커밋, 테스트 실행 등 다른 작업은 하지 마십시오."
  )
}'

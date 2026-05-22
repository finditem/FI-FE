import { InputSearch } from "@/components";

interface AdminSearchProps {
  placeholder?: string;
  defaultValue?: string;
  onEnter: (keyword: string) => void;
}

const AdminSearch = ({
  placeholder = "제목, 내용을 입력해 주세요.",
  defaultValue,
  onEnter,
}: AdminSearchProps) => {
  return (
    <div className="px-5 py-[10px]">
      <InputSearch
        placeholder={placeholder}
        defaultValue={defaultValue}
        name="search"
        mode="onChange"
        onEnter={onEnter}
      />
    </div>
  );
};

export default AdminSearch;

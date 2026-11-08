import { Icon } from "@/components";

const SearchLoading = () => {
  return (
    <div className="h-full flex-center" role="status">
      <Icon name="Loading" className="animate-spin" size={30} />
    </div>
  );
};

export default SearchLoading;

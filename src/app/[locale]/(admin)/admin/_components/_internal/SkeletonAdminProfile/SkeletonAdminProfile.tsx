const SkeletonAdminProfile = () => {
  return (
    <div className="flex items-center gap-6">
      <div className="skeleton-animation size-[60px] rounded-full" />
      <div className="flex flex-col gap-2">
        <div className="skeleton-animation h-5 w-[70px] rounded-full" />
        <div className="skeleton-animation h-4 w-[100px] rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonAdminProfile;

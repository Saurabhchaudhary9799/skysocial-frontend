export default function SidebarSkeleton() {
  return (
    <aside className="flex flex-col justify-between gap-8 bg-white p-5 lg:p-6 rounded-r-4xl animate-pulse h-screen">
      
      {/* Top */}
      <div className="space-y-8">
        
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-300" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-300 rounded" />
            <div className="h-2 w-20 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Nav Items */}
        <div className="space-y-3">
          <div className="h-10 w-full rounded-full bg-gray-300" />
          <div className="h-10 w-full rounded-full bg-gray-200" />
          <div className="h-10 w-full rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Bottom */}
      <div className="space-y-6">
        
        {/* New Post Button */}
        <div className="h-12 w-full rounded-full bg-gray-300" />

        {/* User Card */}
        <div className="flex items-center gap-3 rounded-2xl bg-gray-100 p-3">
          <div className="h-10 w-10 rounded-full bg-gray-300" />
          <div className="space-y-2 w-full">
            <div className="h-3 w-24 bg-gray-300 rounded" />
            <div className="h-2 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

    </aside>
  );
}
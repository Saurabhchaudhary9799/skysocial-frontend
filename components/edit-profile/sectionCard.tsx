export default function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-card rounded-2xl p-5 space-y-4 sunken-purple-shadow">
      <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
      {children}
    </div>
  );
}
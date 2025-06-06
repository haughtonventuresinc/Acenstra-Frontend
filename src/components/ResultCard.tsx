interface ResultCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export function ResultCard({ title, value, icon }: ResultCardProps) {
  return (
    <div className="result-card">
      <div className="flex justify-center mb-4 text-blue-600">{icon}</div>
      <h4 className="text-xl font-bold text-gray-900">{value}</h4>
      <p className="text-gray-600 mt-2">{title}</p>
    </div>
  );
}
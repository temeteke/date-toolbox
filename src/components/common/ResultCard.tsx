interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ResultCard({ title, children }: ResultCardProps) {
  return (
    <div className="result-card">
      <h3>{title}</h3>
      <div className="result-content">{children}</div>
    </div>
  );
}

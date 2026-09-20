type LibraryLoaderProps = {
  label?: string;
};

export function LibraryLoader({ label = "Syncing archive" }: LibraryLoaderProps) {
  const books = [
    { className: "book--a", style: { left: "8%", bottom: "18%", height: "38%", animationDelay: "0s" } },
    { className: "book--b", style: { left: "23%", bottom: "20%", height: "42%", animationDelay: "0.2s" } },
    { className: "book--c", style: { left: "40%", bottom: "17%", height: "46%", animationDelay: "0.4s" } },
    { className: "book--d", style: { left: "56%", bottom: "22%", height: "44%", animationDelay: "0.6s" } },
    { className: "book--e", style: { left: "70%", bottom: "19%", height: "40%", animationDelay: "0.8s" } },
  ];

  return (
    <div className="library-loader">
      <div className="library-loader__inner">
        <div className="library-loader__glow" />
        <div className="library-shelf library-shelf--back" />
        <div className="library-shelf library-shelf--front" />

        {books.map((book) => (
          <div
            key={book.className}
            className={`book ${book.className}`}
            style={{
              ...book.style,
              animationDelay: book.style.animationDelay,
            }}
          />
        ))}

        <div className="library-loader__stack">
          <span className="library-loader__stack-item library-loader__stack-item--cyan" />
          <span className="library-loader__stack-item library-loader__stack-item--violet" />
          <span className="library-loader__stack-item library-loader__stack-item--amber" />
        </div>
      </div>

      <div className="library-loader__status">
        <span className="library-loader__status-dot" />
        <span>{label}</span>
      </div>
    </div>
  );
}

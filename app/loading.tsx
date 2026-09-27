import { VeritasLoader } from "./components/veritas-loader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <VeritasLoader fullScreen={false} label="Loading" size="md" />
    </div>
  );
}

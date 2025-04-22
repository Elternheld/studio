import ActivityGenerator from '@/components/ActivityGenerator';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Willkommen zu <span className="text-primary">ElternHeld!</span>
        </h1>

        <p className="mt-3 text-2xl">
          Entdecke kreative Aktivitäten für deine Kinder.
        </p>
        <ActivityGenerator />
      </div>
    </main>
  );
}


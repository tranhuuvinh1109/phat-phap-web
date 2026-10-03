import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-8 text-slate-100">
      <div className="space-y-4 text-center">
        <h1 className="bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
          Hello World
        </h1>
        <p className="text-sm text-slate-400 sm:text-base">
          Phat Phap Web - Ready for vibe coding
        </p>
      </div>
    </main>
  );
};

export default Home;

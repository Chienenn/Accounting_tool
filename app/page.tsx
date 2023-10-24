import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="w-full h-20 bg-cyan-950 text-white flex items-center justify-center text-2xl font-bold">
        React 練習專案
      </h1>
      <p className="w-full h-60 bg-blue-200 text-gray-600 text-xl flex items-center justify-center ">
        歡迎光臨我的頁面
      </p>
      <Link href="/accounting">
        <Button variant="outline" className="mt-10">
          點此開始
        </Button>
      </Link>
    </div>
  );
};

export default Home;

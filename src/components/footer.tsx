"use client";
import { Progress } from "@material-tailwind/react";

export default function Footer() {
  return (
    <footer className="w-screen bg-whity mt-auto max-w-full">
      <div className="max-w-1340 px-5 py-10 mx-auto">
        <div className="flex justify-around">
          <div className="flex items-center">
            <Progress
              className="w-52 h-4 bg-beige mr-4"
              value={20}
              color="green"
            />
            <p className="text-gre text-lg"> 1/5 </p>
          </div>
          <div>
            <button type="button" className="bg-gre rounded-lg py-5 px-20 text-beige_lighter opacity-50">CONTINUE</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

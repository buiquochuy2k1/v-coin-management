import { PiggyBank } from 'lucide-react';
import React from 'react';

function Logo() {
  return (
    <a href="" className="flex items-center gap-2">
      <PiggyBank className="stroke h-11 w-11 stroke-red-500 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-red-400 to-yellow-500 bg-clip-text text-3xl font-bold leading-tight text-transparent tracking-tighter">
        V-Coin Management
      </p>
    </a>
  );
}

export function LogoMobile() {
  return (
    <a href="" className="flex items-center gap-2">
      <p className="bg-gradient-to-r from-red-400 to-yellow-500 bg-clip-text text-3xl font-bold leading-tight text-transparent tracking-tighter">
        V-Coin Management
      </p>
    </a>
  );
}

export default Logo;

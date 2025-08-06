"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Wallet, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function WalletConnect({ onConnected }: { onConnected?: () => void }) {
  const { isConnected } = useAccount();
  const hasConnected = useRef(false);
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && !hasConnected.current) {
      hasConnected.current = true;
      if (onConnected) onConnected();
      // for now just route to index, once imported the db will be route to their own user role
      setTimeout(() => router.push("/organizations/dashboard"), 2000);
    }
  }, [isConnected, onConnected, router]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={openConnectModal}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
        size="lg"
      >
        <Wallet className="h-5 w-5 mr-2" />
        Connect Wallet
        <Sparkles className="h-4 w-4 ml-2" />
      </Button>
    </motion.div>
  );
}
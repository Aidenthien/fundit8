"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Wallet, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WalletConnectDonor({ onConnected }: { onConnected?: () => void }) {
  const { address, isConnected } = useAccount();
  const hasConnected = useRef(false);
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWalletInDb = async () => {
      if (!address) return;

      try {
        setLoading(true);

        // Call API to get all donors
        const res = await fetch("/api/donors/get-donors");
        if (!res.ok) throw new Error("Failed to fetch donors");

        const donors = await res.json();

        // Check if wallet address exists in the donors list
        const existingDonor = donors.find(
          (donor: any) => donor.walletAddress.toLowerCase() === address.toLowerCase()
        );

        if (existingDonor) {
          console.log("Existing donor found:", existingDonor);
          router.push("/donors/dashboard");
        } else {
          console.log("New donor, redirecting to create profile");
          router.push("/create-profile");
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && !hasConnected.current) {
      hasConnected.current = true;
      checkWalletInDb();
      if (onConnected) onConnected();
    }
  }, [isConnected, address, onConnected, router]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={openConnectModal}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <Wallet className="h-5 w-5 mr-2" />
            Connect Wallet
            <Sparkles className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </motion.div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet, Shield, Users, Zap } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WalletConnect from "@/components/custom/connect-wallet";
import WalletConnectDonor from "@/components/custom/connect-wallet-donor";

// Animation variants for enhanced effects
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const float = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          variants={float}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          variants={float}
          animate="animate"
          style={{ animationDelay: "1s" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
          variants={pulse}
          animate="animate"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      {/* Back Button */}
      <motion.div
        className="absolute top-6 left-6 z-50"
        initial="hidden"
        animate="visible"
        variants={fadeInLeft}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Back button clicked");
            try {
              router.back();
            } catch (error) {
              console.log("Router back failed, trying push to home");
              router.push("/");
            }
          }}
          className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer hover:scale-105 transition-transform"
          style={{ pointerEvents: 'auto' }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Header Section */}
          <motion.div
            className="text-center mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-6"
              variants={pulse}
              animate="animate"
            >
              <Image
                src="/fundit8-single-logo.png"
                alt="FundIt Logo"
                width={64}
                height={64}
                className="object-contain"
              />
            </motion.div>

            <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Welcome to FundIt
            </h1>

            <p className="text-gray-300 text-lg mb-6">
              Connect your wallet to start your charitable journey
            </p>

            {/* Stats Badges */}
            <div className="flex justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                <Zap className="h-3 w-3 mr-1" />
                Fast
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                <Users className="h-3 w-3 mr-1" />
                Community
              </Badge>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-white text-xl font-semibold text-center">
                  Choose Your Role
                </CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  Select how you want to participate in the ecosystem
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs defaultValue="donor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                    <TabsTrigger
                      value="donor"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white transition-all duration-200"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Donor
                    </TabsTrigger>
                    <TabsTrigger
                      value="organization"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white transition-all duration-200"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Organization
                    </TabsTrigger>
                  </TabsList>

                  {/* Donor Tab */}
                  <TabsContent value="donor" className="space-y-6 mt-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">
                          Donor Access
                        </h3>
                        <p className="text-gray-300 text-sm mb-6">
                          Connect your wallet to donate and track your contributions
                        </p>
                      </div>
                      <WalletConnectDonor />
                    </div>

                    <div className="text-center pt-4 border-t border-white/10">
                      <p className="text-gray-300 text-sm">
                        New to FundIt? Connect your wallet to create your donor profile
                      </p>
                    </div>
                  </TabsContent>

                  {/* Organization Tab */}
                  <TabsContent value="organization" className="space-y-6 mt-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">
                          Organization Access
                        </h3>
                        <p className="text-gray-300 text-sm mb-6">
                          Connect your wallet to manage your organization and campaigns
                        </p>
                      </div>
                      <WalletConnect />
                    </div>

                    <div className="text-center pt-4 border-t border-white/10">
                      <p className="text-gray-300 text-sm">
                        Don't have an organization account?{" "}
                        <Link
                          href="/kyb-form"
                          className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition-colors"
                        >
                          Register your organization
                        </Link>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-400 text-sm">
              Powered by blockchain technology for transparency and trust
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
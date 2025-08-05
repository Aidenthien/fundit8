"use client";

import Link from "next/link";
import Image from "next/image";
// import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, BarChart3, Zap, User } from "lucide-react";
import { IconButton, Button, Typography } from "@material-tailwind/react";
import AboutCard from "@/components/about-card";
import React, { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/mockData";
import ChatBot from "@/components/chatbot";
import { Marquee } from "@/components/magicui/marquee";
import { AuroraText } from "@/components/magicui/aurora-text";
import TestimonialsCarousel from "@/components/Testimonial";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

// Helper function to format WEI to ETH with proper decimal display
function formatToEth(wei: number): string {
  // Convert wei to ETH (1 ETH = 10^18 wei)
  const ethValue = wei / 1000000000000000000;
  if (ethValue < 0.0001 && ethValue > 0) {
    // For tiny values, show up to 18 decimals but trim trailing zeros
    const fullDecimalStr = ethValue.toFixed(18).replace(/\.?0+$/, "");
    return fullDecimalStr + " ETH";
  }

  return (
    ethValue.toLocaleString("fullwide", {
      useGrouping: false,
      maximumFractionDigits: 4,
    }) + " ETH"
  );
}

const SPONSORS = [
  "coinbase",
  "spotify",
  "pinterest",
  "google",
  "amazon",
  "netflix",
];
const EVENT_INFO = [
  {
    title: "For Donors",
    description: (
      <ul className="space-y-2 text-left">
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Easy donation process via the platform</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Real-time tracking of donation impact</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>
            Transparency through blockchain (smart contracts, donation
            milestones)
          </span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>
            Donor recognition with NFT badges and leaderboard visibility
          </span>
        </li>
      </ul>
    ),
    subTitle: "Empower Your Giving",
  },
  {
    title: "For Organizations",
    description: (
      <ul className="space-y-2 text-left">
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Register and create donation campaigns</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Set milestones and track progress</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>
            Ensure funds are used as intended through automated fund
            distribution
          </span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Showcase progress to potential donors with transparency</span>
        </li>
      </ul>
    ),
    subTitle: "Amplify Your Impact",
  },
];

export default function Home() {
  const [topDonors, setTopDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await getLeaderboard();
        // Get only top 4 donors for the homepage preview
        setTopDonors(leaderboardData.slice(0, 4));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white">
      <div className="relative min-h-screen w-full bg-[url('/landing-page2-bg2.png')] bg-cover bg-no-repeat">
        {/* Hero Section */}
        <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
        <div className="grid min-h-screen px-8">
          <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
            <Typography
              variant="h4"
              color="white"
              className="mb-2"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Empowering Charitable @ FundIt8
            </Typography>
            <Typography
              variant="h1"
              color="white"
              className="lg:max-w-3xl"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Revolutionizing Charity Donations with Blockchain Transparency
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Join our mission to increase accountability, and efficiency in
              charitable giving through blockchain technology.
            </Typography>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="gradient"
                  color="white"
                  className="flex items-center group relative overflow-hidden"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <span className="relative z-10 flex items-center">
                    <AnimatedGradientText className="font-semibold">
                      Donate Now
                    </AnimatedGradientText>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link href="/kyb-form">
                <Button
                  variant="outlined"
                  className="rounded-full bg-white border-white text-black hover:bg-gray-50 transition-all duration-300 group"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <span className="relative z-10">
                    <AnimatedGradientText className="font-semibold">
                      Register Organization
                    </AnimatedGradientText>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Sponsored by */}
      <div>
        <section className="py-8 px-8 lg:py-20">
          <div className="container mx-auto text-center">
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-8"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              SPONSORED BY
            </Typography>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="relative overflow-hidden w-full">
                <div className="flex items-center gap-8 animate-marquee-infinite">
                  {SPONSORS.map((logo) => (
                    <Image
                      key={logo}
                      width={256}
                      height={256}
                      src={`/logos/logo-${logo}.svg`}
                      alt={logo}
                      className="w-40 flex-shrink-0"
                    />
                  ))}
                  {/* Duplicate for seamless loop */}
                  {SPONSORS.map((logo) => (
                    <Image
                      key={`duplicate-${logo}`}
                      width={256}
                      height={256}
                      src={`/logos/logo-${logo}.svg`}
                      alt={logo}
                      className="w-40 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="container mx-auto flex flex-col items-center px-4 py-14 md:py-14 lg:py-8">
        {/* Enhanced Gradient Heading with better responsive design */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 max-w-5xl mx-auto relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl rounded-full animate-pulse"></div>

          {/* Glowing orb effects */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-pink-500/30 rounded-full blur-2xl animate-bounce"></div>

          <div className="relative z-10">
            {/* Enhanced subtitle with Web3 styling */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <h2 className="text-sm md:text-base lg:text-lg font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text tracking-wide uppercase">
                About the platform
              </h2>
            </div>

            {/* Main heading with enhanced Web3 styling */}
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-cyan-400 text-transparent bg-clip-text leading-none tracking-tight mb-6 relative">
              <span className="relative">How It Works?</span>
            </h3>

            {/* Enhanced description with better typography */}
            <div className="mt-8 md:mt-10">
              <div className="relative">
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 font-medium leading-relaxed max-w-4xl mx-auto backdrop-blur-sm">
                  <AuroraText>
                    At Fundit8, we believe that charitable giving should be
                    transparent, secure, and impactful. That's why we're
                    building a platform that leverages blockchain technology to
                    ensure that your donations are used effectively and
                    efficiently.
                  </AuroraText>
                </p>

                {/* Decorative elements */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Cards Grid with better responsive layout */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12 lg:mb-16">
            {EVENT_INFO.map((props, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl bg-white/80 backdrop-blur-md shadow-xl border border-blue-200/30 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-300/50 hover:bg-white/90 transform hover:-translate-y-2"
              >
                {/* Enhanced gradient overlay on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-pink-50/60 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                {/* Animated background particles */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse"></div>
                </div>

                {/* Card content with enhanced spacing and responsive design */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center">
                  <div className="transform transition-transform duration-300 group-hover:scale-105">
                    <AboutCard {...props} />
                  </div>
                </div>

                {/* Corner accent elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
              </div>
            ))}
          </div>

          {/* Enhanced Community Card with gradient border */}
          <div className="w-full">
            <div className="relative rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-cyan-400 p-[3px] shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
              {/* Enhanced gradient border with animation */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-cyan-400 opacity-75 blur-sm animate-pulse"></div>

              <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center overflow-hidden">
                {/* Multi-layered animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50/20 via-blue-50/20 to-purple-50/20 animate-pulse delay-1000"></div>

                {/* Floating particles */}
                <div className="absolute top-4 left-6 w-3 h-3 bg-blue-400/40 rounded-full animate-bounce"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-purple-400/50 rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 left-10 w-2.5 h-2.5 bg-pink-400/40 rounded-full animate-bounce delay-500"></div>
                <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-pulse delay-1000"></div>

                {/* Card content with enhanced responsive design */}
                <div className="relative z-10 w-full max-w-3xl text-center">
                  <div className="transform transition-transform duration-300 hover:scale-105">
                    <AboutCard
                      title="Get to know us!"
                      subTitle="Community"
                      description="Learn more about our mission, vision, and values. We're excited to share our story with you!"
                    />
                  </div>
                </div>

                {/* Corner accent elements */}
                <div className="absolute top-4 right-4 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel />
      {/* Leaderboard Preview Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/top-contributor.png')" }}
        >
          <div className="absolute inset-0 bg-gray-900/80" />
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Typography
                variant="h3"
                color="white"
                className="mb-2"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Top Contributors
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="max-w-[900px] opacity-80"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Recognizing those who are making the biggest impact through
                their generous donations.
              </Typography>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 py-12">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="rounded-lg border bg-white/10 backdrop-blur-sm shadow-xl">
                <div className="p-6 border-b border-white/20">
                  <div className="grid grid-cols-3 gap-4 font-medium text-white">
                    <div>Rank</div>
                    <div>Donor</div>
                    <div className="text-center">Total Donated</div>
                  </div>
                </div>
                <div className="divide-y divide-white/20">
                  {topDonors.map((donor) => (
                    <div key={donor.rank} className="p-6">
                      <div className="grid grid-cols-3 gap-4 text-white">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-white font-bold">
                            {donor.rank}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {donor.avatar ? (
                            <Image
                              src={donor.avatar}
                              alt={donor.name || "Anonymous"}
                              width={36}
                              height={36}
                              className="rounded-full h-8 w-8 ring-2 ring-white/20"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 ring-2 ring-white/20">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <span>{donor.name}</span>
                        </div>
                        <div className="flex items-center justify-center font-medium font-mono">
                          {formatToEth(donor.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <Link href="/leaderboard">
                <Button
                  variant="text"
                  color="white"
                  className="flex items-center"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  View Full Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Floating ChatBot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBot />
      </div>
    </div>
  );
}

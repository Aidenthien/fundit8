"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Heart,
  BarChart3,
  Zap,
  Users,
  Globe,
  Clock,
  Target,
  Star,
  Sparkles,
} from "lucide-react";
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full bg-gradient-to-br from-black via-purple-950 to-blue-950 overflow-hidden">
        {/* Animated space background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/50 to-blue-950/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]"></div>
        </div>

        {/* Floating stars and cosmic elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-pink-500/20 rounded-full blur-2xl animate-pulse"></div>

        <div className="relative z-10 grid min-h-screen px-8">
          <div className="container my-auto mx-auto grid place-items-center text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <Typography
                  variant="h6"
                  color="white"
                  className="text-blue-300"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  About FundIt8
                </Typography>
              </div>

              {/* Main heading with cosmic glow */}
              <Typography
                variant="h1"
                color="white"
                className="lg:max-w-4xl text-6xl md:text-7xl lg:text-8xl font-black"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 text-transparent bg-clip-text">
                  Our Mission
                </span>
              </Typography>

              {/* Glowing text effect */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-200 to-purple-200 blur-2xl opacity-20 animate-pulse"></div> */}

              <Typography
                variant="lead"
                color="white"
                className="mt-8 mb-12 w-full md:max-w-full lg:max-w-3xl text-xl md:text-2xl opacity-90"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Fundit8 is dedicated to improving trust, transparency, and
                efficiency in charitable giving through secure blockchain
                technology and smart contracts.
              </Typography>

              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative w-full py-14 md:py-14 lg:py-14 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Cosmic background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          {/* Enhanced Header Section */}
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Star className="w-5 h-5 text-orange-400 animate-pulse" />
              <Typography
                variant="h6"
                className="text-orange-400 font-medium"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Our Journey
              </Typography>
            </div>
            <Typography
              variant="h2"
              className="text-center text-white text-5xl md:text-6xl lg:text-7xl font-black"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <span className="bg-gradient-to-r from-white via-orange-200 to-yellow-200 text-transparent bg-clip-text">
                Our Story
              </span>
            </Typography>
            <Typography
              className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              From blockchain enthusiasts to philanthropy advocates, discover
              how we're revolutionizing charitable giving
            </Typography>
          </div>

          <div className="space-y-16">
            {[
              {
                icon: Target,
                color: "blue",
                title: "The Challenge",
                subtitle: "The Problem We Identified",
                description:
                  "Our founders witnessed firsthand the challenges faced by both donors and charitable organizations: donors often lacked visibility into how their contributions were being used, while organizations struggled to build trust and demonstrate impact.",
                year: "2024",
                image: "/about-us.jpg",
              },
              {
                icon: Zap,
                color: "green",
                title: "The Solution",
                subtitle: "Our Blockchain Innovation",
                description:
                  "By leveraging blockchain technology, we've created a platform that provides unprecedented transparency, security, and efficiency in the donation process. Smart contracts ensure that funds are only released when predefined milestones are met.",
                year: "2025",
                image: "/about-us-2.png",
              },
              {
                icon: Globe,
                color: "purple",
                title: "Today",
                subtitle: "Global Impact",
                description:
                  "Fundit8 connects donors with verified organizations around the world, facilitating transparent giving and helping to address some of the world's most pressing challenges.",
                year: "2025+",
                image: "/about-us-3.png",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 z-5"></div>

                    <Image
                      src={item.image}
                      width={600}
                      height={400}
                      alt={`${item.title} - Fundit8's Journey`}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                      <div className="flex items-center justify-between mb-3">
                        <Typography
                          variant="h4"
                          color="white"
                          className="font-bold"
                          placeholder={null}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {item.title}
                        </Typography>
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                          <Typography
                            color="white"
                            className="font-bold text-sm"
                            placeholder={null}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {item.year}
                          </Typography>
                        </div>
                      </div>
                      <Typography
                        color="white"
                        className="opacity-90 text-lg font-medium"
                        placeholder={null}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {item.subtitle}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2">
                  <div className="group relative bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 h-full">
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                    {/* Enhanced content layout */}
                    <div className="relative z-10">
                      <div className="flex items-start mb-6">
                        <div
                          className={`bg-${item.color}-900/50 p-4 rounded-2xl mr-6 backdrop-blur-sm border border-${item.color}-500/30 shadow-lg`}
                        >
                          <item.icon
                            className={`h-10 w-10 text-${item.color}-400`}
                          />
                        </div>
                        <div className="flex-1">
                          <Typography
                            variant="h4"
                            color="white"
                            className="mb-2 font-bold"
                            placeholder={null}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            className="text-gray-300 text-lg leading-relaxed"
                            placeholder={null}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {item.description}
                          </Typography>
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div className="flex items-center mt-6">
                        <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 rounded-full transition-all duration-1000`}
                            style={{ width: `${(index + 1) * 33.33}%` }}
                          ></div>
                        </div>
                        <div className="ml-4 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                          <Typography
                            className="text-white text-sm font-medium"
                            placeholder={null}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            Step {index + 1}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="relative w-full py-14 md:py-14 lg:py-14 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Cosmic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          {/* Enhanced Header Section */}
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
              <Typography
                variant="h6"
                className="text-orange-400 font-medium"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                What Drives Us
              </Typography>
            </div>
            <Typography
              variant="h2"
              className="text-center text-white text-5xl md:text-6xl lg:text-7xl font-black"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <span className="bg-gradient-to-r from-white via-orange-200 to-yellow-200 text-transparent bg-clip-text">
                Our Values
              </span>
            </Typography>
            <Typography
              variant="lead"
              className="mt-4 lg:max-w-4xl mb-12 w-full text-center font-normal text-gray-300 text-xl"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              The core principles that guide our platform and mission
            </Typography>
          </div>

          {/* Restructured Values Layout */}
          <div className="space-y-16">
            {/* Core Values Row 1 */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Shield,
                  color: "blue",
                  title: "Transparency",
                  subtitle: "Complete Visibility",
                  description:
                    "We believe in complete transparency in the donation process. Blockchain technology allows us to provide an immutable record of all transactions and milestone completions.",
                  priority: "Core",
                },
                {
                  icon: Heart,
                  color: "red",
                  title: "Impact",
                  subtitle: "Maximum Effect",
                  description:
                    "We're committed to maximizing the impact of every donation. Our milestone-based funding approach ensures that resources are used effectively to achieve meaningful outcomes.",
                  priority: "Core",
                },
                {
                  icon: Users,
                  color: "purple",
                  title: "Community",
                  subtitle: "Global Network",
                  description:
                    "We foster a global community of donors and organizations united by a shared commitment to making a positive difference in the world.",
                  priority: "Core",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 hover:border-white/20"
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                  {/* Enhanced Header */}
                  <div className="relative p-8 md:p-10">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`bg-${value.color}-900/50 p-4 rounded-2xl backdrop-blur-sm border border-${value.color}-500/30 shadow-lg`}
                      >
                        <value.icon
                          className={`h-10 w-10 text-${value.color}-400`}
                        />
                      </div>
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <Typography
                          className="text-white text-xs font-medium"
                          placeholder={null}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {value.priority}
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Typography
                          variant="h4"
                          color="white"
                          className="mb-2 font-bold"
                          placeholder={null}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {value.title}
                        </Typography>
                        <Typography
                          className="text-gray-400 text-sm font-medium"
                          placeholder={null}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {value.subtitle}
                        </Typography>
                      </div>
                      <Typography
                        className="text-gray-300 leading-relaxed text-lg"
                        placeholder={null}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {value.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Supporting Values Row 2 */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: BarChart3,
                  color: "green",
                  title: "Accountability",
                  subtitle: "Trust & Reliability",
                  description:
                    "We hold ourselves and our partner organizations to the highest standards of accountability, ensuring that promises made to donors are kept.",
                  priority: "Supporting",
                },
                {
                  icon: Zap,
                  color: "yellow",
                  title: "Innovation",
                  subtitle: "Continuous Improvement",
                  description:
                    "We continuously explore new ways to leverage technology to improve the charitable giving experience and increase impact.",
                  priority: "Supporting",
                },
                {
                  icon: Globe,
                  color: "cyan",
                  title: "Global Reach",
                  subtitle: "Worldwide Impact",
                  description:
                    "We're committed to connecting donors with impactful organizations around the world, regardless of geographic boundaries.",
                  priority: "Supporting",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 hover:border-white/20"
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                  {/* Enhanced Header */}
                  <div className="relative p-8 md:p-10">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`bg-${value.color}-900/50 p-4 rounded-2xl backdrop-blur-sm border border-${value.color}-500/30 shadow-lg`}
                      >
                        <value.icon
                          className={`h-10 w-10 text-${value.color}-400`}
                        />
                      </div>
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <Typography
                          className="text-white text-xs font-medium"
                          placeholder={null}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {value.priority}
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Typography
                          variant="h4"
                          color="white"
                          className="mb-2 font-bold"
                          placeholder={null}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {value.title}
                        </Typography>
                        <Typography
                          className="text-gray-400 text-sm font-medium"
                          placeholder={null}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {value.subtitle}
                        </Typography>
                      </div>
                      <Typography
                        className="text-gray-300 leading-relaxed text-lg"
                        placeholder={null}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {value.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Values Summary */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 px-8 py-6 rounded-3xl bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <Typography
                  className="text-white text-lg font-medium"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  These values guide every decision we make and every feature we
                  build
                </Typography>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="relative w-full py-14 md:py-14 lg:py-14 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Cosmic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Users className="w-4 h-4 text-orange-400 animate-pulse" />
              <Typography
                variant="h6"
                className="text-orange-400"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                The People Behind DeNate
              </Typography>
            </div>
            <Typography
              variant="h2"
              className="text-center text-white text-4xl md:text-5xl lg:text-6xl font-bold"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <span className="bg-gradient-to-r from-white via-orange-200 to-yellow-200 text-transparent bg-clip-text">
                Our Team
              </span>
            </Typography>
            <Typography
              variant="lead"
              className="mt-4 lg:max-w-4xl mb-12 w-full text-center font-normal text-gray-300 text-xl"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Meet the passionate individuals behind DeNate
            </Typography>
          </div>

          <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Aiden Thien",
                role: "Co-Founder & CEO",
                image: "/aiden-notion.png",
              },
              {
                name: "John Paulose",
                role: "CTO of FundIt8",
                image: "/john-notion.png",
              },
              {
                name: "Choo Choo",
                role: "Head of Partnerships",
                image: "/choo-notion.png",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden text-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 hover:border-white/20"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                <CardHeader
                  floated={false}
                  className="h-72 flex items-center justify-center bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <div className="relative overflow-hidden rounded-full border-4 border-white/20 shadow-2xl group-hover:border-white/40 transition-all duration-500">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={180}
                      height={180}
                      className="aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Glowing effect around image */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  </div>
                </CardHeader>
                <CardBody
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  <Typography
                    variant="h5"
                    color="white"
                    className="mb-2 font-bold"
                    placeholder={null}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    className="text-gray-400 font-medium text-lg"
                    placeholder={null}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {member.role}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Mission Section*/}
      <section className="relative w-full py-24 md:py-32 lg:py-40 bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-indigo-900/30"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <Typography
              variant="h2"
              color="white"
              className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 text-transparent bg-clip-text">
                Join Our Mission
              </span>
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mt-4 mb-12 w-full md:max-w-full lg:max-w-3xl opacity-90 text-xl md:text-2xl"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Whether you're looking to donate or register your organization,
              we're here to help you make a difference.
            </Typography>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/donate">
                <Button
                  className="flex items-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-105"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Donate Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/kyb-form">
                <Button
                  variant="outlined"
                  className="rounded-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg font-bold transition-all duration-300 transform hover:scale-105"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Register Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

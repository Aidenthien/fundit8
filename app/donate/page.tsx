'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Shield,
  Eye,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  charityCentral_ABI,
  charityCentral_CA,
  charityCampaigns_ABI,
} from '@/config/contractABI';
import axios from 'axios';
import DonorChatbot from '@/components/dashboard/DonorChatbot';
import { useAccount } from 'wagmi';
import { AuroraText } from '@/components/magicui/aurora-text';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';

interface Campaign {
  address: string;
  name: string;
  description: string;
  imageURI: string;
  goal: string;
  totalDonated: string;
  state: number;
  charityAddress: string;
  donors: number;
  daysLeft: number;
  images?: string[];
}

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getDisplayUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return '/placeholder.svg';
    // Use ipfs.io gateway for better reliability
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  };

  return (
    <div className="relative w-full h-[250px] overflow-hidden rounded-t-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
      <div className="relative h-full w-full">
        <Image
          src={getDisplayUrl(images[currentImageIndex])}
          alt="Campaign image"
          fill
          style={{ objectFit: 'cover' }}
          className="transition-all duration-500 hover:scale-105"
        />
      </div>
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white hover:bg-black/60 rounded-full h-10 w-10 backdrop-blur-sm"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white hover:bg-black/60 rounded-full h-10 w-10 backdrop-blur-sm"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentImageIndex === index
                    ? 'bg-white scale-125'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const fetchIPFSData = async (uri: string) => {
  if (!uri || !uri.startsWith('ipfs://')) return null;

  try {
    const url = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching IPFS data:', error);
    return null;
  }
};

export default function DonatePage() {
  const [campaignDetails, setCampaignDetails] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/organizations/getAllOrganizations');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch organizations');
        }

        setOrganizations(data);
      } catch (err) {
        console.error('Error fetching organizations:', err);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchCampaignsDetails = async () => {
      if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask not detected. Please install a wallet.');
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();

        const centralContract = new ethers.Contract(
          charityCentral_CA,
          charityCentral_ABI,
          signer
        );

        const campaignAddresses = await centralContract.getAllCampaigns();
        const campaignInterface = new ethers.Interface(charityCampaigns_ABI);

        const detailedCampaigns = await Promise.all(
          campaignAddresses.map(async (address: string) => {
            const campaignContract = new ethers.Contract(
              address,
              campaignInterface,
              signer
            );

            const details = await campaignContract.getCampaignDetails();

            // Get donors count
            let donorsCount = 0;
            try {
              const donorsList = await campaignContract.getAllDonors();
              donorsCount = donorsList.length;
            } catch (error) {
              console.error('Error fetching donors for campaign:', error);
            }

            const campaign: Campaign = {
              address,
              name: details._name,
              description: details._description,
              imageURI: details._campaignImageURI || '',
              goal: ethers.formatEther(details._goal),
              totalDonated: ethers.formatEther(details._totalDonated),
              state: Number(details._state),
              charityAddress: details._charityAddress,
              donors: donorsCount,
              daysLeft: Math.floor(Math.random() * 50),
              images: [],
            };

            if (campaign.imageURI) {
              try {
                const imageData = await fetchIPFSData(campaign.imageURI);
                if (imageData && Array.isArray(imageData.images)) {
                  campaign.images = imageData.images;
                }
              } catch (error) {
                console.error(
                  `Error fetching images for campaign ${campaign.address}:`,
                  error
                );
              }
            }

            return campaign;
          })
        );

        const activeCampaigns = detailedCampaigns.filter(
          (campaign) => campaign.state === 0
        );

        setCampaignDetails(activeCampaigns);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      }
    };

    fetchCampaignsDetails();
  }, []);

  const getOrgNameByAddress = (walletAddress: string) => {
    if (!walletAddress || !organizations.length) return 'Unknown Organization';
    const org = organizations.find(
      (o) => o?.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
    );
    return org?.name || walletAddress;
  };

  const filteredCampaigns = campaignDetails.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section with Enhanced Web3 Design */}
      <section className="w-full py-10 md:py-16 lg:py-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl animate-pulse"></div>
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-pink-500/30 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-6">
              {/* Enhanced Title with AuroraText */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">
                Make a <AuroraText>Difference</AuroraText> Today
              </h1>

              {/* Enhanced Description */}
              <p className="max-w-3xl text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
                Browse active campaigns and donate to causes you care about.
                Track your impact in real-time with blockchain transparency.
              </p>

              {/* Web3 Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-8">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-medium">
                    Blockchain Verified
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <Eye className="h-5 w-5 text-green-400" />
                  <span className="text-white font-medium">
                    Transparent Tracking
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-medium">
                    Real-time Impact
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Campaigns Section */}
      <section className="w-full py-10 md:py-16 bg-black">
        <div className="container px-4 md:px-6">
          {/* Enhanced Header */}
          <div className="flex flex-col md:flex-row md:justify-between gap-6 md:items-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <AnimatedGradientText className="text-3xl md:text-4xl font-bold">
                  Active Campaigns
                </AnimatedGradientText>
              </h2>
              <p className="text-gray-300 text-lg">
                Support these verified organizations and track your impact
                through blockchain.
              </p>
            </div>

            {/* Enhanced Search and Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  Sort
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Campaign Grid */}
          <div className="grid gap-8 pt-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                {/* Enhanced Image Section */}
                <div className="relative">
                  {campaign.images && campaign.images.length > 0 ? (
                    <ImageCarousel images={campaign.images} />
                  ) : (
                    <div className="relative h-[250px] overflow-hidden rounded-t-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                      <Image
                        src="/placeholder.svg"
                        alt={campaign.name}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}

                  {/* Campaign Status Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                </div>

                <CardHeader className="space-y-3">
                  <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors duration-300">
                    {campaign.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {getOrgNameByAddress(campaign.charityAddress)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {campaign.description}
                  </p>

                  {/* Enhanced Progress Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-white">
                        {parseFloat(campaign.totalDonated) > 0.0001
                          ? parseFloat(campaign.totalDonated).toFixed(4)
                          : parseFloat(campaign.totalDonated).toFixed(6)}{' '}
                        ETH raised
                      </span>
                      <span className="text-gray-400">
                        of{' '}
                        {parseFloat(campaign.goal) > 0.0001
                          ? parseFloat(campaign.goal).toFixed(4)
                          : parseFloat(campaign.goal).toFixed(6)}{' '}
                        ETH goal
                      </span>
                    </div>
                    <Progress
                      value={
                        (parseFloat(campaign.totalDonated) /
                          parseFloat(campaign.goal)) *
                        100
                      }
                      className="h-3 bg-gray-700"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{campaign.donors} donors</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{campaign.daysLeft} days left</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/donate/${campaign.address}`} className="w-full">
                    <Button className="w-full bg-black hover:bg-gray-900 text-white border border-white/20 transition-all duration-300 group">
                      <Heart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="group-hover:hidden">Donate Now</span>
                      <AnimatedGradientText className="font-semibold hidden group-hover:inline">
                        Donate Now
                      </AnimatedGradientText>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Chatbot */}
      {isConnected && address && (
        <DonorChatbot
          donorName="Donor"
          walletAddress={address}
          totalDonated="0"
          donationsCount={0}
          recentDonations={[]}
        />
      )}
    </div>
  );
}

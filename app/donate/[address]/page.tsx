'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Heart,
  Clock,
  Users,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Trophy,
  ArrowDownCircle,
  ArrowUpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { ethers } from 'ethers';
import { charityCampaigns_ABI } from '@/config/contractABI';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DonorChatbot from '@/components/dashboard/DonorChatbot';
import { toast } from 'react-toastify';
import { convertEthToMYR } from '@/utils/ethToMYR';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { AuroraText } from '@/components/magicui/aurora-text';
import DarkVeil from '@/components/ui/dark-veil';

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

interface Milestone {
  target: string;
  reached: boolean;
  fundsReleased: boolean;
}

interface Donor {
  donorAddress: string;
  donorName: string;
  totalDonated: string;
  isTopDonor: boolean;
  date: string;
}

interface LeaderboardDonor {
  address: string;
  totalDonated: string;
  rank: number;
  name?: string;
}

interface Donation {
  amount: string;
  timestamp: string;
  donor: {
    address: string;
  };
  formattedAmount?: string;
  formattedDate?: string;
}

interface FundRelease {
  amount: string;
  recipient: string;
  timestamp: string;
  milestoneIndex: number;
  formattedAmount?: string;
  formattedDate?: string;
}

interface Transaction {
  type: 'donation' | 'release';
  amount: string;
  timestamp: string;
  address: string;
  milestoneIndex?: number;
  formattedAmount: string;
  formattedDate: string;
}

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getDisplayUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return '/placeholder.svg';
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  };

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-t-lg">
      <div className="absolute inset-0 bg-gray-900/20 z-10"></div>
      <div className="relative h-full w-full">
        <Image
          src={getDisplayUrl(images[currentImageIndex])}
          alt="Campaign image"
          fill
          style={{ objectFit: 'cover' }}
          className="transition-opacity duration-300"
        />
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 rounded-full h-8 w-8"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 rounded-full h-8 w-8"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/60'
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

// Fetch and parse IPFS data
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

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const resolvedParams = use(params);
  const campaignAddress = resolvedParams.address;

  const [campaignDetails, setCampaignDetails] = useState<Campaign>({
    address: '',
    name: '',
    description: '',
    imageURI: '',
    goal: '0',
    totalDonated: '0',
    state: 0,
    charityAddress: '',
    daysLeft: 30,
    donors: 0,
    images: [],
  });
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [milestones, setMilestones] = useState<{
    targets: string[];
    reached: boolean[];
    fundsReleased: boolean[];
  } | null>(null);
  const [donorsData, setDonorsData] = useState<Donor[]>([]);
  const [isDonating, setIsDonating] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [imageCarouselImages, setImageCarouselImages] = useState<string[]>([]);
  const [leaderboardDonors, setLeaderboardDonors] = useState<
    LeaderboardDonor[]
  >([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fundsReleased, setFundsReleased] = useState<FundRelease[]>([]);
  const [combinedTransactions, setCombinedTransactions] = useState<
    Transaction[]
  >([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [copiedAddresses, setCopiedAddresses] = useState<{
    [key: string]: boolean;
  }>({});
  const [ethToMYRRate, setEthToMYRRate] = useState<number | null>(null);
  const [donationMYR, setDonationMYR] = useState<number | null>(null);
  const router = useRouter();
  const { isConnected, address } = useAccount();

  // Fetch campaign details, milestones, and donors
  const fetchCampaignData = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask not detected. Please install a wallet.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();

      const campaignInterface = new ethers.Interface(charityCampaigns_ABI);
      const campaignContract = new ethers.Contract(
        campaignAddress,
        campaignInterface,
        signer
      );

      // Fetch campaign details
      const details = await campaignContract.getCampaignDetails();

      const campaignData: Campaign = {
        address: campaignAddress,
        name: details._name,
        description: details._description,
        imageURI: details._campaignImageURI || '',
        goal: ethers.formatEther(details._goal),
        totalDonated: ethers.formatEther(details._totalDonated),
        state: Number(details._state),
        charityAddress: details._charityAddress,
        daysLeft: Math.floor(Math.random() * 50), // Placeholder
        donors: 0, // Placeholder, update with real donor count
        images: [],
      };

      if (campaignData.imageURI) {
        try {
          const imageData = await fetchIPFSData(campaignData.imageURI);
          if (imageData && Array.isArray(imageData.images)) {
            campaignData.images = imageData.images;
            setImageCarouselImages(imageData.images);
          }
        } catch (error) {
          console.error(
            `Error fetching images for campaign ${campaignData.address}:`,
            error
          );
        }
      }

      setCampaignDetails(campaignData);

      // Fetch milestones
      try {
        const milestoneData = await campaignContract.getMilestones();

        if (
          !milestoneData ||
          !milestoneData.targets ||
          !milestoneData.reached ||
          !milestoneData.fundsReleased
        ) {
          console.error('Invalid milestone data structure:', milestoneData);
          return;
        }

        const formattedMilestones = {
          targets: Array.from(milestoneData.targets as bigint[]).map(
            (target: bigint) => ethers.formatEther(target)
          ),
          reached: Array.from(milestoneData.reached as unknown[]).map(Boolean),
          fundsReleased: Array.from(
            milestoneData.fundsReleased as unknown[]
          ).map(Boolean),
        };

        setMilestones(formattedMilestones);
      } catch (error) {
        console.error('Error fetching milestones:', error);
      }

      try {
        const donorAddresses = await campaignContract.getAllDonors();
        const donorNames = await fetchDonorNames(donorAddresses);

        const donorsInfo: Donor[] = await Promise.all(
          donorAddresses.map(async (donorAddress: string) => {
            const donorData = await campaignContract.donors(donorAddress);
            const donorName =
              donorNames.find((d) => d.address === donorAddress)?.name ||
              'Anonymous';

            return {
              donorAddress,
              donorName,
              totalDonated: ethers.formatEther(donorData.totalDonated),
              isTopDonor: Boolean(donorData.isTopDonor),
              date: new Date().toLocaleDateString(),
            };
          })
        );

        const sortedDonors = donorsInfo.sort(
          (a, b) => parseFloat(b.totalDonated) - parseFloat(a.totalDonated)
        );

        setDonorsData(sortedDonors);

        campaignData.donors = donorAddresses.length;
        setCampaignDetails(campaignData);
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    }
  };

  // Fetch donors
  const fetchDonorNames = async (addresses: string[]) => {
    try {
      const response = await fetch('/api/campaign/get-recent-donors');
      if (!response.ok) throw new Error('Failed to fetch donor names');
      const donors = await response.json();

      const addressToNameMap = donors.reduce(
        (map: Record<string, string>, donor: any) => {
          map[donor.walletAddress.toLowerCase()] = donor.name || 'Anonymous';
          return map;
        },
        {}
      );

      return addresses.map((address) => ({
        address,
        name: addressToNameMap[address.toLowerCase()] || 'Anonymous',
      }));
    } catch (error) {
      console.error('Error fetching donor names:', error);
      return addresses.map((address) => ({
        address,
        name: 'Anonymous',
      }));
    }
  };

  // Fetch campaign leaderboard data
  const fetchLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const response = await fetch(
        'https://api.studio.thegraph.com/query/105145/fund-it-8/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query CampaignLeaderboard($campaignId: ID!) {
              campaign(id: $campaignId) {
                donors(orderBy: totalDonated, orderDirection: desc) {
                  donor {
                    address
                  }
                  totalDonated
                  rank
                }
              }
            }
          `,
            variables: {
              campaignId: campaignAddress.toLowerCase(),
            },
          }),
        }
      );

      const result = await response.json();

      if (result.data?.campaign?.donors) {
        const donorsData = result.data.campaign.donors.map((item: any) => {
          const donationInWei = BigInt(item.totalDonated);
          return {
            address: item.donor.address,
            totalDonated: ethers.formatEther(donationInWei),
            rank: item.rank,
          };
        });

        const donorsWithNames = await fetchDonorNames(
          donorsData.map((d: any) => d.address)
        );

        const enrichedDonors = donorsData.map((donor: any) => {
          const matchingDonor = donorsWithNames.find(
            (d) => d.address.toLowerCase() === donor.address.toLowerCase()
          );
          return {
            ...donor,
            name: matchingDonor?.name || 'Anonymous',
          };
        });

        setLeaderboardDonors(enrichedDonors);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // Fetch campaign transaction history
  const fetchTransactionHistory = async () => {
    setIsLoadingTransactions(true);
    try {
      const response = await fetch(
        'https://api.studio.thegraph.com/query/105145/fund-it-8/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query GetCampaignTransactions($campaignId: ID!) {
              campaign(id: $campaignId) {
                name
                totalDonated
                charity {
                  address
                }
                
                donations(orderBy: timestamp, orderDirection: desc) {
                  amount
                  timestamp
                  donor {
                    address
                  }
                }
                  
                fundsReleased(orderBy: timestamp, orderDirection: desc) {
                  amount
                  recipient
                  timestamp
                  milestoneIndex
                }
              }
            }
            `,
            variables: {
              campaignId: campaignAddress.toLowerCase(),
            },
          }),
        }
      );

      const result = await response.json();

      if (result.data?.campaign) {
        const campaignData = result.data.campaign;

        // Process donations
        const processedDonations = campaignData.donations.map(
          (donation: any) => {
            const donationInWei = BigInt(donation.amount);
            const date = new Date(Number(donation.timestamp) * 1000); // Convert to milliseconds

            return {
              ...donation,
              formattedAmount: ethers.formatEther(donationInWei),
              formattedDate: date.toLocaleString(),
            };
          }
        );

        // Process fund releases
        const processedReleases = campaignData.fundsReleased.map(
          (release: any) => {
            const amountInWei = BigInt(release.amount);
            const date = new Date(Number(release.timestamp) * 1000);

            return {
              ...release,
              formattedAmount: ethers.formatEther(amountInWei),
              formattedDate: date.toLocaleString(),
            };
          }
        );

        // Create combined transactions list
        const allTransactions: Transaction[] = [
          ...processedDonations.map((donation: any) => ({
            type: 'donation',
            amount: donation.amount,
            timestamp: donation.timestamp,
            address: donation.donor.address,
            formattedAmount: donation.formattedAmount,
            formattedDate: donation.formattedDate,
          })),
          ...processedReleases.map((release: any) => ({
            type: 'release',
            amount: release.amount,
            timestamp: release.timestamp,
            address: release.recipient,
            milestoneIndex: release.milestoneIndex,
            formattedAmount: release.formattedAmount,
            formattedDate: release.formattedDate,
          })),
        ];

        // Sort by timestamp descending (most recent first)
        allTransactions.sort(
          (a, b) => Number(b.timestamp) - Number(a.timestamp)
        );

        setDonations(processedDonations);
        setFundsReleased(processedReleases);
        setCombinedTransactions(allTransactions);
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (campaignAddress) {
      fetchCampaignData();
      fetchLeaderboardData();
      fetchTransactionHistory();
    }
  }, [campaignAddress]);

  // Fetch all organizations
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

  // Fetch ETH to MYR conversion rate
  useEffect(() => {
    async function fetchRate() {
      const rate = await convertEthToMYR(1);
      setEthToMYRRate(rate);
    }
    fetchRate();
  }, []);

  // Handle donation
  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setDonationError('Please enter a valid donation amount greater than 0.');
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      setDonationError('MetaMask not detected. Please install a wallet.');
      return;
    }

    setIsDonating(true);
    setDonationError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = await provider.getSigner();

      const campaignInterface = new ethers.Interface(charityCampaigns_ABI);
      const campaignContract = new ethers.Contract(
        campaignAddress,
        campaignInterface,
        signer
      );

      const tx = await campaignContract.donate({
        value: ethers.parseEther(donationAmount),
      });
      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      await fetchCampaignData();
      setDonationAmount('');
      toast.success(
        '🎉 Donation successful! Thank you for your contribution.',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error: any) {
      console.error('Error donating:', error);

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        // User rejected the transaction
        setDonationError('Transaction cancelled. No funds were sent.');
      } else {
        setDonationError(
          error.message || 'Failed to process donation. Please try again.'
        );
      }
    } finally {
      setIsDonating(false);
    }
  };

  // Function to get organization name by wallet address
  const getOrgNameByAddress = (walletAddress: string) => {
    if (!walletAddress || !organizations.length) return 'Unknown Organization'; // Early return if no address or organizations
    const org = organizations.find(
      (o) => o?.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
    );
    return org?.name || walletAddress; // Return name if found, otherwise fallback to address
  };

  const getDisplayUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return '/placeholder.svg';
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  };

  const calculateProgressPercentage = () => {
    const goalValue = parseFloat(campaignDetails.goal || '0');
    const donatedValue = parseFloat(campaignDetails.totalDonated || '0');

    if (goalValue <= 0) return 0;
    return Math.min((donatedValue / goalValue) * 100, 100);
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedAddresses({ ...copiedAddresses, [address]: true });
      setTimeout(() => {
        setCopiedAddresses({ ...copiedAddresses, [address]: false });
      }, 2000);
    });
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const formatDonation = (amount: string) => {
    const value = parseFloat(amount);
    return value.toFixed(6);
  };

  const isCurrentUserAddress = (donorAddress: string) => {
    return (
      isConnected &&
      address &&
      donorAddress.toLowerCase() === address.toLowerCase()
    );
  };

  // Update donation MYR amount when donation amount or rate changes
  useEffect(() => {
    async function updateDonationMYR() {
      if (donationAmount && parseFloat(donationAmount) > 0) {
        const myr = await convertEthToMYR(parseFloat(donationAmount));
        setDonationMYR(myr);
      } else {
        setDonationMYR(null);
      }
    }
    updateDonationMYR();
  }, [donationAmount, ethToMYRRate]);

  // Helper to display ETH and MYR
  const displayEthAndMYR = (eth: string | number) => {
    const ethValue = typeof eth === 'string' ? parseFloat(eth) : eth;
    if (ethToMYRRate) {
      return `${ethValue} ETH (~RM${(ethValue * ethToMYRRate).toFixed(4)})`;
    }
    return `${ethValue} ETH`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-black relative">
      <div
        style={{
          width: '100%',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <DarkVeil />
      </div>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Campaign Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative rounded-2xl overflow-hidden border border-gray-700/50 backdrop-blur-sm">
                {imageCarouselImages.length > 0 ? (
                  <ImageCarousel images={imageCarouselImages} />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Heart className="h-16 w-16 text-gray-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Info */}
            <div className="flex flex-col space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-400 border-green-500/20"
                  >
                    Active Campaign
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                  >
                    {campaignDetails.daysLeft} days left
                  </Badge>
                </div>

                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  {campaignDetails.name}
                </h1>

                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">
                    {getOrgNameByAddress(campaignDetails.charityAddress)}
                  </span>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                  {campaignDetails.description}
                </p>
              </div>

              {/* Progress Section */}
              <div className="space-y-4 p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">
                    {displayEthAndMYR(campaignDetails.totalDonated)}
                  </span>
                  <span className="text-gray-400">
                    of {displayEthAndMYR(campaignDetails.goal)} goal
                  </span>
                </div>

                <div className="space-y-2">
                  <Progress
                    value={calculateProgressPercentage()}
                    className="h-3 bg-gray-700/50"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {calculateProgressPercentage().toFixed(1)}% funded
                    </span>
                    <span className="text-gray-400">
                      {campaignDetails.donors || 0} donors
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="text-2xl font-bold text-white">
                    {campaignDetails.donors || 0}
                  </div>
                  <div className="text-sm text-gray-400">Donors</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="text-2xl font-bold text-white">
                    {campaignDetails.daysLeft}
                  </div>
                  <div className="text-sm text-gray-400">Days Left</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                  <div className="text-2xl font-bold text-white">
                    {milestones?.targets.length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Milestones</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="w-full py-12 bg-black/20 relative">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="border-none shadow-2xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-white">
                  <AuroraText>Make a Donation</AuroraText>
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Your donation will be securely processed via blockchain
                  technology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {[0.1, 0.5, 1].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setDonationAmount(amount.toString())}
                      className="h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
                    >
                      {amount} ETH
                    </Button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      placeholder="Enter custom amount"
                      min="0.01"
                      step="0.01"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      disabled={isDonating}
                      className="h-12 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                    />
                    <span className="text-gray-400 font-medium">ETH</span>
                  </div>
                  {donationMYR !== null && (
                    <div className="text-center p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                      <span className="text-sm text-gray-400">
                        ≈ RM {donationMYR.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {donationError && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 text-sm">{donationError}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-6">
                {isConnected ? (
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 group"
                    onClick={handleDonate}
                    disabled={isDonating || !donationAmount}
                  >
                    <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    {isDonating ? (
                      <span>Processing Donation...</span>
                    ) : (
                      <span>Donate Now</span>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
                    onClick={() => router.push('/login')}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Connect Wallet to Donate
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Campaign
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Blockchain
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="w-full py-12 md:py-14 lg:py-14 bg-black/10 relative">
        <div className="container px-6 md:px-6 relative z-10">
          <Tabs defaultValue="about" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-1 rounded-xl">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="milestones"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                >
                  Milestones
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="donors"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                >
                  Donors
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="about" className="pt-6">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-white">
                    <AuroraText>About This Campaign</AuroraText>
                  </h2>
                  <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    {campaignDetails.description}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border-none shadow-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mb-4">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">
                        Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        This project will provide clean water access to over
                        5,000 people across multiple communities, creating
                        lasting positive change.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">
                        Sustainability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        Local communities will be trained to maintain the water
                        systems, ensuring long-term sustainability and
                        self-reliance.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">
                        Transparency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        All funds are managed through smart contracts, ensuring
                        complete transparency and accountability in every
                        transaction.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="pt-6">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-white">
                    <AuroraText>Project Milestones</AuroraText>
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Funds are released to the organization as each milestone is
                    completed and verified through blockchain technology.
                  </p>
                </div>

                <div className="space-y-6">
                  {milestones &&
                    milestones.targets.map((target: string, index: number) => {
                      const targetValue = parseFloat(target);
                      const totalDonated = parseFloat(
                        campaignDetails.totalDonated || '0'
                      );
                      const progress = Math.min(
                        (totalDonated / targetValue) * 100,
                        100
                      );
                      const isReached = milestones.reached[index];
                      const isFundsReleased = milestones.fundsReleased[index];

                      return (
                        <Card
                          key={index}
                          className={`border-none shadow-xl overflow-hidden transition-all duration-300 ${
                            isReached
                              ? 'bg-green-900/20 border-green-500/30'
                              : 'bg-gray-900/50 border-gray-700/50'
                          } backdrop-blur-sm border`}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    isReached
                                      ? 'bg-green-500/20 border border-green-500/50'
                                      : 'bg-gray-700/50 border border-gray-600/50'
                                  }`}
                                >
                                  <span
                                    className={`text-lg font-bold ${
                                      isReached
                                        ? 'text-green-400'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {index + 1}
                                  </span>
                                </div>
                                <div>
                                  <CardTitle className="text-xl text-white">
                                    Milestone {index + 1}
                                  </CardTitle>
                                  <CardDescription className="text-gray-400">
                                    Target: {targetValue.toFixed(6)} ETH
                                    {isFundsReleased && (
                                      <span className="ml-2 text-green-400">
                                        ✓ Funds Released
                                      </span>
                                    )}
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge
                                variant={isReached ? 'default' : 'outline'}
                                className={
                                  isReached
                                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                    : 'bg-gray-700/50 text-gray-400 border-gray-600/50'
                                }
                              >
                                {isReached ? '✓ Reached' : 'Pending'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Progress
                              value={progress}
                              className={`h-3 ${
                                isReached ? 'bg-green-900/50' : 'bg-gray-700/50'
                              }`}
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                {totalDonated.toFixed(6)} /{' '}
                                {targetValue.toFixed(6)} ETH
                              </span>
                              <span
                                className={`font-medium ${
                                  isReached ? 'text-green-400' : 'text-gray-400'
                                }`}
                              >
                                {progress.toFixed(1)}% complete
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  {(!milestones || milestones.targets.length === 0) && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-4">
                        <Trophy className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="text-gray-400 text-lg">
                        No milestones defined for this campaign.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="transactions" className="pt-6">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-white">
                    <AuroraText>Campaign Transaction History</AuroraText>
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    All financial activity for this campaign, tracked
                    transparently on the blockchain
                  </p>
                </div>

                {isLoadingTransactions ? (
                  <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                      <p className="text-gray-400">
                        Loading transaction history...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Combined transaction history */}
                    <Card className="border-none shadow-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
                      <CardHeader className="bg-gray-800/30 border-b border-gray-700/50">
                        <CardTitle className="text-xl text-white">
                          All Transactions
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Combined chronological transaction history from the
                          blockchain
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-700/50 hover:bg-gray-800/30">
                                <TableHead className="text-gray-300 font-semibold">
                                  Type
                                </TableHead>
                                <TableHead className="text-gray-300 font-semibold">
                                  Date
                                </TableHead>
                                <TableHead className="text-gray-300 font-semibold">
                                  Address
                                </TableHead>
                                <TableHead className="text-right text-gray-300 font-semibold">
                                  Amount
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {combinedTransactions.length > 0 ? (
                                combinedTransactions.map((tx, index) => (
                                  <TableRow
                                    key={index}
                                    className="border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                                  >
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        {tx.type === 'donation' ? (
                                          <>
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                              <ArrowDownCircle className="h-4 w-4 text-green-400" />
                                            </div>
                                            <span className="text-green-400 font-medium">
                                              Donation
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                              <ArrowUpCircle className="h-4 w-4 text-red-400" />
                                            </div>
                                            <span className="text-red-400 font-medium">
                                              Funds Released
                                            </span>
                                            <Badge
                                              variant="outline"
                                              className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                                            >
                                              Milestone{' '}
                                              {tx.milestoneIndex !== undefined
                                                ? tx.milestoneIndex + 1
                                                : '?'}
                                            </Badge>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      {tx.formattedDate}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <span className="text-gray-400 text-sm">
                                          {tx.type === 'donation'
                                            ? 'From'
                                            : 'To'}
                                        </span>
                                        {tx.type === 'donation' ? (
                                          <span className="text-sm font-mono text-gray-300">
                                            {formatAddress(tx.address)}
                                          </span>
                                        ) : (
                                          <div className="group flex items-center">
                                            <span className="text-sm font-mono text-gray-300">
                                              {formatAddress(tx.address)}
                                            </span>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <button
                                                    onClick={() =>
                                                      copyToClipboard(
                                                        tx.address
                                                      )
                                                    }
                                                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                  >
                                                    {copiedAddresses[
                                                      tx.address
                                                    ] ? (
                                                      <Check className="h-3.5 w-3.5 text-green-400" />
                                                    ) : (
                                                      <Copy className="h-3.5 w-3.5 text-gray-500 hover:text-gray-400" />
                                                    )}
                                                  </button>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                  side="top"
                                                  align="center"
                                                  className="px-3 py-1.5 text-xs"
                                                >
                                                  <p>
                                                    {copiedAddresses[tx.address]
                                                      ? 'Copied!'
                                                      : 'Copy address'}
                                                  </p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          </div>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="font-mono">
                                        <span
                                          className={`font-medium ${
                                            tx.type === 'donation'
                                              ? 'text-green-400'
                                              : 'text-red-400'
                                          }`}
                                        >
                                          {tx.type === 'donation' ? '+' : '-'}
                                          {tx.formattedAmount} ETH
                                        </span>
                                        {ethToMYRRate && (
                                          <div className="text-xs text-gray-500 mt-1">
                                            ≈ RM{' '}
                                            {(
                                              parseFloat(tx.formattedAmount) *
                                              ethToMYRRate
                                            ).toFixed(2)}
                                          </div>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    className="text-center py-12"
                                  >
                                    <div className="flex flex-col items-center space-y-3">
                                      <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                                        <ArrowDownCircle className="h-6 w-6 text-gray-500" />
                                      </div>
                                      <p className="text-gray-400">
                                        No transaction history available
                                      </p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Summary Cards */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="border-none shadow-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
                        <CardHeader className="bg-green-900/20 border-b border-green-500/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                              <ArrowDownCircle className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-white">
                                Incoming Donations
                              </CardTitle>
                              <CardDescription className="text-green-400">
                                Money received from donors
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {donations.length > 0 ? (
                            <div className="space-y-4">
                              {donations.map((donation, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-3 rounded-lg bg-gray-800/30 border border-gray-700/30"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-gray-300">
                                      {formatAddress(donation.donor.address)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {donation.formattedDate}
                                    </span>
                                  </div>
                                  <div className="font-mono text-green-400 font-medium">
                                    +{donation.formattedAmount} ETH
                                    {ethToMYRRate && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        ≈ RM{' '}
                                        {(
                                          parseFloat(
                                            donation.formattedAmount ?? '0'
                                          ) * ethToMYRRate
                                        ).toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
                                <ArrowDownCircle className="h-6 w-6 text-gray-500" />
                              </div>
                              <p className="text-gray-400">No donations yet</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
                        <CardHeader className="bg-red-900/20 border-b border-red-500/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                              <ArrowUpCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-white">
                                Funds Released
                              </CardTitle>
                              <CardDescription className="text-red-400">
                                Money sent to campaign recipients
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {fundsReleased.length > 0 ? (
                            <div className="space-y-4">
                              {fundsReleased.map((release, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-3 rounded-lg bg-gray-800/30 border border-gray-700/30"
                                >
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-300">
                                        {formatAddress(release.recipient)}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs"
                                      >
                                        Milestone {release.milestoneIndex + 1}
                                      </Badge>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {release.formattedDate}
                                    </span>
                                  </div>
                                  <div className="font-mono text-red-400 font-medium">
                                    -{release.formattedAmount} ETH
                                    {ethToMYRRate && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        ≈ RM{' '}
                                        {(
                                          parseFloat(
                                            release.formattedAmount ?? '0'
                                          ) * ethToMYRRate
                                        ).toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
                                <ArrowUpCircle className="h-6 w-6 text-gray-500" />
                              </div>
                              <p className="text-gray-400">
                                No funds released yet
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="donors" className="pt-6">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-white">
                    <AuroraText>Campaign Community</AuroraText>
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Meet the generous donors who are making this campaign
                    possible
                  </p>
                </div>

                {/* Recent Donors */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Recent Donors
                  </h3>
                  <Card className="border-none shadow-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
                    <CardContent className="p-0">
                      <div className="overflow-hidden">
                        <div className="p-6 grid grid-cols-3 font-medium text-gray-300 border-b border-gray-700/50">
                          <div>Donor</div>
                          <div className="text-center">Amount</div>
                          <div className="text-right">Date</div>
                        </div>
                        <div className="divide-y divide-gray-700/30">
                          {donorsData.slice(0, 5).map((donor, index) => (
                            <div
                              key={index}
                              className="p-6 grid grid-cols-3 hover:bg-gray-800/30 transition-colors"
                            >
                              <div className="text-gray-300">
                                {donor.donorName}
                              </div>
                              <div className="text-center text-gray-300">
                                {donor.totalDonated} ETH
                              </div>
                              <div className="text-right text-gray-400">
                                {donor.date}
                              </div>
                            </div>
                          ))}
                          {donorsData.length === 0 && (
                            <div className="p-12 text-center">
                              <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-3">
                                <Users className="h-6 w-6 text-gray-500" />
                              </div>
                              <p className="text-gray-400">No donors yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {donorsData.length > 5 && (
                    <div className="flex justify-center mt-6">
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        View All Donors
                      </Button>
                    </div>
                  )}
                </div>

                {/* Leaderboard */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Trophy className="mr-3 h-6 w-6 text-yellow-500" />
                    Campaign Leaderboard
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Top donors for this campaign
                  </p>

                  {isLoadingLeaderboard ? (
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        <p className="text-gray-400">
                          Loading leaderboard data...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Card className="border-none shadow-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
                      <CardContent className="p-0">
                        <div className="overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-700/50 hover:bg-gray-800/30">
                                <TableHead className="w-[100px] text-gray-300 font-semibold">
                                  Rank
                                </TableHead>
                                <TableHead className="text-gray-300 font-semibold">
                                  Donor
                                </TableHead>
                                <TableHead className="text-right text-gray-300 font-semibold">
                                  Total Donated
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {leaderboardDonors.length > 0 ? (
                                leaderboardDonors.map((donor, index) => {
                                  const isCurrentUser =
                                    isConnected &&
                                    address &&
                                    donor.address.toLowerCase() ===
                                      address.toLowerCase();

                                  return (
                                    <TableRow
                                      key={index}
                                      className={`border-gray-700/30 transition-colors ${
                                        isCurrentUser
                                          ? 'bg-green-900/20 hover:bg-green-900/30'
                                          : 'hover:bg-gray-800/30'
                                      }`}
                                    >
                                      <TableCell className="font-medium">
                                        {index < 3 ? (
                                          <span
                                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full 
                                            ${
                                              index === 0
                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                                : index === 1
                                                ? 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                            }`}
                                          >
                                            {index + 1}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400">
                                            {index + 1}
                                          </span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex flex-col">
                                          <span
                                            className={`${
                                              isCurrentUser
                                                ? 'text-green-400 font-medium'
                                                : 'text-gray-300'
                                            }`}
                                          >
                                            {donor.name || 'Anonymous'}
                                            {isCurrentUser ? ' (You)' : ''}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {formatAddress(donor.address)}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="font-mono">
                                          <span className="font-medium text-gray-300">
                                            {formatDonation(donor.totalDonated)}{' '}
                                            ETH
                                          </span>
                                          {ethToMYRRate && (
                                            <div className="text-xs text-gray-500 mt-1">
                                              ≈ RM{' '}
                                              {(
                                                parseFloat(donor.totalDonated) *
                                                ethToMYRRate
                                              ).toFixed(2)}
                                            </div>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={3}
                                    className="text-center py-12"
                                  >
                                    <div className="flex flex-col items-center space-y-3">
                                      <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                                        <Trophy className="h-6 w-6 text-gray-500" />
                                      </div>
                                      <p className="text-gray-400">
                                        No leaderboard data available
                                      </p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add DonorChatbot */}
      {isConnected && address && (
        <DonorChatbot
          donorName={
            donorsData.find(
              (d) => d.donorAddress.toLowerCase() === address.toLowerCase()
            )?.donorName || 'Donor'
          }
          walletAddress={address}
          totalDonated={
            donorsData.find(
              (d) => d.donorAddress.toLowerCase() === address.toLowerCase()
            )?.totalDonated || '0'
          }
          donationsCount={1}
          recentDonations={[
            {
              campaignId: campaignAddress,
              campaignName: campaignDetails.name,
              amount:
                donorsData.find(
                  (d) => d.donorAddress.toLowerCase() === address.toLowerCase()
                )?.totalDonated || '0',
              date: new Date().toLocaleDateString(),
            },
          ]}
        />
      )}
    </div>
  );
}

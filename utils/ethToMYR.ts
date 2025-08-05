// Utility to convert ETH to MYR using CoinGecko API
import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const CG_API_KEY = process.env.CG_API_KEY;

export async function getEthToMYR() {
  try {
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: 'ethereum',
        vs_currencies: 'myr',
        x_cg_pro_api_key: CG_API_KEY,
      },
    });
    return response.data.ethereum.myr;
  } catch (error) {
    console.error('Error fetching ETH to MYR conversion:', error);
    return null;
  }
}

export async function convertEthToMYR(
  ethAmount: number
): Promise<number | null> {
  const rate = await getEthToMYR();
  if (rate && typeof rate === 'number') {
    return ethAmount * rate;
  }
  return null;
}

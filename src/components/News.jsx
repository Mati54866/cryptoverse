import React from 'react';
import { Typography, Row, Col, Card, Spin } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;
const NEWS_TIMEOUT_MS = 800;


// Crypto-themed image URLs that actually work
const cryptoImages = [
  'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=300&h=200&fit=crop', // Bitcoin
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=300&h=200&fit=crop', // Ethereum
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop', // Trading
  'https://images.unsplash.com/photo-1642104704075-907c2f7cee6b?w=300&h=200&fit=crop', // Crypto chart
  'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=300&h=200&fit=crop', // Blockchain
  'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=300&h=200&fit=crop', // NFT
];

const fallbackNews = [
  {
    title: 'Bitcoin Surges Past $65,000 as Institutional Investment Grows',
    description:
      'Major financial institutions continue to increase their crypto exposure, driving prices higher.',
    url: 'https://cointelegraph.com/news/bitcoin-surges-institutional-investment',
    publishedAt: new Date().toISOString(),
    source: { name: 'CryptoNews' },
  },
  {
    title: 'Ethereum Layer 2 Solutions See Record Transaction Volume',
    description:
      'Scaling solutions are gaining traction as gas fees remain volatile on the mainnet.',
    url: 'https://cointelegraph.com/news/ethereum-layer-2-record-volume',
    publishedAt: new Date().toISOString(),
    source: { name: 'CryptoNews' },
  },
  {
    title: 'Regulatory Clarity Emerges in Major Economies for Crypto',
    description:
      'New frameworks provide guidance for exchanges and investors alike.',
    url: 'https://cointelegraph.com/news/regulatory-clarity-crypto',
    publishedAt: new Date().toISOString(),
    source: { name: 'CryptoNews' },
  },
  {
    title: 'NFT Market Shows Signs of Recovery with New Use Cases',
    description:
      'Gaming and real-world assets drive renewed interest in non-fungible tokens.',
    url: 'https://cointelegraph.com/news/nft-market-recovery',
    publishedAt: new Date().toISOString(),
    source: { name: 'CryptoNews' },
  },
  {
    title: 'DeFi Total Value Locked Approaches $100 Billion',
    description:
      'Decentralized finance continues to attract capital despite market volatility.',
    url: 'https://cointelegraph.com/news/defi-tvl-100-billion',
    publishedAt: new Date().toISOString(),
    source: { name: 'CryptoNews' },
  },
  {
    title: 'Solana Blockchain Announces Major Network Upgrade',
    description:
      'Performance improvements and new features are coming to the high-speed blockchain.',
    url: 'https://cointelegraph.com/news/solana-network-upgrade',
    publishedAt: new Date().toISOString(),
    source: { name: 'CryptoNews' },
  },
];

const News = ({ simplified }) => {
  const count = simplified ? 6 : 12;

  // Start with fallback immediately — zero wait time for user
  const buildFallback = (n) => fallbackNews.slice(0, n).map((item, idx) => ({
    ...item,
    imageUrl: cryptoImages[idx % cryptoImages.length],
  }));

  const [news, setNews] = React.useState(() => buildFallback(count));
  const [loading, setLoading] = React.useState(false); // no spinner — show fallback instantly

  React.useEffect(() => {
    let isMounted = true;

    const fetchWithTimeout = async (url) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), NEWS_TIMEOUT_MS);

      try {
        return await fetch(url, { signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const formatNewsItems = (items) => items.slice(0, count).map((item, idx) => ({
        title: item.title,
        description: item.description
          ?.replace(/<[^>]*>/g, '')
          .substring(0, 200),
        url: item.link,
        imageUrl: cryptoImages[idx % cryptoImages.length],
        publishedAt: item.pubDate,
        source: { name: item.author || 'Crypto News' },
      }));

    const setFallbackNews = () => {
      // Fallback already shown — nothing to do here
    };


    const fetchNews = async () => {
      try {
        const rssUrls = [
          'https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss',
          'https://api.rss2json.com/v1/api.json?rss_url=https://decrypt.co/feed',
        ];

        const newsRequests = rssUrls.map(async (url) => {
          const response = await fetchWithTimeout(url);
          const data = await response.json();

          if (!data.items || data.items.length === 0) {
            throw new Error('RSS source returned no items');
          }

          return formatNewsItems(data.items);
        });

        const results = await Promise.allSettled(newsRequests);
        const successfulResult = results.find((result) => result.status === 'fulfilled');

        if (successfulResult && isMounted) {
          setNews(successfulResult.value);
          setLoading(false);
          return;
        }

        setFallbackNews();
      } catch {
        setFallbackNews();
      }
    };

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, [count]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading news...</p>
      </div>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {news.map((article, index) => (
        <Col xs={24} sm={12} lg={8} key={index}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <Card
              hoverable
              cover={(
                <img
                  alt={article.title}
                  src={article.imageUrl}
                  style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = cryptoImages[index % cryptoImages.length];
                  }}
                />
              )}
            >
              <Title level={5}>{article.title.substring(0, 80)}...</Title>
              <Text type="secondary">
                {article.source?.name || 'Crypto News'}
              </Text>
              <div style={{ marginTop: '10px' }}>
                <Text type="secondary">
                  {moment(article.publishedAt).fromNow()}
                </Text>
              </div>
            </Card>
          </a>
        </Col>
      ))}
    </Row>
  );
};

export default News;

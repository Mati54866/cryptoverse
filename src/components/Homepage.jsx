import React, { lazy, Suspense } from 'react';
import millify from 'millify';
import { Typography, Row, Col, Statistic, Spin } from 'antd';
import { Link } from 'react-router-dom';

import { useGetCryptosQuery } from '../services/cryptoApi';

const { Title } = Typography;
const Cryptocurrencies = lazy(() => import('./Cryptocurrencies'));
const SectionFallback = () => (
  <div className="section-loader">
    <Spin />
  </div>
);

const Homepage = () => {
  const { data, isFetching } = useGetCryptosQuery(10);
  const globalStats = data?.data?.stats;

  const stats = [
    { title: 'Total Cryptocurrencies', value: globalStats?.total },
    { title: 'Total Exchanges', value: globalStats?.totalExchanges, format: true },
    { title: 'Total Market Cap:', value: globalStats?.totalMarketCap, prefix: '$', format: true },
    { title: 'Total 24h Volume', value: globalStats?.total24hVolume, prefix: '$', format: true },
    { title: 'Total Cryptocurrencies', value: globalStats?.total },
    { title: 'Total Markets', value: globalStats?.totalMarkets, format: true },
  ];

  const renderValue = ({ value, prefix = '', format = false }) => {
    if (value === undefined || value === null) return '...';

    return `${prefix}${format ? millify(value) : value}`;
  };

  return (
    <>
      <Title level={2} className="heading">
        Global Crypto Stats
      </Title>
      {isFetching && !globalStats ? (
        <div className="section-loader">
          <Spin />
        </div>
      ) : (
        <Row gutter={[32, 32]}>
          {stats.map((stat, index) => (
            <Col span={12} key={`${stat.title}-${index}`}>
              <Statistic title={stat.title} value={renderValue(stat)} />
            </Col>
          ))}
        </Row>
      )}
      <div className="home-heading-container">
        <Title level={2} className="home-title">
          Top 10 Cryptos In The World
        </Title>
        <Title level={3} className="show-more">
          <Link to="/cryptocurrencies">Show more</Link>
        </Title>
      </div>
      <Suspense fallback={<SectionFallback />}>
        <Cryptocurrencies simplified />
      </Suspense>
    </>
  );
};

export default Homepage;

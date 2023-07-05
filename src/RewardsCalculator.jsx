import { useState, useEffect } from "react";
import mockData from "../src/mockData.json";

const RewardPointsCalculator = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Set timeout to simulate a network request
    setTimeout(() => {
      setTransactions(mockData);
    }, 500);
  }, []);

  const calculateRewardPoints = amount => {
    let rewardPoints = 0;

    if (amount > 100) {
      rewardPoints += 2 * (amount - 100);
    }
    if (amount > 50) {
      rewardPoints += 1 * Math.min(amount, 100) - 50;
    }

    return rewardPoints;
  };

  const calculateMonthlyRewards = transactions => {
    return transactions.reduce((monthlyRewards, transaction) => {
      const { customerId, amount, date } = transaction;
      const month = new Date(date).getMonth() + 1;

      monthlyRewards[customerId] = monthlyRewards[customerId] || {};
      monthlyRewards[customerId][month] =
        (monthlyRewards[customerId][month] || 0) +
        calculateRewardPoints(amount);

      return monthlyRewards;
    }, {});
  };

  const calculateTotalRewards = monthlyRewards => {
    const totalRewards = {};

    for (const customerId in monthlyRewards) {
      totalRewards[customerId] = Object.values(
        monthlyRewards[customerId]
      ).reduce((sum, rewards) => sum + rewards, 0);
    }

    return totalRewards;
  };

  const monthlyRewards = calculateMonthlyRewards(transactions);
  const totalRewards = calculateTotalRewards(monthlyRewards);

  if (!transactions.length) return <div>Loading...</div>;

  return (
    <div>
      <h1>Reward Points Calculator</h1>
      <div>
        <h3>Monthly Rewards</h3>
        <pre>{JSON.stringify(monthlyRewards, null, 2)}</pre>
      </div>
      <div>
        <h3>Total Rewards</h3>
        <pre>{JSON.stringify(totalRewards, null, 2)}</pre>
      </div>
    </div>
  );
};

export default RewardPointsCalculator;

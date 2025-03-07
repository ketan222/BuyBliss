import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "./Analysis.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Analysis() {
  const [userCount, setUserCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [newsletterCount, setnewsletterCount] = useState(0);
  const [ItemSoldCount, setItemSoldCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/v1/user-count");
        setUserCount(userResponse.data.count);

        const orderResponse = await axios.get("http://localhost:5000/api/v1/orders-count");
        setOrdersCount(orderResponse.data.count);

        const newsletterResponse = await axios.get("http://localhost:5000/api/v1/newsletter-count");
        setnewsletterCount(newsletterResponse.data.count);

        const itemsSoldResponse = await axios.get("http://localhost:5000/api/v1/total-items-sold");
        setItemSoldCount(itemsSoldResponse.data.totalSold);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Data for the charts
  const pieData1 = {
    labels: ["Registered Users", "Newsletter Subscriptions"],
    datasets: [
      {
        data: [userCount, newsletterCount],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const pieData2 = {
    labels: ["Total Orders", "Items Sold"],
    datasets: [
      {
        data: [ordersCount, ItemSoldCount],
        backgroundColor: ["#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const barData1 = {
    labels: ["Registered Users", "Newsletter Subscriptions"],
    datasets: [
      {
        label: "Counts",
        data: [userCount, newsletterCount],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const barData2 = {
    labels: ["Total Orders", "Items Sold"],
    datasets: [
      {
        label: "Counts",
        data: [ordersCount, ItemSoldCount],
        backgroundColor: ["#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="analysis">
      <h1 className="h1-analysis">Website Analytics</h1>
      <div className="charts-container">
        <div className="chart">
          <h3>Registered Users vs Newsletter Subscriptions</h3>
          <Pie data={pieData1} />
        </div>
        <div className="chart">
          <h3>Total Orders vs Items Sold</h3>
          <Pie data={pieData2} />
        </div>
        <div className="chart">
          <h3>Registered Users vs Newsletter Subscriptions</h3>
          <Bar data={barData1} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart">
          <h3>Total Orders vs Items Sold</h3>
          <Bar data={barData2} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}

export default Analysis;

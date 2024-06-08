import { useEffect, useState, useRef } from 'react';
import { getEthereumPrice } from "../../services/fetching";
import Chart from 'chart.js/auto';

const LiveChart = () => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [dollarPrices, setDollarPrices] = useState(() => {
        const savedPrices = localStorage.getItem('dollarPrices');
        return savedPrices ? JSON.parse(savedPrices) : [];
    });

    useEffect(() => {
        const fetchDollarPrice = async () => {
            const dollarPrice = await getEthereumPrice();
            setDollarPrices(prevPrices => {
                const updatedPrices = [...prevPrices.slice(-40), dollarPrice.USD];
                localStorage.setItem('dollarPrices', JSON.stringify(updatedPrices));
                return updatedPrices;
            });
        };

        const interval = setInterval(fetchDollarPrice, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dollarPrices.map((_, index) => index),
                datasets: [{
                    data: dollarPrices,

                    borderColor: dollarPrices[dollarPrices.length - 2] > dollarPrices[dollarPrices.length - 1] ? 'rgb(255, 0, 0)' : 'rgb(0, 200, 130)',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    tension: 0.2,
                    pointBorderWidth: 0,
                    fill: false,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Ethereum Price in USD',
                    }
                },
                scales: {
                    y: {
                        display: false,
                        grid: { display: false },
                        beginAtZero: true,
                        min: Math.min(...dollarPrices) - 1,
                        max: Math.max(...dollarPrices) + 1
                    },
                    x: {
                        display: false,
                        grid: { display: false }
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [dollarPrices]);

    return (
        <>
            <canvas ref={canvasRef} id="myChart"></canvas>
        </>
    );
}

export default LiveChart;

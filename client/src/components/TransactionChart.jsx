
import {useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';


const TransactionChart = ({ transactions, balance, address }) => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    function convertDateFormat(dateStr) {
        const date = new Date(dateStr);
    
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because it's zero-based
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
    
        return `${day}/${month}/${year}/${hours}:${minutes}`;
    }

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        let total = parseFloat(balance);
        let data = transactions.filter(transaction => transaction.sender_address === address || transaction.receiver_address === address);
        data = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        data = data.reverse();
        console.log(data);
        data = transactions.map(transaction => {
            transaction.sender_address === address ? total += transaction.amount : total -= transaction.amount;
            return {
                date: convertDateFormat(transaction.created_at),
                amount: parseFloat(total).toFixed(6),
            }
        });
        data = data.reverse();
        data.push({
            date: convertDateFormat(new Date().toISOString()),
            amount: parseFloat(balance).toFixed(6)
        });
        const labels = data.map(d => d.date);
        const amounts = data.map(d => d.amount);
        

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    label: false,
                    borderColor: 'rgb(0, 151, 105)',
                    backgroundColor: 'rgba(0, 151, 105, 0.2)',
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
                    }
                },
                scales: {
                  y: {
                    display: false,
                    grid: {display: false},
                    beginAtZero: true,
                    // ticks: {
                    //     callback: function(value, index, values) {
                    //         return value + ' ETH';
                    //     }
                    // },

                  },
                  x: {
                    display: false,
                    grid: {display: false}}
                }
              }
        });
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
        
        
    }, [transactions, balance]);

    return (
        <>
            <canvas ref={canvasRef} id="myChart"></canvas>
            
        </>
    );
}

TransactionChart.propTypes = {
    transactions: PropTypes.array,
    balance: PropTypes.string,
    address: PropTypes.string
}

export default TransactionChart;
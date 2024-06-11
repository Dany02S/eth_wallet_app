import { useEffect, useState } from 'react';
import { getEthereumPrice } from "../services/fetching";


const useEthereumPrices = () => {
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

    return dollarPrices;
};

export default useEthereumPrices;

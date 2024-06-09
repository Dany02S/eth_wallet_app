import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { getEthereumNews } from '../../services/fetching';
import '../../styles/LiveNews.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const LiveNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const news = await getEthereumNews();
            setNews(news.results);
            setLoading(false);
        };

        fetchNews();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="news-slider">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Slider {...settings}>
                    {news.map((article, index) => (
                        <div key={index} className="slide">
                            <div id='detail-nifo'>
                                {article.image_url && <img src={article.image_url} alt="" />}
                                <a href={article.link}>Read full article</a>
                            </div>
                            <div>
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
}

export default LiveNews;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';

const HomePage = () => {
  const [teams, setTeams] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const [teamsResponse, newsResponse] = await Promise.all([
          apiClient.get('/teams'),
          apiClient.get('/news')
        ]);
        setTeams(teamsResponse.data.slice(0, 3));
        setNews(newsResponse.data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  return (
    <div>
      <section 
        className="h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center text-center text-white relative"
        style={{ backgroundImage: `url('https://images.pexels.com/photos/7915228/pexels-photo-7915228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-wider text-text-main"
              style={{ textShadow: '0 0 15px rgba(220, 38, 38, 0.7)' }}>
            TAE E-SPORT By.RIMURU
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-text-secondary">
            ยินดีต้อนรับสู่บ้านอย่างเป็นทางการของ TAE-ESPORT เรามุ่งมั่นสู่ความเป็นเลิศ การทำงานเป็นทีม และการครองความเหนือกว่าคู่แข่ง
          </p>
          <Link to="/teams" className="mt-8 inline-block btn-primary text-lg">
            ดูทีมของเรา
          </Link>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-main">พบกับทีม</h2>
          {loading ? <p className="text-center text-text-secondary">Loading teams...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teams.map((team) => (
                <Link to={`/teams/${team.id}`} key={team.id} className="group">
                  <div className="bg-surface rounded-lg overflow-hidden shadow-lg h-full flex flex-col group-hover:shadow-accent/50 transition-shadow duration-300">
                    <img src={team.logoUrl || 'https://via.placeholder.com/400x200?text=No+Logo'} alt={`${team.name} Logo`} className="w-full h-48 object-contain bg-background p-4"/>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-text-main">{team.name}</h3>
                      <p className="text-sm text-accent font-semibold">{team.game.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-text-main">ข่าวสารล่าสุด</h2>
            {loading ? <p className="text-center text-text-secondary">Loading news...</p> : (
              <div className="space-y-8 max-w-4xl mx-auto">
                {news.map(article => (
                  <Link to={`/news/${article.id}`} key={article.id} className="block group">
                    <div className="bg-background p-6 rounded-lg flex gap-6 group-hover:bg-gray-900 transition-colors">
                      <img src={article.imageUrl || 'https://via.placeholder.com/150'} alt={article.title} className="w-32 h-32 object-cover rounded-md hidden sm:block"/>
                      <div>
                        <p className="text-sm text-text-secondary">{new Date(article.publishedAt).toLocaleDateString()}</p>
                        <h3 className="text-xl font-bold text-text-main mt-1 group-hover:text-accent transition-colors">{article.title}</h3>
                        <p className="text-text-secondary mt-2 text-sm">{article.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <Link to="/news" className="text-accent font-bold text-lg hover:underline">
                ดูข่าวทั้งหมด &rarr;
              </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
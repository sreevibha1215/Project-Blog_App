import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  
  const navigate = useNavigate();
  const { getToken } = useAuth();

  async function getArticles(category = 'all') {
    try {
      const token = await getToken();
      const res = await axios.get(`http://localhost:3000/author-api/articles?category=${category}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.message === 'articles') {
        setArticles(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Error fetching articles');
    }
  }

  function handleCategoryChange(event) {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    getArticles(newCategory); 
  }
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className='container'>
      <div>
        {error && <p className='display-4 text-center mt-5 text-danger'>{error}</p>}
        
        <div className="mb-3">
          <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
          <select 
            id="categoryFilter"
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories</option>
            <option value="programming">Programming</option>
            <option value="AI&ML">AI & ML</option>
            <option value="database">Database</option>
          </select>
        </div>

        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
          {articles.map((articleObj) => (
            <div className='col' key={articleObj.articleId}>
              <div className='card h-100'>
                <div className='card-body'>
                  <div className='author-details text-end'>
                    <img 
                      src={articleObj.authorData.profileImageUrl}
                      width='40px'
                      className='rounded-circle' 
                      alt="" 
                    />
                    <p><small className='text-secondary'>{articleObj.authorData.nameOfAuthor}</small></p>
                  </div>
                  <h5 className='card-title'>{articleObj.title}</h5>
                  <p className='card-text'>{articleObj.content.substring(0, 80) + "...."}</p>
                  <button className='custom-btn btn-4' onClick={() => gotoArticleById(articleObj)}>Read More</button> 
                </div>
                <div className='card-footer'>
                  <small className='text-body-secondary'>Last updated on {articleObj.dateOfModification}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Articles;

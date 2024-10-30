import React, { useState, useEffect } from 'react';
import './App.css';

interface Category {
  id: number;
  name: string;
}

interface Forum {
  id: number;
  name: string;
  categoryId: number;
}

interface Thread {
  id: number;
  forumId: number;
  title: string;
  description: string;
}

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [forums, setForums] = useState<Forum[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedForum, setSelectedForum] = useState<number | null>(null);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);

  // Fetch data from data.json
  useEffect(() => {
    fetch('http://localhost:3000/data')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data.categories);
        setForums(data.forums);
        setThreads(data.threads);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);
  
  
  

  // Filter threads based on selected category and forum
  useEffect(() => {
    if (selectedCategory !== null && selectedForum !== null) {
      const forumIds = forums
        .filter((forum) => forum.categoryId === selectedCategory)
        .map((forum) => forum.id);

      const filtered = threads.filter(
        (thread) =>
          forumIds.includes(thread.forumId) && thread.forumId === selectedForum
      );
      setFilteredThreads(filtered);
    } else {
      setFilteredThreads([]);
    }
  }, [selectedCategory, selectedForum, forums, threads]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Select a Category and Forum</h1>
        
       
        <select
          value={selectedCategory ?? ''}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        
        <select
          value={selectedForum ?? ''}
          onChange={(e) => setSelectedForum(Number(e.target.value))}
          disabled={!selectedCategory}
        >
          <option value="">Select Forum</option>
          {forums
            .filter((forum) => forum.categoryId === selectedCategory)
            .map((forum) => (
              <option key={forum.id} value={forum.id}>
                {forum.name}
              </option>
            ))}
        </select>

        
        <div className="threads">
          <h2>Threads</h2>
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <div key={thread.id} className="thread">
                <h3>{thread.title}</h3>
                <p>{thread.description}</p>
              </div>
            ))
          ) : (
            <p>No threads available for this selection.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

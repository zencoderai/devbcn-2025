import React, { useState, useEffect } from 'react';
import { conferenceApi } from '../services/api';

const Talks = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const response = await conferenceApi.getTalks();
        setTalks(response.data);
      } catch (error) {
        console.error('Error fetching talks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalks();
  }, []);

  const filteredTalks = talks.filter(talk => {
    const matchesSearch = talk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talk.speaker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (talk.tags && talk.tags.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || talk.talk_type === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getTalkTypeColor = (type) => {
    const colors = {
      keynote: 'bg-purple-100 text-purple-800',
      talk: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      lightning: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Conference Talks</h1>
          <p className="text-lg text-gray-600">
            Discover amazing talks from our community of speakers
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({talks.length})
              </button>
              {['keynote', 'talk', 'workshop', 'lightning'].map(type => {
                const count = talks.filter(talk => talk.talk_type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filter === type 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>

            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search talks, speakers, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Talks Grid */}
        {filteredTalks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎤</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No talks found</h3>
            <p className="text-gray-600">
              {talks.length === 0 
                ? "No talks have been submitted yet. Be the first to submit your talk!" 
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTalks.map((talk) => (
              <div key={talk.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTalkTypeColor(talk.talk_type)}`}>
                    {talk.talk_type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getLevelColor(talk.level)}`}>
                    {talk.level}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {talk.duration} min
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {talk.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {talk.description}
                </p>

                <div className="border-t pt-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-semibold text-sm">
                        {talk.speaker_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{talk.speaker_name}</p>
                      {talk.speaker_company && (
                        <p className="text-gray-500 text-xs">{talk.speaker_company}</p>
                      )}
                    </div>
                  </div>

                  {talk.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {talk.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    Submitted {new Date(talk.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Talks;
import React, { useState, useEffect } from 'react';
import { conferenceApi } from '../services/api';

const Talks = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

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

  // Helper function to get duration range
  const getDurationRange = (duration) => {
    if (duration <= 15) return '0-15';
    if (duration <= 30) return '16-30';
    if (duration <= 45) return '31-45';
    if (duration <= 60) return '46-60';
    return '60+';
  };

  // Get all unique tags from talks
  const getAllTags = () => {
    const tagSet = new Set();
    talks.forEach(talk => {
      if (talk.tags) {
        talk.tags.split(',').forEach(tag => {
          tagSet.add(tag.trim());
        });
      }
    });
    return Array.from(tagSet).sort();
  };

  const filteredTalks = talks.filter(talk => {
    const matchesSearch = talk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talk.speaker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (talk.tags && talk.tags.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || talk.talk_type === filter;
    
    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(talk.level);
    
    const matchesDuration = selectedDurations.length === 0 || selectedDurations.includes(getDurationRange(talk.duration));
    
    const matchesTags = selectedTags.length === 0 || (talk.tags && selectedTags.some(tag => 
      talk.tags.split(',').map(t => t.trim()).includes(tag)
    ));
    
    return matchesSearch && matchesFilter && matchesLevel && matchesDuration && matchesTags;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'speaker_name':
        aValue = a.speaker_name.toLowerCase();
        bValue = b.speaker_name.toLowerCase();
        break;
      case 'duration':
        aValue = a.duration;
        bValue = b.duration;
        break;
      case 'level':
        const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        aValue = levelOrder[a.level] || 0;
        bValue = levelOrder[b.level] || 0;
        break;
      case 'created_at':
      default:
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
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

  // Filter handlers
  const handleLevelChange = (level) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleDurationChange = (duration) => {
    setSelectedDurations(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setSelectedLevels([]);
    setSelectedDurations([]);
    setSelectedTags([]);
    setSortBy('created_at');
    setSortOrder('desc');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filter !== 'all') count++;
    if (searchTerm) count++;
    if (selectedLevels.length > 0) count++;
    if (selectedDurations.length > 0) count++;
    if (selectedTags.length > 0) count++;
    return count;
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

        {/* Search and Filter Toggle */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search talks, speakers, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </button>
              
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Talk Type Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Talk Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="talkType"
                      checked={filter === 'all'}
                      onChange={() => setFilter('all')}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">All ({talks.length})</span>
                  </label>
                  {['keynote', 'talk', 'workshop', 'lightning'].map(type => {
                    const count = talks.filter(talk => talk.talk_type === type).length;
                    return (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="talkType"
                          checked={filter === type}
                          onChange={() => setFilter(type)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm capitalize">{type} ({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Level</h3>
                <div className="space-y-2">
                  {['beginner', 'intermediate', 'advanced'].map(level => {
                    const count = talks.filter(talk => talk.level === level).length;
                    return (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level)}
                          onChange={() => handleLevelChange(level)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm capitalize">{level} ({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Duration</h3>
                <div className="space-y-2">
                  {['0-15', '16-30', '31-45', '46-60', '60+'].map(duration => {
                    const count = talks.filter(talk => getDurationRange(talk.duration) === duration).length;
                    return (
                      <label key={duration} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDurations.includes(duration)}
                          onChange={() => handleDurationChange(duration)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm">{duration} min ({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="created_at">Date Submitted</option>
                    <option value="title">Title</option>
                    <option value="speaker_name">Speaker Name</option>
                    <option value="duration">Duration</option>
                    <option value="level">Level</option>
                  </select>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                        sortOrder === 'asc' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Ascending
                    </button>
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                        sortOrder === 'desc' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Descending
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Filter */}
            {getAllTags().length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {getAllTags().map(tag => {
                    const count = talks.filter(talk => 
                      talk.tags && talk.tags.split(',').map(t => t.trim()).includes(tag)
                    ).length;
                    return (
                      <label key={tag} className="flex items-center bg-gray-50 px-3 py-1 rounded-full hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => handleTagChange(tag)}
                          className="mr-2 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm">{tag} ({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredTalks.length} of {talks.length} talks
          </span>
          {getActiveFiltersCount() > 0 && (
            <span>
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
            </span>
          )}
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
                        <button
                          key={index}
                          onClick={() => {
                            if (!selectedTags.includes(tag.trim())) {
                              handleTagChange(tag.trim());
                              setShowFilters(true);
                            }
                          }}
                          className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded hover:bg-primary-50 hover:text-primary-700 transition-colors cursor-pointer"
                          title={`Filter by ${tag.trim()}`}
                        >
                          {tag.trim()}
                        </button>
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
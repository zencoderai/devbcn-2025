import React, { useState, useEffect } from 'react';
import { conferenceApi } from '../services/api';

const Talks = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    talkType: 'all',
    level: 'all',
    duration: 'all',
    approvalStatus: 'all',
    selectedTags: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const response = await conferenceApi.getTalks();
        setTalks(response.data);
        
        // Extract unique tags from all talks
        const allTags = new Set();
        response.data.forEach(talk => {
          if (talk.tags) {
            talk.tags.split(',').forEach(tag => {
              allTags.add(tag.trim());
            });
          }
        });
        setAvailableTags(Array.from(allTags).sort());
      } catch (error) {
        console.error('Error fetching talks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalks();
  }, []);

  const filteredTalks = talks.filter(talk => {
    // Search filter
    const matchesSearch = talk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talk.speaker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (talk.tags && talk.tags.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (talk.speaker_company && talk.speaker_company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Talk type filter
    const matchesTalkType = filters.talkType === 'all' || talk.talk_type === filters.talkType;
    
    // Level filter
    const matchesLevel = filters.level === 'all' || talk.level === filters.level;
    
    // Duration filter
    const matchesDuration = filters.duration === 'all' || (() => {
      const duration = talk.duration;
      switch (filters.duration) {
        case 'short': return duration <= 30;
        case 'medium': return duration > 30 && duration <= 60;
        case 'long': return duration > 60;
        default: return true;
      }
    })();
    
    // Approval status filter
    const matchesApproval = filters.approvalStatus === 'all' || 
                           (filters.approvalStatus === 'approved' && talk.is_approved) ||
                           (filters.approvalStatus === 'pending' && !talk.is_approved);
    
    // Tags filter
    const matchesTags = filters.selectedTags.length === 0 || (() => {
      if (!talk.tags) return false;
      const talkTags = talk.tags.split(',').map(tag => tag.trim());
      return filters.selectedTags.every(selectedTag => 
        talkTags.some(talkTag => talkTag.toLowerCase().includes(selectedTag.toLowerCase()))
      );
    })();
    
    return matchesSearch && matchesTalkType && matchesLevel && matchesDuration && matchesApproval && matchesTags;
  });

  // Helper functions for filter management
  const updateFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleTag = (tag) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      talkType: 'all',
      level: 'all',
      duration: 'all',
      approvalStatus: 'all',
      selectedTags: []
    });
    setSearchTerm('');
  };

  const getFilterCounts = (filterType) => {
    const counts = {};
    talks.forEach(talk => {
      let key;
      switch (filterType) {
        case 'talkType':
          key = talk.talk_type;
          break;
        case 'level':
          key = talk.level;
          break;
        case 'duration':
          const duration = talk.duration;
          if (duration <= 30) key = 'short';
          else if (duration <= 60) key = 'medium';
          else key = 'long';
          break;
        case 'approvalStatus':
          key = talk.is_approved ? 'approved' : 'pending';
          break;
        default:
          return;
      }
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  };

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

        {/* Enhanced Filters and Search */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          {/* Search Bar and Clear Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search talks, speakers, companies, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          {/* Talk Type Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Talk Type</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('talkType', 'all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filters.talkType === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({talks.length})
              </button>
              {['keynote', 'talk', 'workshop', 'lightning'].map(type => {
                const count = getFilterCounts('talkType')[type] || 0;
                return (
                  <button
                    key={type}
                    onClick={() => updateFilter('talkType', type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filters.talkType === type 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('level', 'all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filters.level === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Levels
              </button>
              {['beginner', 'intermediate', 'advanced'].map(level => {
                const count = getFilterCounts('level')[level] || 0;
                return (
                  <button
                    key={level}
                    onClick={() => updateFilter('level', level)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filters.level === level 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Duration</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('duration', 'all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filters.duration === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Durations
              </button>
              {[
                { key: 'short', label: 'Short (≤30 min)' },
                { key: 'medium', label: 'Medium (31-60 min)' },
                { key: 'long', label: 'Long (>60 min)' }
              ].map(({ key, label }) => {
                const count = getFilterCounts('duration')[key] || 0;
                return (
                  <button
                    key={key}
                    onClick={() => updateFilter('duration', key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filters.duration === key 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Approval Status Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('approvalStatus', 'all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filters.approvalStatus === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Status
              </button>
              {[
                { key: 'approved', label: 'Approved' },
                { key: 'pending', label: 'Pending' }
              ].map(({ key, label }) => {
                const count = getFilterCounts('approvalStatus')[key] || 0;
                return (
                  <button
                    key={key}
                    onClick={() => updateFilter('approvalStatus', key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filters.approvalStatus === key 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.selectedTags.includes(tag)
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {filters.selectedTags.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Selected tags: </span>
                  {filters.selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800 mr-1"
                    >
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Results Summary */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredTalks.length} of {talks.length} talks
              {(searchTerm || filters.talkType !== 'all' || filters.level !== 'all' || 
                filters.duration !== 'all' || filters.approvalStatus !== 'all' || 
                filters.selectedTags.length > 0) && (
                <span className="ml-2 text-primary-600">
                  (filtered)
                </span>
              )}
            </p>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    talk.is_approved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {talk.is_approved ? '✓ Approved' : '⏳ Pending'}
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
                          onClick={() => toggleTag(tag.trim())}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            filters.selectedTags.includes(tag.trim())
                              ? 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
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
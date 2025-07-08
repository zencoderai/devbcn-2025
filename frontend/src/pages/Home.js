import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { conferenceApi } from '../services/api';

const Home = () => {
  const [conferenceInfo, setConferenceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConferenceInfo = async () => {
      try {
        const response = await conferenceApi.getConferenceInfo();
        setConferenceInfo(response.data);
      } catch (error) {
        console.error('Error fetching conference info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConferenceInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {conferenceInfo?.name || 'DevBCN 2025'}
            </h1>
            <p className="text-xl md:text-2xl mb-4">
              {conferenceInfo?.theme || 'Building the Future of Technology'}
            </p>
            <p className="text-lg mb-8">
              📅 {conferenceInfo?.date} | 📍 {conferenceInfo?.location}
            </p>
            <div className="space-x-4">
              <Link
                to="/submit"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Submit Your Talk
              </Link>
              <Link
                to="/talks"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-block"
              >
                View Talks
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About the Conference</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {conferenceInfo?.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Expert Speakers</h3>
              <p className="text-gray-600">
                Learn from industry leaders and experienced developers sharing their knowledge and insights.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Networking</h3>
              <p className="text-gray-600">
                Connect with like-minded developers, share experiences, and build lasting professional relationships.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Discover the latest technologies, tools, and methodologies shaping the future of development.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-gray-600">{conferenceInfo?.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <p className="font-semibold">Venue</p>
                    <p className="text-gray-600">{conferenceInfo?.venue}</p>
                    <p className="text-gray-600">{conferenceInfo?.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👥</span>
                  <div>
                    <p className="font-semibold">Capacity</p>
                    <p className="text-gray-600">{conferenceInfo?.capacity} attendees</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Call for Papers</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">
                  We're looking for passionate speakers to share their knowledge and experience with our community.
                </p>
                <p className="font-semibold text-primary-600 mb-4">
                  Deadline: {conferenceInfo?.call_for_papers_deadline}
                </p>
                <Link
                  to="/submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block"
                >
                  Submit Your Proposal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
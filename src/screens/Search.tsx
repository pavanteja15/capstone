import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import { mapMediaPath } from "../utils/userMapper";
import "./Search.css";

const API_BASE_URL = "http://localhost:8765";

type Pin = {
  id: number;
  imageUrl?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  userName?: string;
  userFullname?: string;
  userProfilePath?: string;
  userId?: number;
  boardId?: number;
  boardTitle?: string;
};

type Board = {
  id: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  pinCount: number;
  ownerId: number;
  ownerName?: string;
  ownerAvatar?: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  accountType?: string;
  businessName?: string;
  websiteUrl?: string;
  followers?: number;
  isFollowing?: boolean;
};

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pins' | 'boards' | 'people'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [pins, setPins] = useState<Pin[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch search results from API
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setPins([]);
        setBoards([]);
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(`${API_BASE_URL}/search`, {
          params: { q: query }
        });

        const data = response.data;
        setPins(data.pins || []);
        setBoards(data.boards || []);
        setUsers(data.users || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handlePinClick = (pin: Pin) => {
    const imageMedia = mapMediaPath(pin.imageUrl, API_BASE_URL);
    const videoMedia = mapMediaPath(pin.videoUrl, API_BASE_URL);
    
    navigate("/viewpin", {
      state: {
        pin: {
          id: pin.id,
          image: imageMedia,
          videoUrl: videoMedia,
          title: pin.title || "Pin",
          description: pin.description || "Check out this pin!",
          userId: pin.userId,
          userName: pin.userName,
          userFullname: pin.userFullname,
          userProfilePath: pin.userProfilePath,
          boardId: pin.boardId,
          boardTitle: pin.boardTitle
        }
      }
    });
  };

  const handleBoardClick = (board: Board) => {
    navigate("/viewboard", {
      state: {
        board: {
          id: board.id,
          title: board.title,
          description: board.description,
          coverImageUrl: board.coverImageUrl,
          pinCount: board.pinCount,
          ownerId: board.ownerId
        },
        isOwner: false
      }
    });
  };

  const handleUserClick = (user: User) => {
    navigate("/viewprofile", {
      state: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: mapMediaPath(user.avatar, API_BASE_URL),
          accountType: user.accountType,
          businessName: user.businessName,
          websiteUrl: user.websiteUrl
        }
      }
    });
  };

  const handleFollowToggle = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ));
  };

  const totalResults = pins.length + boards.length + users.length;

  const filters = [
    { key: 'all', label: 'All', count: totalResults },
    { key: 'pins', label: 'Pins', count: pins.length },
    { key: 'boards', label: 'Boards', count: boards.length },
    { key: 'people', label: 'People', count: users.length },
  ];

  return (
    <div className="search-page">
      <SideNav openCreateMenu={() => setShowMenu(true)} />
      <TopNav />
      {showMenu && <CreateMenu closeMenu={() => setShowMenu(false)} />}

      <div className="search-content">
        {/* Search Header */}
        <div className="search-header">
          <h1 className="search-title">
            {query ? `Results for "${query}"` : 'Search Pinterest'}
          </h1>
          {!isLoading && query && (
            <p className="search-count">{totalResults} results found</p>
          )}
        </div>

        {/* Filter Tabs */}
        {query && (
          <div className="search-filters">
            {filters.map(filter => (
              <button
                key={filter.key}
                className={`search-filter ${activeFilter === filter.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.key as any)}
              >
                {filter.label}
                {filter.count > 0 && <span className="filter-count">{filter.count}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="search-error">
            <p>{error}</p>
          </div>
        )}

        {/* No Query State */}
        {!query && !isLoading && (
          <div className="search-empty">
            <div className="search-empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#767676">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <h2>Search for ideas</h2>
            <p>Type something in the search bar to find pins, boards, and people</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && query && !error && (
          <div className="search-results">
            {/* People Section */}
            {(activeFilter === 'all' || activeFilter === 'people') && users.length > 0 && (
              <div className="search-section">
                <h2 className="section-title">People</h2>
                <div className="search-people-grid">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      className="search-user-card"
                      onClick={() => handleUserClick(user)}
                    >
                      <img 
                        src={mapMediaPath(user.avatar, API_BASE_URL) || "/assets/images/profilepic1.jpg"} 
                        alt={user.name} 
                        className="search-user-avatar" 
                      />
                      <div className="search-user-info">
                        <h3 className="search-user-name">{user.name}</h3>
                        <p className="search-user-username">@{user.username}</p>
                        {user.accountType === 'BUSINESS' && user.businessName && (
                          <p className="search-user-business">{user.businessName}</p>
                        )}
                      </div>
                      <button 
                        className={`search-follow-btn ${user.isFollowing ? 'following' : ''}`}
                        onClick={(e) => handleFollowToggle(user.id, e)}
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Boards Section */}
            {(activeFilter === 'all' || activeFilter === 'boards') && boards.length > 0 && (
              <div className="search-section">
                <h2 className="section-title">Boards</h2>
                <div className="search-boards-grid">
                  {boards.map(board => (
                    <div 
                      key={board.id} 
                      className="search-board-card"
                      onClick={() => handleBoardClick(board)}
                    >
                      <div className="search-board-cover">
                        <img 
                          src={mapMediaPath(board.coverImageUrl, API_BASE_URL) || "/assets/images/nine.jpg"} 
                          alt={board.title} 
                        />
                      </div>
                      <div className="search-board-info">
                        <h3 className="search-board-name">{board.title}</h3>
                        <div className="search-board-meta">
                          {board.ownerAvatar && (
                            <img 
                              src={mapMediaPath(board.ownerAvatar, API_BASE_URL) || "/assets/images/profilepic1.jpg"} 
                              alt={board.ownerName || "Owner"} 
                              className="search-board-owner-avatar" 
                            />
                          )}
                          {board.ownerName && (
                            <span className="search-board-owner">{board.ownerName}</span>
                          )}
                          <span className="search-board-pins">{board.pinCount || 0} Pins</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pins Section */}
            {(activeFilter === 'all' || activeFilter === 'pins') && pins.length > 0 && (
              <div className="search-section">
                <h2 className="section-title">Pins</h2>
                <div className="search-pins-masonry">
                  {pins.map(pin => (
                    <div 
                      key={pin.id} 
                      className="search-pin-card"
                      onClick={() => handlePinClick(pin)}
                    >
                      {pin.videoUrl ? (
                        <video
                          src={mapMediaPath(pin.videoUrl, API_BASE_URL) || ""}
                          className="search-pin-video"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                        />
                      ) : (
                        <img 
                          src={mapMediaPath(pin.imageUrl, API_BASE_URL) || "/assets/images/one.jpg"} 
                          alt={pin.title || "Pin"} 
                          className="search-pin-image" 
                        />
                      )}
                      <div className="search-pin-overlay">
                        <button className="search-pin-save-btn" onClick={(e) => e.stopPropagation()}>
                          Save
                        </button>
                      </div>
                      {pin.title && (
                        <div className="search-pin-info">
                          <p className="search-pin-title">{pin.title}</p>
                          {(pin.userFullname || pin.userName) && (
                            <div className="search-pin-user">
                              <img 
                                src={mapMediaPath(pin.userProfilePath, API_BASE_URL) || "/assets/images/profilepic1.jpg"} 
                                alt={pin.userFullname || pin.userName || "User"} 
                              />
                              <span>{pin.userFullname || pin.userName}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results for search query */}
            {totalResults === 0 && (
              <div className="search-empty">
                <div className="search-empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="#767676">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
                <h2>No results found for "{query}"</h2>
                <p>Try different keywords or check your spelling</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

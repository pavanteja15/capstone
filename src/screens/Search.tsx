import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SideNav from "../components/global/SideNav";
import TopNav from "../components/global/TopNav";
import CreateMenu from "../components/global/CreateMenu";
import "./Search.css";

type Pin = {
  id: number;
  img: string;
  title: string;
  userName: string;
  userAvatar: string;
};

type Board = {
  id: number;
  name: string;
  cover: string;
  pinCount: number;
  ownerName: string;
  ownerAvatar: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  isFollowing: boolean;
};

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pins' | 'boards' | 'people'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Sample pins data - expanded with more content
  const allPins: Pin[] = [
    { id: 1, img: "/assets/images/one.jpg", title: "Beautiful sunset landscape", userName: "Sophia Chen", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 2, img: "/assets/images/two.jpg", title: "Modern interior design", userName: "Alex Johnson", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 3, img: "/assets/images/three.jpg", title: "Street style fashion", userName: "Emma Wilson", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 4, img: "/assets/images/four.jpg", title: "Abstract art painting", userName: "Michael Brown", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 5, img: "/assets/images/five.jpg", title: "Delicious homemade pasta", userName: "Sarah Davis", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 6, img: "/assets/images/seven.jpg", title: "Nature photography", userName: "David Lee", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 7, img: "/assets/images/eight.jpg", title: "Architecture details", userName: "Lisa Wang", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 8, img: "/assets/images/nine.jpg", title: "Travel destinations", userName: "James Miller", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 9, img: "/assets/images/one.jpg", title: "Minimalist home decor", userName: "Anna Taylor", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 10, img: "/assets/images/two.jpg", title: "DIY crafts ideas", userName: "Chris Martin", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 11, img: "/assets/images/three.jpg", title: "Summer outfit inspiration", userName: "Olivia Brown", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 12, img: "/assets/images/four.jpg", title: "Digital artwork collection", userName: "Ryan Garcia", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 13, img: "/assets/images/five.jpg", title: "Healthy breakfast recipes", userName: "Emily White", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 14, img: "/assets/images/seven.jpg", title: "Mountain hiking trails", userName: "Jake Wilson", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 15, img: "/assets/images/eight.jpg", title: "Urban photography tips", userName: "Mia Johnson", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 16, img: "/assets/images/nine.jpg", title: "Beach vacation vibes", userName: "Noah Davis", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 17, img: "/assets/images/one.jpg", title: "Cozy living room ideas", userName: "Ava Martinez", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 18, img: "/assets/images/two.jpg", title: "Wedding decoration inspo", userName: "Liam Anderson", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 19, img: "/assets/images/three.jpg", title: "Winter fashion trends", userName: "Isabella Thomas", userAvatar: "/assets/images/profilepic1.jpg" },
    { id: 20, img: "/assets/images/four.jpg", title: "Watercolor techniques", userName: "Mason Lee", userAvatar: "/assets/images/profilepic1.jpg" },
  ];

  // Sample boards data - expanded
  const allBoards: Board[] = [
    { id: 1, name: "Travel Dreams", cover: "/assets/images/one.jpg", pinCount: 45, ownerName: "Sophia Chen", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 2, name: "Home Decor Ideas", cover: "/assets/images/two.jpg", pinCount: 32, ownerName: "Alex Johnson", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 3, name: "Fashion Inspiration", cover: "/assets/images/three.jpg", pinCount: 28, ownerName: "Emma Wilson", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 4, name: "Art & Design", cover: "/assets/images/four.jpg", pinCount: 56, ownerName: "Michael Brown", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 5, name: "Recipes Collection", cover: "/assets/images/five.jpg", pinCount: 19, ownerName: "Sarah Davis", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 6, name: "Photography Tips", cover: "/assets/images/seven.jpg", pinCount: 38, ownerName: "David Lee", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 7, name: "Architecture Wonders", cover: "/assets/images/eight.jpg", pinCount: 24, ownerName: "Lisa Wang", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 8, name: "Nature Escapes", cover: "/assets/images/nine.jpg", pinCount: 67, ownerName: "James Miller", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 9, name: "DIY Projects", cover: "/assets/images/one.jpg", pinCount: 41, ownerName: "Anna Taylor", ownerAvatar: "/assets/images/profilepic1.jpg" },
    { id: 10, name: "Fitness Motivation", cover: "/assets/images/two.jpg", pinCount: 52, ownerName: "Chris Martin", ownerAvatar: "/assets/images/profilepic1.jpg" },
  ];

  // Sample users data - expanded
  const allUsers: User[] = [
    { id: 1, name: "Sophia Chen", username: "sophiachen", avatar: "/assets/images/profilepic1.jpg", followers: 12500, isFollowing: false },
    { id: 2, name: "Alex Johnson", username: "alexj", avatar: "/assets/images/profilepic1.jpg", followers: 8900, isFollowing: true },
    { id: 3, name: "Emma Wilson", username: "emmaw", avatar: "/assets/images/profilepic1.jpg", followers: 25600, isFollowing: false },
    { id: 4, name: "Michael Brown", username: "mikebrown", avatar: "/assets/images/profilepic1.jpg", followers: 4200, isFollowing: false },
    { id: 5, name: "Sarah Davis", username: "sarahd", avatar: "/assets/images/profilepic1.jpg", followers: 15800, isFollowing: true },
    { id: 6, name: "David Lee", username: "davidlee", avatar: "/assets/images/profilepic1.jpg", followers: 9300, isFollowing: false },
    { id: 7, name: "Lisa Wang", username: "lisawang", avatar: "/assets/images/profilepic1.jpg", followers: 31200, isFollowing: true },
    { id: 8, name: "James Miller", username: "jamesmiller", avatar: "/assets/images/profilepic1.jpg", followers: 7600, isFollowing: false },
    { id: 9, name: "Anna Taylor", username: "annataylor", avatar: "/assets/images/profilepic1.jpg", followers: 18900, isFollowing: false },
    { id: 10, name: "Chris Martin", username: "chrismartin", avatar: "/assets/images/profilepic1.jpg", followers: 22400, isFollowing: true },
  ];

  // Show all content when no query, or filter based on query
  const displayPins = query 
    ? allPins.filter(pin => 
        pin.title.toLowerCase().includes(query.toLowerCase()) ||
        pin.userName.toLowerCase().includes(query.toLowerCase())
      )
    : allPins;

  const displayBoards = query 
    ? allBoards.filter(board => 
        board.name.toLowerCase().includes(query.toLowerCase()) ||
        board.ownerName.toLowerCase().includes(query.toLowerCase())
      )
    : allBoards;

  const displayUsersFiltered = query 
    ? allUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      )
    : allUsers;

  const [users, setUsers] = useState<User[]>(displayUsersFiltered);

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setUsers(displayUsersFiltered);
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
    navigate("/viewpin", {
      state: {
        pin: {
          image: pin.img,
          title: pin.title,
          description: "Check out this amazing pin!",
          likes: Math.floor(Math.random() * 500) + 50,
          userName: pin.userName,
          userProfile: pin.userAvatar
        }
      }
    });
  };

  const handleBoardClick = (board: Board) => {
    navigate("/viewboard", {
      state: {
        board: {
          name: board.name,
          cover: board.cover,
          description: `${board.ownerName}'s ${board.name} collection`,
          pins: []
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
          avatar: user.avatar,
          bio: "Creative designer sharing inspiration",
          followers: user.followers,
          following: Math.floor(Math.random() * 500) + 100,
          isFollowing: user.isFollowing
        }
      }
    });
  };

  const handleFollowToggle = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing, followers: user.isFollowing ? user.followers - 1 : user.followers + 1 }
        : user
    ));
  };

  const totalResults = displayPins.length + displayBoards.length + users.length;

  const filters = [
    { key: 'all', label: 'All', count: totalResults },
    { key: 'pins', label: 'Pins', count: displayPins.length },
    { key: 'boards', label: 'Boards', count: displayBoards.length },
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
            {query ? `Results for "${query}"` : 'Discover'}
          </h1>
          {!isLoading && (
            <p className="search-count">{totalResults} items to explore</p>
          )}
        </div>

        {/* Filter Tabs */}
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

        {/* Loading State */}
        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}

        {/* Results - Always show content */}
        {!isLoading && (
          <div className="search-results">
            {/* People Section */}
            {(activeFilter === 'all' || activeFilter === 'people') && users.length > 0 && (
              <div className="search-section">
                <h2 className="section-title">People to Follow</h2>
                <div className="search-people-grid">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      className="search-user-card"
                      onClick={() => handleUserClick(user)}
                    >
                      <img src={user.avatar} alt={user.name} className="search-user-avatar" />
                      <div className="search-user-info">
                        <h3 className="search-user-name">{user.name}</h3>
                        <p className="search-user-username">@{user.username}</p>
                        <p className="search-user-followers">{formatCount(user.followers)} followers</p>
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
            {(activeFilter === 'all' || activeFilter === 'boards') && displayBoards.length > 0 && (
              <div className="search-section">
                <h2 className="section-title">Boards</h2>
                <div className="search-boards-grid">
                  {displayBoards.map(board => (
                    <div 
                      key={board.id} 
                      className="search-board-card"
                      onClick={() => handleBoardClick(board)}
                    >
                      <div className="search-board-cover">
                        <img src={board.cover} alt={board.name} />
                      </div>
                      <div className="search-board-info">
                        <h3 className="search-board-name">{board.name}</h3>
                        <div className="search-board-meta">
                          <img src={board.ownerAvatar} alt={board.ownerName} className="search-board-owner-avatar" />
                          <span className="search-board-owner">{board.ownerName}</span>
                          <span className="search-board-pins">{board.pinCount} Pins</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pins Section */}
            {(activeFilter === 'all' || activeFilter === 'pins') && displayPins.length > 0 && (
              <div className="search-section">
                <h2 className="section-title">Pins</h2>
                <div className="search-pins-masonry">
                  {displayPins.map(pin => (
                    <div 
                      key={pin.id} 
                      className="search-pin-card"
                      onClick={() => handlePinClick(pin)}
                    >
                      <img src={pin.img} alt={pin.title} className="search-pin-image" />
                      <div className="search-pin-overlay">
                        <button className="search-pin-save-btn" onClick={(e) => e.stopPropagation()}>
                          Save
                        </button>
                      </div>
                      <div className="search-pin-info">
                        <p className="search-pin-title">{pin.title}</p>
                        <div className="search-pin-user">
                          <img src={pin.userAvatar} alt={pin.userName} />
                          <span>{pin.userName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results for search query */}
            {query && totalResults === 0 && (
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

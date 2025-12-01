import React, { useEffect, useState } from "react";
import axios from "axios";
import "./explore.css";

const API_BASE_URL = "http://localhost:8765";

// Map category names to images
const categoryImages: Record<string, string> = {
    "Travel": "/categorys/nature.jpeg",
    "Food": "/categorys/food.jpeg",
    "Fitness": "/categorys/fitness.jpeg",
    "Technology": "/categorys/design.jpeg",
    "Fashion": "/categorys/fashion.jpeg",
    "Photography": "/categorys/art.jpeg",
    "DIY": "/categorys/homedecor.jpeg",
    "Motivation": "/categorys/quotes.jpeg",
    "Art": "/categorys/art.jpeg",
    "Music": "/categorys/music.jpeg",
    "Gaming": "/categorys/gaming.jpeg",
    "Beauty": "/categorys/beauty.jpeg",
    "Home Decor": "/categorys/homedecor.jpeg",
    "Nature": "/categorys/nature.jpeg",
    "Sports": "/categorys/fitness.jpeg",
    "Education": "/categorys/design.jpeg",
    "Lifestyle": "/categorys/fashion.jpeg",
    "Business": "/categorys/design.jpeg",
};

const defaultImage = "/categorys/art.jpeg";

interface CategoryGridProps {
    onCategorySelect: (category: string | null) => void;
    selectedCategory: string | null;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect, selectedCategory }) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get<string[]>(`${API_BASE_URL}/categories`);
                console.log("Categories fetched:", data);
                if (data && data.length > 0) {
                    setCategories(data);
                } else {
                    // Fallback to all categories if empty response
                    setCategories([
                        "Travel", "Food", "Fitness", "Technology", "Fashion", "Photography", 
                        "DIY", "Motivation", "Art", "Music", "Gaming", "Beauty", 
                        "Home Decor", "Nature", "Sports", "Education", "Lifestyle", "Business"
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                // Fallback categories - include ALL categories
                setCategories([
                    "Travel", "Food", "Fitness", "Technology", "Fashion", "Photography", 
                    "DIY", "Motivation", "Art", "Music", "Gaming", "Beauty", 
                    "Home Decor", "Nature", "Sports", "Education", "Lifestyle", "Business"
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            onCategorySelect(null); // Deselect if clicking the same category
        } else {
            onCategorySelect(category);
        }
    };

    if (loading) {
        return (
            <div className="container p-4">
                <h3 className="fw-bold mb-4">Browse by category</h3>
                <div className="text-center py-4">Loading categories...</div>
            </div>
        );
    }

    return (
        <div className="container p-4">
            <div className="explore-category-header">
                <h3 className="fw-bold mb-0">Browse by category</h3>
                {selectedCategory && (
                    <button 
                        className="explore-clear-filter-btn"
                        onClick={() => onCategorySelect(null)}
                    >
                        Clear filter: {selectedCategory} ✕
                    </button>
                )}
            </div>
            <div className="row g-4 mt-2">
                {categories.map((cat) => (
                    <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={cat}>
                        <div 
                            className={`explore-category-card position-relative ${selectedCategory === cat ? 'selected' : ''}`}
                            style={{ backgroundImage: `url(${categoryImages[cat] || defaultImage})` }}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            <div className="explore-category-overlay"></div>
                            <h5 className="explore-category-title text-white fw-bold">{cat}</h5>
                            {selectedCategory === cat && (
                                <div className="explore-category-selected-badge">✓</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryGrid;

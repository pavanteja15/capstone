
import React, { useState } from "react";

import CategoryGrid from "../components/explore/category";
import Explorepins from "../components/explore/pins";

const Explore = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <>
            <CategoryGrid 
                onCategorySelect={setSelectedCategory} 
                selectedCategory={selectedCategory} 
            />
            <Explorepins selectedCategory={selectedCategory} />
        </>
    );
};

export default Explore;


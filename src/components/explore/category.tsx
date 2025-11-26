
import React from "react";

import "./explore.css"


 

const   CategoryGrid = ()=>{


 

    const categories = [

        {

            title: "Animals",

            image: "/categorys/animals.jpeg"

        },{

            title: "Anime",

            image: "/categorys/anime.jpeg"

        },{

            title: "Art",

            image: "/categorys/art.jpeg"

        },{

            title: "Beauty",

            image: "/categorys/beauty.jpeg"

        },{

            title: "Design",

            image: "/categorys/design.jpeg"

        },{

            title: "Fashion",

            image: "/categorys/fashion.jpeg"

        },{

            title: "Food",

            image: "/categorys/food.jpeg"

        },{

            title: "Home Decor",

            image: "/categorys/homedecor.jpeg"

        },{

            title: "Nature",

            image: "/categorys/nature.jpeg"

        },{

            title: "Quotes",

            image: "/categorys/quotes.jpeg"

        },

    ]


 

    return(

        <div className="container p-4">

            <h3 className="fw-bold mb-4">Browse by category</h3>

            <div className="row g-4">

                {categories.map((cat)=>(

                    <div className="col-12 col-sm-6 col-md-4" key={cat.title}>

                        <div className="explore-category-card position-relative" style={{backgroundImage:`url(${cat.image})`}}>

                            <div className="explore-category-overlay"></div>

                            <h5 className="explore-category-title text-white fw-bold">{cat.title}</h5>

                        </div>

                    </div>

                ))};

            </div>

        </div>

    )

}


 

export default CategoryGrid;


import React from "react";

import "./explore.css"


 

const   CategoryGrid = ()=>{


 

    const categories = [

        {

            title: "Animals",

            image: "assets/categorys/Animals.webp"

        },{

            title: "Anime",

            image: "assets/categorys/anime.webp"

        },{

            title: "Art",

            image: "assets/categorys/art.webp"

        },{

            title: "Beauty",

            image: "assets/categorys/beauty.webp"

        },{

            title: "Design",

            image: "assets/categorys/Design.webp"

        },{

            title: "Fashion",

            image: "assets/categorys/fashion.webp"

        },{

            title: "Food",

            image: "assets/categorys/food.webp"

        },{

            title: "Home Decor",

            image: "assets/categorys/homedecor.webp"

        },{

            title: "Nature",

            image: "assets/categorys/nature.webp"

        },{

            title: "Quotes",

            image: "assets/categorys/quotes.webp"

        },

    ]


 

    return(

        <div className="container p-4">

            <h3 className="fw-bold mb-4">Browse by category</h3>

            <div className="row g-4">

                {categories.map((cat)=>(

                    <div className="col-12 col-sm-6 col-md-4" key={cat.title}>

                        <div className="category-card position-relative" style={{backgroundImage:`url(${cat.image})`}}>

                            <div className="overlay"></div>

                            <h5 className="title text-white fw-bold">{cat.title}</h5>

                        </div>

                    </div>

                ))};

            </div>

        </div>

    )

}


 

export default CategoryGrid;

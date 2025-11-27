
import { useState } from "react";

import { useNavigate, useLocation, Link } from "react-router-dom";

import "./CreatePin.css";

type Board = {
  id: number;
  title: string;
  coverImg: string;
};

const availableBoards: Board[] = [
  { id: 1, title: "Travel Ideas", coverImg: "/assets/images/nine.jpg" },
  { id: 2, title: "Recipes", coverImg: "/assets/images/eleven.jpg" },
  { id: 3, title: "Workout", coverImg: "/assets/images/twelve.jpg" },
  { id: 4, title: "Home Decor", coverImg: "/assets/images/one.jpg" },
  { id: 5, title: "Fashion", coverImg: "/assets/images/two.jpg" },
];

 

export default function CreatePin(){


 

    const navigate = useNavigate();

    const location = useLocation();

    const selectedBoardFromPage = location.state?.boardName||"";


 

     const [coverImage, setCoverImage] = useState<File | null>(null);

        const [boardName, setBoardName] = useState("");

        const [description, setDescription] = useState("");
   
        const [showBoardPicker, setShowBoardPicker] = useState(false);
        const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

        // const [isSecret, setIsSecret] = useState(false);

   

        const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

            if (e.target.files && e.target.files[0]) {

                setCoverImage(e.target.files[0]);

            }

        };

        const handleSelectBoard = (board: Board) => {
            setSelectedBoard(board);
            setShowBoardPicker(false);
        };

   


 

    const [title ,setTitle] = useState("");

    const[desc, setDesc] = useState("");

    const[link, setLink] = useState("");


 

    const[showProducts, setShowProducts] = useState(false);

    const[productText,setProductText] = useState("");

    const[products,setPoducts] = useState<String[]>([]);


 

    const[keywordText,setKeywordText] = useState("");

    const[keywords,setKeywords] = useState<String[]>([]);

    const[showKeywords,setShowKeywords] = useState(false);

   


 

    const[showTopics, setShowTopics] = useState(false);

    const topicOption:string[] =[

        "Travel",

        "Food",

        "Fitness",

        "technology",

        "Fashion",

        "Photography",

        "DIY",

        "Motivation"

    ];

    const[selectedTopics, setSelectedTopics] = useState<String[]>([]);


 

    const addProduct = ()=>{

        if(productText.trim() !== ""){

            setPoducts(prev=>[...prev,productText.trim()]);

            setProductText("");

        }

    };

    const addKeyWords = ()=>{

        if(keywordText.trim() !== ""){

            setKeywords(x=>[...x,keywordText.trim()]);

            setKeywordText("");

        }

    };

    // const deleteProject =(name: string)=>{

    //     setPoducts(prev=>prev.filter(p=>p !== name));

    // };

    const deleteProduct = (index:number)=>{

        setPoducts(prev=>prev.filter((_,i)=> i!== index));

    }

    const deleteKeyword = (index:number)=>{

        setKeywords(keywords.filter((_,i)=> i!== index));

    }


 

    return(

        <div className="pin-container">

        <header className="pin-header">

            <span className="back">{`<`}</span>

            <h3> Create Pin</h3>

        </header>


 

        <div className="cb-cover-box">

                <label className="cb-cover-label">

                    {coverImage ? (

                        <img

                            src={URL.createObjectURL(coverImage)}

                            alt="Cover"

                            className="cb-cover-preview"

                        />

                    ) : (

                        <span className="cb-cover-text"> Upload Image</span>

                    )}

                    <input

                        type="file"

                        accept="image/*"

                        onChange={handleCoverUpload}

                        className="cb-hidden-input"

                    />

                </label>

            </div>

       

        <div className="form-section">

            <div className="input-box">

                <label>Title</label>

                <textarea

                 placeholder="Tell everyone what your Pin is about "

                 maxLength={100}

                 value ={title}

                 onChange={e=>setTitle(e.target.value)}/>

                 <span className="count">{title.length}/100</span>

            </div>


 

            <div className="input-box">

                <label>Description</label>

                <textarea

                  placeholder="Add a description, mention, or hashtages to your Pin."

                  value ={desc}

                  onChange={e=>setDesc(e.target.value)}/>


 

            </div>

            <div className="input-box">

                <label> Link</label>

                <input  

                  type = "text"

                  placeholder="Link"

                  value={link}

                  onChange={e=>setLink(e.target.value)}/>

            </div>

<div className="section-row" onClick={() => setShowBoardPicker(prev => !prev)}>
                <span>Pick a board</span>
                <span className="right">
                    {selectedBoard ? selectedBoard.title : "Select"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#767676" style={{ marginLeft: 8 }}>
                        <path d="M7 10l5 5 5-5z"/>
                    </svg>
                </span>
            </div>

            {showBoardPicker && (
                <div className="board-picker-dropdown">
                    <div className="board-picker-header">
                        <span>Your boards</span>
                        <button className="create-new-board-btn" onClick={() => navigate("/create-board")}>
                            + Create board
                        </button>
                    </div>
                    <div className="board-picker-list">
                        {availableBoards.map((board) => (
                            <div 
                                key={board.id} 
                                className={`board-picker-item ${selectedBoard?.id === board.id ? 'selected' : ''}`}
                                onClick={() => handleSelectBoard(board)}
                            >
                                <img src={board.coverImg} alt={board.title} className="board-picker-img" />
                                <span className="board-picker-title">{board.title}</span>
                                {selectedBoard?.id === board.id && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#e60023" className="board-picker-check">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedBoardFromPage && !selectedBoard && (

                <div className="selected-board-dispaly">{selectedBoardFromPage}</div>

            )}

            <div className="section-row" onClick ={()=>setShowTopics(prev=>!prev)}>

                <span> Tag related topics</span>

                <span className="right"></span>

            </div>

            {showTopics && (

                <div className="topics-dropdown">

                    {

                        topicOption.map((topic,index)=>(

                            <div

                            key ={index}

                            className="topic-option"

                            onClick={()=>{

                                if(!selectedTopics.includes(topic)){

                                    setSelectedTopics([...selectedTopics,topic]);

                                }

                            }}

                            >

                                {topic}

                                </div>

                        ))}

                        <div className="chip-container">

                            {selectedTopics.map((topic,index)=>(

                                <div key ={index} className="chip">

                                    <span> {topic}</span>

                                    <span className="chip-close" onClick={()=>

                                        setSelectedTopics(selectedTopics.filter((t)=>t !==topic))

                                    }>x</span>

                                    </div>

                            ))}

                            </div>

                            </div>

                           

            )}

            <div className="section-row" onClick={()=>setShowProducts(prev => !prev)}>

                <span> Tag products</span>

                <span className="right"></span>

            </div>


 

            {showProducts && (

                <div className="product-box">

                    <div className="product-input-area">

                        <input

                        className="product-search"

                        type="text"

                        placeholder="Search products"

                        value={productText}

                        onChange={(e)=>setProductText(e.target.value)}/>

                        <button className ="add-btn" onClick={addProduct}>Add</button>

                    </div>

                    <div className="chip-container">

                        {products.map((p:String, index:number)=>(

                            <div key ={index} className="chip">

                                <span>{p}</span>

                                <span className="chip-close" onClick={()=>deleteProduct(index)}>x</span>

                            </div>

                        ))}

                    </div>

                </div>

            )}

           

            <div className="section-row" onClick={()=>setShowKeywords(x =>!x)}>

                <span>Keywords</span>

                <span className="right"></span>

            </div>

            {showKeywords && (

                <div className="product-box">

                    <div className="product-input-area">

                        <input

                        className="product-search"

                        type="text"

                        placeholder="Search Keywords"

                        value={keywordText}

                        onChange={(e)=>setKeywordText(e.target.value)}/>

                        <button className ="add-btn" onClick={addKeyWords}>Add</button>

                    </div>

                    <div className="chip-container">

                        {keywords.map((k:String, index:number)=>(

                            <div key ={index} className="chip">

                                <span>{k}</span>

                                <span className="chip-close" onClick={()=>deleteKeyword(index)}>x</span>

                            </div>

                        ))}

                    </div>

                </div>          

            )}

           

        </div>          

            <footer className="pin-footer">

                <div className="bottom-btns">

                    <button className="btn icon">File</button>

                    <button className="btn icon">Download</button>

                </div>

                <button className="btn create">Create</button>

            </footer>            

        </div>        

    )

}
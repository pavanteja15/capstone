
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./CreateBoard.css";


 

const CreateBoardForm: React.FC = () => {

    const [coverImage, setCoverImage] = useState<File | null>(null);

    const [boardName, setBoardName] = useState("");

    const [description, setDescription] = useState("");


 

    const [isSecret, setIsSecret] = useState(false);


 

    const navigate = useNavigate();


 

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {

            setCoverImage(e.target.files[0]);

        }

    };


 

    const isCreateEnabled = boardName.trim().length > 0;


 

    return (

        <div className="cb-container">


 

            {/* ---------- TOP BAR ---------- */}

            <div className="cb-top-bar">

                <button className="cb-close-btn" onClick={()=>navigate("/select-board")}>✕</button>


 

                <h2 className="cb-title">Create board</h2>


 

                <button

                    disabled={!isCreateEnabled}

                    className={`cb-create-top-btn ${isCreateEnabled ? "active" : "disabled"}`}

                >

                    Create

                </button>

            </div>


 

            {/* ---------- COVER IMAGE ---------- */}

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


 

            {/* ---------- BOARD NAME ---------- */}

            <div className="cb-input-wrapper">

                <label className="cb-label">Board name</label>

                <input

                    type="text"

                    placeholder="Name your board"

                    maxLength={50}

                    value={boardName}

                    onChange={(e) => setBoardName(e.target.value)}

                    className="cb-input"

                />

                <span className="cb-counter">{boardName.length}/50</span>

            </div>


 

            {/* ---------- DESCRIPTION ---------- */}

            <div className="cb-input-wrapper">

                <label className="cb-label">Description</label>

                <textarea

                    placeholder="Describe your board"

                    maxLength={100}

                    value={description}

                    onChange={(e) => setDescription(e.target.value)}

                    className="cb-textarea"

                />

                <span className="cb-counter">{description.length}/100</span>

            </div>



            <div className="form-group toggle-column">

                <div className="toggle-header">

                <label className="toggle-title">Make this board secret</label>

                <label className="switch">

                    <input

                        type="checkbox"

                        checked={isSecret}

                        onChange={(e) => setIsSecret(e.target.checked)}

                    />

                    <span className="slider round"></span>

                </label>


 

            </div>

            <p className="toggle-description">Only you and collaborators will see this board</p>

          </div>

            {/* ---------- COLLABORATORS ---------- */}

            <div className="cb-collab-row">

                <div className="cb-collab-texts">

                    <div className="cb-toggle-title">Collaborators</div>

                    <div className="cb-toggle-sub">Invite collaborators to join</div>

                </div>


 

                <button className="cb-add-user-btn">👤➕</button>

            </div>


 

        </div>

    );

};


 

export default CreateBoardForm;




 
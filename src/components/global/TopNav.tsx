
import React, { FC, useState, KeyboardEvent } from "react";

import { Navbar, Form, FormControl, Dropdown, Image } from "react-bootstrap";

import './topnav.css';

import { useNavigate } from "react-router-dom";


 

const TopNav :FC = ()=>{

    const username = "gowrish varma"

    const AccountType = "personal";

    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            e.preventDefault();
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };


 

    return (

        <div className="topnav-container">

            <Navbar bg="white" expand="lg" className="topnav-navbar px-3 shadow-sm">

                <Form className="topnav-search-form d-flex me-3" onSubmit={handleSearchSubmit}>

                    <FormControl 
                        type="search" 
                        placeholder="Search" 
                        className="topnav-search-input" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />

                </Form>


 

                <Dropdown align="end">

                    <Dropdown.Toggle variant="light" id="topnav-dropdown" className="topnav-profile-toggle">

                        <Image src="/assets/images/profile.webp" className="topnav-profile-img" />

                    </Dropdown.Toggle>

                    <Dropdown.Menu className="topnav-dropdown-menu shadow">

                        <Dropdown.Header role="button" onClick={()=>navigate("/profile")} className="topnav-dropdown-header">

                            <strong>{username}</strong>

                            <div>{AccountType}</div>

                        </Dropdown.Header>

                            <Dropdown.Divider />

                            <Dropdown.Item>Convert to bussiness</Dropdown.Item>

                            <Dropdown.Divider />

                            <Dropdown.Item>Convert to bussiness</Dropdown.Item>

                        <Dropdown.Item>Log Out</Dropdown.Item>

                    </Dropdown.Menu>

                </Dropdown>

            </Navbar>

        </div>

    )

}


 

export default TopNav;
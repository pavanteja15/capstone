
import React, { FC } from "react";

import { Navbar, Form, FormControl, Dropdown, Image } from "react-bootstrap";

import './topnav.css';

import { useNavigate } from "react-router-dom";


 

const TopNav :FC = ()=>{

    const username = "gowrish varma"

    const AccountType = "personal";


 

    const navigate = useNavigate();


 

    return (

        <div className="topnav-container">

            <Navbar bg="white" expand="lg" className="topnav-navbar px-3 shadow-sm">

                <Form className="topnav-search-form d-flex me-3">

                    <FormControl type="search" placeholder="Search" className="topnav-search-input" />

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
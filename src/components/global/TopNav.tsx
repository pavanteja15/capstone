
import React, { FC } from "react";

import { Navbar, Form, FormControl, Dropdown, Image } from "react-bootstrap";

import './topnav.css';

import { useNavigate } from "react-router-dom";


 

const TopNav :FC = ()=>{

    const username = "gowrish varma"

    const AccountType = "personal";


 

    const navigate = useNavigate();


 

    return (

        <div className="topnav">

            <Navbar bg="white" expand="lg" className="px-3 shadow-sm" style={{height:"70px"}}>

                <Form className="d-flex w-100 me-3">

                    <FormControl type="search" placeholder="Search" className="rounded-pill ps-4 search-input"

                    style={{backgroundColor:"#f1f1f1",height:"45px"}} />

                </Form>


 

                <Dropdown align="end">

                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="border-0 bg-white p-0">

                        <Image src="/assets/images/profile.webp" roundedCircle width={45} height={45} style={{cursor:"pointer"}}/>

                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow">

                        <Dropdown.Header role="button" onClick={()=>navigate("/profile")}>

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
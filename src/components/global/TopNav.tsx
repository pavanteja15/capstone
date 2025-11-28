import React, { FC, useEffect, useState, KeyboardEvent } from "react";
import { Navbar, Form, FormControl, Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./topnav.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUser } from "../../store/userSlice";
import { mapMediaPath, normalizeUserPayload } from "../../utils/userMapper";
import { UserResponse } from "../../types/user";

const API_BASE_URL = "http://localhost:8765";

const TopNav: FC = () => {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const username = user.fullname || user.name || "";
    const accountTypeLabel = user.accountType === 'BUSINESS' ? 'Business' : 'Personal';
    const profileImage = mapMediaPath(user.profilePath, API_BASE_URL) ?? "/assets/images/profile.webp";

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
    useEffect(() => {
        if (!user.userId || (user.fullname && user.name)) {
            return;
        }

        const controller = new AbortController();

        axios
            .get<UserResponse>(`${API_BASE_URL}/auth/user/${user.userId}`, { signal: controller.signal })
            .then((res) => {
                if (res.data) {
                    dispatch(setUser(normalizeUserPayload(res.data, user)));
                }
            })
            .catch(() => undefined);

        return () => controller.abort();
    }, [user.userId, user.fullname, user.name, dispatch]);

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

                        <Image src={profileImage} className="topnav-profile-img" />

                    </Dropdown.Toggle>

                    <Dropdown.Menu className="topnav-dropdown-menu shadow">

                        <Dropdown.Header role="button" onClick={()=>navigate("/profile")} className="topnav-dropdown-header">

                            <strong>{username}</strong>

                            <div>{accountTypeLabel}</div>

                        </Dropdown.Header>

                            <Dropdown.Divider />

                            <Dropdown.Item>Convert to business</Dropdown.Item>

                            <Dropdown.Divider />

                            <Dropdown.Item>Settings</Dropdown.Item>

                        <Dropdown.Item>Log Out</Dropdown.Item>

                    </Dropdown.Menu>

                </Dropdown>

            </Navbar>

        </div>

    )

}


 

export default TopNav;
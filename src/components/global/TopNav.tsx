import React, { FC, useEffect, useState, KeyboardEvent } from "react";
import { Navbar, Form, FormControl, Dropdown, Image, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./topnav.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUser, clearUser } from "../../store/userSlice";
import { mapMediaPath, normalizeUserPayload } from "../../utils/userMapper";
import { UserResponse } from "../../types/user";
import { clearAuth } from "../../utils/authUtils";

const API_BASE_URL = "http://localhost:8765";

const TopNav: FC = () => {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const username = user.username || user.name || "";
    const accountTypeLabel = user.accountType === 'BUSINESS' ? 'Business' : 'Personal';
    const profileImage = mapMediaPath(user.profilePath, API_BASE_URL) ?? "/assets/images/profile.webp";

    const [searchQuery, setSearchQuery] = useState("");
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [category, setCategory] = useState("General");
    const [isConverting, setIsConverting] = useState(false);
    const [convertError, setConvertError] = useState("");

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

    const handleLogout = () => {
        // Clear JWT token and user data from localStorage
        clearAuth();
        // Clear Redux state
        dispatch(clearUser());
        // Redirect to login page
        navigate('/');
    };

    const handleConvertToBusiness = async () => {
        if (!businessName.trim()) {
            setConvertError("Business name is required");
            return;
        }

        setIsConverting(true);
        setConvertError("");

        try {
            await axios.post(`${API_BASE_URL}/api/business/convert/${user.userId}`, {
                businessName: businessName.trim(),
                websiteUrl: websiteUrl.trim() || null,
                category: category
            });

            // Update Redux state with new account type
            dispatch(setUser({
                ...user,
                accountType: 'BUSINESS',
                businessName: businessName.trim(),
                websiteUrl: websiteUrl.trim()
            }));

            setShowConvertModal(false);
            setBusinessName("");
            setWebsiteUrl("");
            setCategory("General");
            
            // Show success and refresh
            alert("Successfully converted to a business account!");
        } catch (err: any) {
            console.error("Error converting to business:", err);
            const message = err.response?.data?.message || err.response?.data || "Failed to convert to business account";
            setConvertError(typeof message === 'string' ? message : "Failed to convert");
        } finally {
            setIsConverting(false);
        }
    };

    const categories = [
        "General",
        "Sports & Fitness",
        "Home & Decor",
        "Food & Beverage",
        "Beauty & Cosmetics",
        "Travel & Hospitality",
        "Fashion & Lifestyle",
        "Handmade & Crafts",
        "Technology",
        "Art & Design"
    ];

    useEffect(() => {
        if (!user.userId || (user.username && user.name)) {
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
    }, [user.userId, user.username, user.name, dispatch]);

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

                            {user.accountType !== 'BUSINESS' && (
                                <Dropdown.Item onClick={() => setShowConvertModal(true)}>
                                    Convert to business
                                </Dropdown.Item>
                            )}

                            <Dropdown.Divider />

                            <Dropdown.Item>Settings</Dropdown.Item>

                        <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>

                    </Dropdown.Menu>

                </Dropdown>

            </Navbar>

            {/* Convert to Business Modal */}
            <Modal show={showConvertModal} onHide={() => setShowConvertModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Convert to Business Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted mb-3">
                        Upgrade to a business account to access analytics, advertising tools, and more.
                    </p>
                    
                    {convertError && (
                        <div className="alert alert-danger">{convertError}</div>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Business Name *</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your business name"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Website URL</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="https://www.example.com"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Business Category</Form.Label>
                        <Form.Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConvertModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConvertToBusiness}
                        disabled={isConverting || !businessName.trim()}
                    >
                        {isConverting ? 'Converting...' : 'Convert to Business'}
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

    )

}


 

export default TopNav;
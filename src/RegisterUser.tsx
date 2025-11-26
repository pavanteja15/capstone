
import { FC, FormEvent, useEffect, useState } from "react";

import Validator from "./Validator";

import "./RegisterUser.css";

import axios from "axios";

const logo = "/assets/images/Pinterest-Logo.jpg";

interface UserState {

    email: string;

    userName: string;

    password: string;

    conformPassword: string;

    fullName: string;

    mobile: string;

    bio: string;

    accountType: "NORMAL" | "BUSINESS";

    businessName?: string;

    websiteUrl?: string;

}




interface UserErrorState {

    userNameError: string;

    emailError: string;

    passwordError: string;

    mobileError: string;

    fullNameError: string;

}




const RegisterUser: FC = () => {



    const [state, setState] = useState<UserState>({

        email: "",

        userName: "",

        password: "",

        conformPassword: "",

        fullName: "",

        mobile: "",

        bio: "",

        accountType: "NORMAL",

        businessName: "",

        websiteUrl: ""

    })




    const [formErrors, setFormErrors] = useState<UserErrorState>({

        userNameError: "",

        passwordError: "",

        emailError: "",

        mobileError: "",

        fullNameError: ""

    })




    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

        setState({

            ...state,

            [event.target.name]: event.target.value

        })

        validateField(event.target.name, event.target.value);

    }




    const [passwordMatchError, setPasswordMatchError] = useState<string>("");

    const [valid, setValid] = useState<boolean>(false);




    useEffect(() => {

        if (state.conformPassword && state.password !== state.conformPassword) {

            setPasswordMatchError("passwords do not match");

        }

        else {

            setPasswordMatchError("");

        }

    }, [state.password, state.conformPassword]);





    const validateField = (name: string, value: any): void => {

        let errors = formErrors;

        switch (name) {

            case "userName":

                errors.userNameError = Validator.validateUserName(value) ? "" : "Enter a valid username"

                break;

            case "password":

                errors.passwordError = Validator.validatePassword(value) ? "" : "Enter a valid password"

                break;

            case "mobile":

                errors.mobileError = Validator.validateMobile(value) ? "" : "Enter a valid mobile number"

                break;

            case "email":

                errors.emailError = Validator.validateEmail(value) ? "" : "Enter a valid email"

                break;

            case "fullName":

                errors.fullNameError = Validator.validateFullName(value) ? "" : "Enter a valid name"

                break;



            default:

                break;

        }

        setFormErrors(errors);

        setValid(Validator.validateForm(state) && Object.values(errors).every((value) => (value) === ""));

    }





    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault();

        try {

            await axios.post("http://localhost:8765/auth/registeruser", state);

            alert("regestered")

        }

        catch (err) {

            alert("Failed")

        }

    }




    return (

        <div className="register-container">

            <div className="reister-card">

                <div className="logo-container">

                    <img className="pinterest-logo" src={logo} alt="Pintrest Logo" />

                </div>

                <h2 className="text-center mb-4">Create Your Account</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group mb-3">

                        <label htmlFor="userName">User Name</label>

                        <input type="text"

                            className="form-control input-custom"

                            placeholder="Enter your user name"

                            name="userName"

                            id="userName"

                            value={state.userName}

                            onChange={handleChange} />

                        <span className="text-danger">

                            {formErrors.userNameError}

                        </span>

                    </div>

                    <div className="form-group mb-3">

                        <label htmlFor="fullName">Full Name</label>

                        <input type="text"

                            className="form-control input-custom"

                            placeholder="Enter your Full name"

                            name="fullName"

                            id="fullName"

                            value={state.fullName}

                            onChange={handleChange} />

                        <span className="text-danger" data-testid="userNameError">

                            {formErrors.fullNameError}

                        </span>

                    </div>

                    <div className="form-group mb-3">

                        <label htmlFor="bio">Bio</label>

                        <textarea

                            className="form-control input-custom"

                            placeholder="Enter your user name"

                            name="bio"

                            id="bio"

                            value={state.bio}

                            onChange={handleChange} />

                    </div>

                    <div className="form-group mb-3">

                        <label htmlFor="mobile">Mobile Number</label>

                        <input type="text"

                            className="form-control input-custom"

                            placeholder="Enter your mobile number"

                            name="mobile"

                            id="mobile"

                            value={state.mobile}

                            onChange={handleChange} />

                        <span className="text-danger" data-testid="userNameError">

                            {formErrors.mobileError}

                        </span>

                    </div>

                    <div className="form-group mb-3">

                        <label htmlFor="email">Email</label>

                        <input type="email"

                            className="form-control input-custom"

                            placeholder="Enter your user email"

                            name="email"

                            id="email"

                            value={state.email}

                            onChange={handleChange} />

                        <span className="text-danger" data-testid="userNameError">

                            {formErrors.emailError}

                        </span>

                    </div>

                    <div className="form-group mb-3">

                        <label htmlFor="password">Password</label>

                        <input type="text"

                            className="form-control input-custom"

                            placeholder="Enter the password"

                            name="password"

                            id="password"

                            value={state.password}

                            onChange={handleChange} />

                        <span className="text-danger" data-testid="userNameError">

                            {formErrors.passwordError}

                        </span>

                    </div>

                    <div className="form-group mb-3">

                        <label htmlFor="conformPassword">Conform Password</label>

                        <input type="text"

                            className="form-control input-custom"

                            placeholder="Enter the password again"

                            name="conformPassword"

                            id="conformPassword"

                            value={state.conformPassword}

                            onChange={handleChange} />

                        <span className="text-danger" data-testid="userNameError">

                            {passwordMatchError}

                        </span>

                    </div>

                    <div className="form-group mb-3">

                        <label htmlFor="accountType">Account Type</label>

                        <select name="accountType" className="form-control input-custom" value={state.accountType} onChange={handleChange}>

                            <option value="NORMAL">Normal Account</option>

                            <option value="BUSINESS">Business Account</option>

                        </select>

                    </div>

                    <div>

                        {state.accountType === "BUSINESS" && (

                            <div className="business-section animate-fade">

                                <div className="form-group mb-3">

                                    <label htmlFor="businessName">Business Name</label>

                                    <input type="text"

                                        className="form-control input-custom"

                                        placeholder="Enter the name of business"

                                        name="businessName"

                                        id="businessName"



                                        value={state.businessName}

                                        onChange={handleChange} />

                                </div>

                                <div className="form-group mb-3">

                                    <label htmlFor="websiteUrl">Website Url</label>

                                    <input type="text"

                                        className="form-control input-custom"

                                        placeholder="Enter the business website url"

                                        name="websiteUrl"

                                        id="websiteUrl"



                                        value={state.websiteUrl}

                                        onChange={handleChange} />

                                </div>

                            </div>

                        )}

                    </div>

                    <br />

                    <div className="text-center mt-4">

                        <button className="btn btn-danger pinterest-btn">Register</button>

                    </div>

                </form>

            </div>



        </div>

    )

}





export default RegisterUser;
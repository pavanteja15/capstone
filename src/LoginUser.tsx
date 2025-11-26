import { ChangeEvent, FC, FormEvent, useState } from "react";



 

interface UserState{

    email:string;

    password:string;

}


 

const LoginUser:FC = ()=>{

   

    const[state, setState] = useState<UserState>({

        email:"",

        password:"",

    })



 

    const handleChange = (event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{

        setState({

            ...state,

            [event.target.name]:event.target.value

        })

    }


 

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {

        throw new Error("Function not implemented.");

    }


 

    return(

        <div>

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label htmlFor="email" className="form-label">Email</label>

                    <input type="email"

                    className="form-control"

                    placeholder="Enter your user email"

                    name="email"

                    id="email"

                    value={state.email}

                    onChange={handleChange}/>

                </div>

                <div className="form-group">

                    <label htmlFor="password" className="form-label">Password</label>

                    <input type="text"

                    className="form-control"

                    placeholder="Enter the password"

                    name="password"

                    id="password"

                    value={state.password}

                    onChange={handleChange}/>

                </div>

                <br/>

                <div className="text-center">

                    <button type="submit" className="btn btn-primary">Submit</button>

                </div>

            </form>

        </div>

    )

}


 

export default LoginUser;
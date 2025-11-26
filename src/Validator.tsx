

 

class Validator{

    static validateUserName=(value:string)=>{

        const regex = /^([a-z0-9._-]+){4,}$/;

        return regex.test(value)

    }

    static validatePassword=(value:string)=>{

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

        return regex.test(value)

    }

    static validateEmail=(value:string)=>{

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org)$/;

        return regex.test(value)

    }

    static validateFullName=(value:string)=>{

        const regex = /^([A-Za-z]{2,})( [A-Za-z]{2,})*$/;

        return regex.test(value)

    }

    static validateMobile=(value:string)=>{

        const regex = /^[0-9]{10}$/;

        return regex.test(value)

    }

    static validateForm(state:any):boolean{

        if(state.userName==""||state.password==""){

            return false;

        }else{

            return true;

        }

    }

}


 

export default Validator;
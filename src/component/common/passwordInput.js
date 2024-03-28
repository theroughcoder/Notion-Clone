import React from "react"

const PasswordInput = (props) => {
    return (
        <div className="flex flex-col ">
            <label className=" py-1 sm:text-md text-slate-600" >{props.label && props.label}</label>
            <input required value={props.userInfo[props.name]} onChange={(e)=> props.setUserInfo((pre) => { return{...pre, [props.name] : e.target.value }})} className="pl-5 bg-slate-200 h-11 rounded-md" type="password" placeholder={props.placeholder && props.placeholder} />
        </div>
    )
};

export default PasswordInput;

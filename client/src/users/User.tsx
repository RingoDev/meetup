import React from "react";
import {AppUser, BaseUser} from "../data/User";
import "./User.css"
import {RootState} from "../redux/rootReducer";
import {getSortedUsers, getUsers} from "../redux/user/user.reducer";
import {ThunkDispatch} from "redux-thunk";
import {fetchUsers, postLocation, setUserChecked} from "../redux/user/user.actions";
import {connect, ConnectedProps} from "react-redux";

interface UserProps {
    user: AppUser
}

interface UserState {
}

type PropsFromRedux = ConnectedProps<typeof connector> & UserProps

const User: React.FC<PropsFromRedux> = (props) => {
    return (
        <>
            <div id={"userWrapper"}>
                <div>
                    {props.user.name}{props.user.isMain ? " this User" : " not this User"}
                </div>
                <div>
                    <div className="switch">
                        <label>
                            <input checked={props.user.checked}
                                   onChange={event => props.setChecked(props.user, event.target.checked)}
                                   type="checkbox"/>
                            <span className="lever"/>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}


const mapStateToProps = (state: RootState) => {
    return {}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
    return {
        setChecked: (user: AppUser, checked: boolean) => dispatch(setUserChecked(user, checked)),
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(User)
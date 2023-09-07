import userModel from "../models/personModel";
import { matchPassword } from "./hash_match_password";

const checkCredentials = async (emaill, password) => {

    try {
        const user = await userModel.findOne({ email: emaill });
        if (user == null) {
            return null;
        }
        else {
            const isPasswordMatching = await matchPassword(password, user.password);
            if (isPasswordMatching) {
                return true;
            }
            else {
                console.log(user);
                return false;
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default checkCredentials;
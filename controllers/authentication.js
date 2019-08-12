import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";
import firebase from "firebase";
const logger = require('pino')();

dotenv.config();



class Authentication {
    static async githubAuthentication(req, res){
        const { code } = req.query;
        logger.info(code);
        const url = `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`
        if( code){
            // request access_token from github
            const { data } = await axios({
                url,
            });
            // destructure response sent;
            const queries = querystring.parse(data);
            logger.info(queries);
            // check if access_token is sent
            const token = queries.access_token;
            if(token){
                try{
                // send access_token from github to firebase
                const credentials = await firebase.auth.GithubAuthProvider.credential(token);

                //receive new token from firebase
                const firebaseCredentials = await firebase.auth().signInWithCredential(credentials);
                const firebaseToken = await firebaseCredentials.user.getIdToken()
                if(firebaseToken){
                   return res.redirect(`javadevsapp://home/${firebaseToken}`);
                }
                else{
                    return res.send({
                        error_message: "oops!! something went wrong.",
                        error: firebaseCredentials
                    })
                }

            }
            catch(error){
                return res.send({
                    error_message: "oops! something went wrong.",
                    error
                });
            }
            }

            // on error return error_message
            return res.send(queries);

        }
        return res.status(400).send({
            message: "bad url",
            message_description: "url you passed is badly written or missing some parameters",
            message_uri: "https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/"
        })
    }
}

export default Authentication;
import userModel from "../models/userModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import sessionModel from "../models/sessionModel.js";

export async function registerUser(req, resp) {

    const { username, email, password } = req.body;
    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (isAlreadyRegistered) {
       return resp.status(409).json({
            message: "You are already registered "
        }

        )
    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userModel.create({
        username,
        email,
        password : hashedPassword
    })
    
    const Refreshtoken = jwt.sign({
        id: user._id
    },config.JWT_SECRET_KEY,{
        expiresIn : "15d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(Refreshtoken).digest("hex");

    const session = await sessionModel.create({
        userId: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers[" user-agent"]
    })

    const Accesstoken = jwt.sign({
        id: user._id,
        sessionId: session._id
    },config.JWT_SECRET_KEY,{
        expiresIn : "15m"
    })
    resp.cookie("refreshToken",Refreshtoken,{
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 7 *24 *60 * 60* 1000
    })

    return resp.status(201).json({
        message:"User created",
        token : Accesstoken
    })
}

export async function login(req,resp){
    const {email,password} = req.body
    const user = await userModel.findOne({email})

    if(!user){
        return resp.status(401).json({
            message: "User not found"
        })

    }
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    const isPasswordValid = hashedPassword === user.password;
    if(!isPasswordValid){
        return resp.status(401).json({
            message:"Password Invalid"
        })
    }
}
export async function get_me(req, resp) {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return resp.status(401).json({
            message: "Not a valid user"
        });
    }

    const decodedToken = jwt.verify(
        token,
        config.JWT_SECRET_KEY
    );

    const user = await userModel.findById(decodedToken.id);

    resp.status(200).json({
        message: "User found successfully",
        user: {
            username: user.username,
            email: user.email
        }
    });
}

export async function RefreshToken(req,resp){
    const refreshToken = req.cookies.refreshToken;
    

    if(!refreshToken){
        return resp.status(401).json({
            message:"User not found"
        })
    }
    const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY);
    const accessToken = jwt.sign({
        id: decoded.id
    },config.JWT_SECRET_KEY,{
        expiresIn: "15m"
    })
    const newRefresh = jwt.sign({
        id: decoded.id
    },config.JWT_SECRET_KEY,{
        expiresIn: "7d"
    })
    const newRefreshHash = crypto.createHash("sha256").update(newRefresh).digest("hex");
    session.refreshTokenHash = newRefreshHash;
    await session.save();

    resp.cookie("refreshToken",newRefresh,{
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 *60 * 1000 
    })
    resp.status(200).json({
        message: "Access token created",
        accessToken
    })

}

export async function logout(req,resp){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return resp.status(401).json({
            message: " Refresh token is invalid"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked:false 
    }) 
    if(!session){
        return resp.status(400).json({
            message:"Invalid sessionId "
        })

    }
    session.revoked = true;
    await session.save();
    resp.clearCookie("refreshToken");
    resp.status(201).json({
        message:"Logout successfully"
    })
}

export async function logoutAll(req,resp){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        resp.status(401).json({
            message: " Refresh Token invalid"
        })
        const decoded = jwt.verify(refreshToken,config.JWT_SECRET_KEY)

        await sessionModel.updateMany({
            user: decoded.id,
            revoked: false
        },{
            revoked: true
        })
        resp.clearCookie("refreshToken")
        resp.status(200).json({
            message:"Logged out succesfully all from device "
        })
    }
}


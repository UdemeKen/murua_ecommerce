import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import { imagekit } from "@packages/libs/imagekit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";
const Flutterwave = require("flutterwave-node-v3");

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


// Register a new user
export const userRegistration = async(req:Request, res:Response, next:NextFunction) => {
    try {
        validateRegistrationData(req.body, "user");
        const { name, email } = req.body;

        const existingUser = await prisma.users.findUnique({ where: { email } });

        if (existingUser) {
            return next(new ValidationError("User already exist with this email!"));
        };

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "user-activation-mail");

        res.status(200).json({
            message: "OTP sent to email. Please verify your account."
        }); 
    } catch (error) {
        return next(error);
    }
}

// Verify user with otp
export const verifyUser = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { email, otp, password, name } = req.body;
        if(!email || !otp || !password || !name) {
            return next(
                new ValidationError("All fields are required!")
            );
        }
        const existingUser = await prisma.users.findUnique({where: { email }});

        if(existingUser) {
            return next(
                new ValidationError("User already exists with this email!")
            );
        }
        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.users.create({
            data: { name, email, password: hashedPassword },
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
        });
    } catch (error) {
        return next(error);
    }
}

// Login user
export const loginUser = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return next(
                new ValidationError("Email and password are required!")
            );
        }

        const user = await prisma.users.findUnique({ where: { email }});

        if (!user) {
            return next(
                new AuthError("User doesn't exists!")
            );
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            return next(
                new AuthError("Invalid email or password")
            );
        }

        res.clearCookie("seller-access-token");
        res.clearCookie("seller-refresh-token");

        // Generate access and refresh token
        const accessToken = jwt.sign(
            { id: user.id, role: "user"},
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            { id: user.id, role: "user"},
            process.env.REFRESH_TOKEN_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        // Store the refresh and access token in an httpOnly secure cookie
        setCookie(res, "refresh_token", refreshToken);
        setCookie(res, "access_token", accessToken);

        res.status(200).json({
            message: "Login successful!",
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (error) {
        return next(error);
    }
}

// Refresh token
export const refreshToken = async(req: any, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies["refresh_token"] || req.cookies["seller-refresh-token"] || req.headers.authorization?.split(" ")[1];

        if (!refreshToken) {
            return next(new ValidationError("Unauthorized! No refresh token."));
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string; role: string };

        if (!decoded || !decoded.id || !decoded.role) {
            return next(new AuthError("Forbidden! Invalid refresh token."));
        }

        let account;
        if (decoded.role === "user"){
            account = await prisma.users.findUnique({ where: { id: decoded.id }});
        } else if(decoded.role === "seller") {
            account = await prisma.sellers.findUnique({ where: { id: decoded.id }, include: { shop: true }});
        }

        if (!account) {
            return next(new AuthError("Forbidden! User/Seller not found"));
        }

        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });

        if(decoded.role === "user") {
            setCookie(res, "access_token", newAccessToken);
        } else if(decoded.role === "seller") {
            setCookie(res, "seller-access-token", newAccessToken);
        }

        req.role = decoded.role;

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
}

// Get logged in user
export const getUser = async(req: any, res: Response, next:NextFunction) => {
    try {
        const user = req.user;
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
}

// User forgot password
export const userForgotPassword = async(req:Request, res:Response, next:NextFunction) => {
    await handleForgotPassword(req, res, next, 'user');
}

// Verify forgot password
export const verifyUserForgotPassword = async(req:Request, res:Response, next:NextFunction) => {
    await verifyForgotPasswordOtp(req, res, next);
}

// Reset user password
export const resetUserPassword = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { email, newpassword } = req.body;

        if(!email || !newpassword) {
            return next(
                new ValidationError("Email and new password are required!")
            )
        };

        const user = await prisma.users.findUnique({ where: { email }});
        if(!user) {
            return next(
                new ValidationError("User not found!")
            )
        };

        // Compare new password with the existing one
        const isSamePassword = await bcrypt.compare(newpassword, user.password!);

        if(isSamePassword) {
            return next(
                new ValidationError(
                    "New password cannot be the same as old password!"
                )
            );
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword },
        });

        res.status(200).json({
            message: "Password reset successful!"
        });
    } catch (error) {
        return next(error);
    }
}

// Register a new seller
export const registerSeller = async(req:Request, res:Response, next:NextFunction) => {
    try {
        validateRegistrationData(req.body, "seller");
        const { name, email } = req.body;

        const existingSeller = await prisma.sellers.findUnique({ where: { email }});

        if(existingSeller) {
            throw new ValidationError("Seller already exist with this email!");
        }

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "seller-activation");

        res.status(200).json({
            message: "OTP sent to email. Please verify your account."
        });
    } catch (error) {
        next(error);
    }
}

// Verify Seller with OTP
export const verifySeller = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { email, otp, password, name, phone_number, country, account_bank, account_number } = req.body;

        if(!email || !otp || !password || !name || !phone_number || !country || !account_bank || !account_number) {
            return next(new ValidationError(
                "All fields are required!"
            ));
        }

        const existingSeller = await prisma.sellers.findUnique({ where: { email } });

        if(existingSeller) {
            return next(new ValidationError(
                "Seller already exists with this email!"
            ));
        }

        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        const seller = await prisma.sellers.create({
            data: {
                name,
                email,
                password: hashedPassword,
                country,
                phone_number,
                account_bank,
                account_number,
            },
        });

        res.status(201).json({
            seller,
            message: "Seller registered successfully!"
        });
    } catch (error) {
        next(error);
    }
}

// Create a new shop
export const createShop = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { name, bio, address, opening_hours, website, category, sellerId, avatar } = req.body;

        if(!name || !bio || !address || !opening_hours || !category || !sellerId) {
            return next(new ValidationError("All fields are required!"));
        }

        const shopData: any = {
            name,
            bio,
            address,
            opening_hours,
            category,
            sellerId
        };

        if(website && website.trim() !== "") {
            shopData.website = website;
        }

        const shop = await prisma.shops.create({
            data: shopData,
        });

        if (avatar) {
            const uploadedAvatar = await imagekit.upload({
                file: avatar,
                fileName: `shop-${shop.id}-${Date.now()}.jpg`,
                folder: "/shops",
            });

            await prisma.images.create({
                data: {
                    file_id: uploadedAvatar.fileId,
                    url: uploadedAvatar.url,
                    shopId: shop.id,
                },
            });
        }

        const shopWithAvatar = await prisma.shops.findUnique({
            where: { id: shop.id },
            include: { avatar: true },
        });

        res.status(201).json({
            success: true,
            shop: shopWithAvatar,
        });
    } catch (error) {
        next(error);
    }
}

// create stripe connect account link
export const createPaymentAccountConnectLink = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { sellerId } = req.body;

        if(!sellerId) return next(new ValidationError("Seller ID is required!"));

        const seller = await prisma.sellers.findUnique({
            where: {
                id: sellerId,
            },
        });

        if(!seller) {
            return next(new ValidationError("Seller is not available with this id!"))
        }

        if (seller.flutterwaveId) {
            return res.status(400).json({
                status: "error",
                message: "Seller already onboarded",
            });
        }

        if (!seller.account_bank || !seller.account_number) {
            return res.status(400).json({
                status: "error",
                message: "Seller bank details incomplete",
            });
        }

        const subaccount = await flw.Subaccount.create({
            account_bank: seller.account_bank,
            account_number: seller.account_number,
            business_name: seller.name,
            business_email: seller.email,
            business_mobile: seller.phone_number,
            country: "NG",
            split_type: "percentage",
            split_value: 0.2,
        });

        if (subaccount.status !== "success") {
            return res.status(400).json({
                status: "error",
                message: subaccount.message,
            });
        }

        if (!subaccount.data) {
            return res.status(400).json({
                status: "error",
                message: "Failed to create subaccount",
            });
        }

        await prisma.sellers.update({
            where: {
                id: sellerId,
            },
            data: {
                flutterwaveId: subaccount.data.subaccount_id,
            },
        });

        return res.status(201).json({
            status: "success",
            message: "Subaccount created",
            data: {
                id: subaccount.data.id,
                subaccount_id: subaccount.data.subaccount_id,
                account_number: subaccount.data.account_number,
                account_bank: subaccount.data.account_bank,
                bank_name: subaccount.data.bank_name,
                split_type: subaccount.data.split_type,
                split_value: subaccount.data.split_value,
                created_at: subaccount.data.created_at
            },
        });
    } catch (error) {
        return next(error)
    }
}

// login seller
export const loginSeller = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return next(new ValidationError("Email and password are required!"));
        }

            const seller = await prisma.sellers.findUnique({ where: { email }});
            if(!seller) return next(new ValidationError("Invalid email or password!"));

            // Verify password
            const isMatch = await bcrypt.compare(password, seller?.password!);
            if(!isMatch) return next(new ValidationError("Invalid email or password!"));

            res.clearCookie("access_token");
            res.clearCookie("refresh_token");

        // Generate access and refresh token
        const accessToken = jwt.sign(
            { id: seller.id, role: "seller" },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m"}
        );
        const refreshToken = jwt.sign(
            { id: seller.id, role: "seller" },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        ); 

        // Store refresh token and access token
        setCookie(res, "seller-refresh-token", refreshToken);
        setCookie(res, "seller-access-token", accessToken);

        res.status(200).json({
            message: "Login Successful!",
            seller: { id: seller.id, email: seller.email, name: seller.name },
        });
    } catch (error) {
        return next(error);
    }
}

// get logged in seller
export const getSeller = async(req:any, res:Response, next:NextFunction) => {
    try {
        const seller = req.seller;
        res.status(201).json({
            success: true,
            seller,
        });
    } catch (error) {
        return next(error);
    }
}

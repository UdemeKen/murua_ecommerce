import prisma from "@packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";


const isAuthenticated = async(req:any, res:Response, next:NextFunction) => {
    try {
        const token = req.cookies["access_token"] || req.cookies["seller-access-token"] || req.headers.authorization?.split(" ")[1];

        if(!token) {
            return res.status(401).json({ message: "Unauthorized! Token missing." });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { 
            id: string; 
            role: "user" | "seller"; 
        };

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized! Invalid token."
            });
        }

        let account;

        if(decoded.role === "user") {
            await prisma.users.findUnique({
            where: { id: decoded.id },
            });
            req.user = account;
        } else if (decoded.role === "seller") {
            account = await prisma.sellers.findUnique({
                where: { id: decoded.id },
                include: {
                    shop: {
                        include: {
                            avatar: true,
                        },
                    },
                }
            });

            // Always fetch avatar by shopId so the sidebar does not depend on Prisma
            // relation population behavior.
            if (account?.shop?.id) {
                const avatarImages = await prisma.images.findMany({
                    where: { shopId: account.shop.id },
                    select: { id: true, file_id: true, url: true, shopId: true },
                });

                account = {
                    ...account,
                    shop: {
                        ...account.shop,
                        avatar: avatarImages,
                    },
                };
            }
            req.seller = account;
        }


        if(!account) {
            return res.status(401).json({
                message: "Account not found!"
            });
        }

        req.role = decoded.role;

        return next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized! Token expired or invalid."
        });
    }
}

export default isAuthenticated;
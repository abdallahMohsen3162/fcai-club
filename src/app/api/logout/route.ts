import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET() {
    try {
        // Delete the token cookie
        cookies().set('token', '', { httpOnly: true, expires: new Date(0) });

        // Create the JSON response
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
}
